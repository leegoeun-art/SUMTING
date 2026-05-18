import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft, Send, Plus, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Client } from '@stomp/stompjs';
import { useAppContext } from '../context/AppContext';
import { Message as IMessage } from '../types';
import MascotImage from '../components/MascotImage';
import { GRADIENT, GLASS, COLORS } from '../utils/background';
import HpProfileModal from '../components/heartPing/HpProfileModal';

interface ChatMessageResponse {
  id: number;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

function formatTime(isoStr: string): string {
  return new Date(isoStr).toLocaleTimeString('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function toDisplayMessage(m: ChatMessageResponse, kakaoId: string | null): IMessage {
  return {
    id:        m.id.toString(),
    senderId:  m.senderId === kakaoId ? 'me' : m.senderId,
    text:      m.content,
    timestamp: formatTime(m.createdAt),
    isRead:    m.isRead,
  };
}

export default function ChatPage() {
  const navigate = useNavigate();
  const { activeChat, kakaoId } = useAppContext();
  const [messages, setMessages]     = useState<IMessage[]>([]);
  const [input, setInput]           = useState('');
  const [menuOpen, setMenuOpen]         = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [reportStep, setReportStep]     = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [uploading, setUploading]    = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const stompClientRef              = useRef<Client | null>(null);
  const bottomRef                   = useRef<HTMLDivElement | null>(null);
  const fileInputRef                = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!activeChat) return;
    fetch(`/api/chat/read?partnerUuid=${activeChat.partner.id}`, { method: 'POST', credentials: 'include' });
  }, [activeChat?.id]);

  useEffect(() => {
    if (!activeChat) return;
    const partnerUuid = activeChat.partner.id;

    fetch(`/api/chat/messages?partnerUuid=${partnerUuid}`, { credentials: 'include' })
      .then(res => (res.ok ? res.json() : []))
      .then((data: ChatMessageResponse[]) =>
        setMessages(data.map(m => toDisplayMessage(m, kakaoId)))
      )
      .catch(() => {});

    const wsProto = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsHost = import.meta.env.PROD ? window.location.host : 'localhost:8080';
    const client = new Client({
      brokerURL: `${wsProto}://${wsHost}/ws`,
      onConnect: () => {
        client.subscribe('/user/queue/chat', frame => {
          const msg: ChatMessageResponse = JSON.parse(frame.body);
          if (
            msg.senderId === partnerUuid ||
            msg.receiverId === partnerUuid
          ) {
            setMessages(prev => [...prev, toDisplayMessage(msg, kakaoId)]);
            fetch(`/api/chat/read?partnerUuid=${partnerUuid}`, { method: 'POST', credentials: 'include' });
          }
        });

        client.subscribe('/user/queue/chat-read', () => {
          setMessages(prev => prev.map(m =>
            m.senderId === 'me' ? { ...m, isRead: true } : m
          ));
        });
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
      stompClientRef.current = null;
    };
  }, [activeChat?.partner.id, kakaoId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!activeChat) {
      navigate('/heartpings');
    }
  }, [activeChat, navigate]);

  if (!activeChat) return null;

  const closeMenu = () => { setMenuOpen(false); setConfirmLeave(false); setReportStep(false); setReportReason(''); };

  const handleReport = async () => {
    await fetch(
      `/api/chat/report?partnerUuid=${activeChat.partner.id}&reason=${encodeURIComponent(reportReason)}`,
      { method: 'POST', credentials: 'include' }
    );
    navigate('/heartpings', { state: { tab: 'chat' } });
  };

  const handleLeave = async () => {
    await fetch(`/api/chat/leave?partnerUuid=${activeChat.partner.id}`, {
      method: 'POST',
      credentials: 'include',
    });
    navigate('/heartpings', { state: { tab: 'chat' } });
  };

  const sendImage = async (file: File) => {
    if (!stompClientRef.current?.connected) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/chat/upload', { method: 'POST', body: form, credentials: 'include' });
      if (!res.ok) return;
      const { url } = await res.json();
      stompClientRef.current.publish({
        destination: '/app/chat.send',
        body: JSON.stringify({ receiverUuid: activeChat!.partner.id, content: url }),
      });
    } finally {
      setUploading(false);
    }
  };

  const send = () => {
    if (!input.trim() || !stompClientRef.current?.connected) return;
    stompClientRef.current.publish({
      destination: '/app/chat.send',
      body: JSON.stringify({ receiverUuid: activeChat.partner.id, content: input }),
    });
    setInput('');
  };

  return (
    <div className="h-full w-full flex flex-col relative" style={{ background: GRADIENT }}>
      <Helmet><title>채팅 - 숨팅</title></Helmet>
      {/* 헤더 */}
      <div
        className="flex items-center px-4 py-3 border-b flex-shrink-0"
        style={{ borderColor: 'rgba(255,255,255,0.2)', background: 'rgba(255,140,120,0.3)', backdropFilter: 'blur(12px)' }}
      >
        <button onClick={() => navigate('/heartpings', { state: { tab: 'chat' } })} className="p-2 -ml-2 text-white/80">
          <ChevronLeft size={22} />
        </button>
        <div className="flex items-center gap-3 ml-1 flex-1">
          <button
            className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden active:opacity-75"
            style={GLASS.icon}
            onClick={() => setProfileOpen(true)}
          >
            <MascotImage type={activeChat.partner.mascotType} className="w-8 h-8" />
          </button>
          <div>
            <h3 className="font-bold text-sm text-white">{activeChat.partner.nickname}</h3>
            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.88)' }}>{activeChat.partner.department} · 익명 채팅</p>
          </div>
        </div>
        <button onClick={() => setMenuOpen(true)} className="p-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <div className="flex justify-center">
          <span
            className="text-[10px] px-3 py-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.3)' }}
          >
            익명으로 보호되는 채팅입니다 🔒
          </span>
        </div>

        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
            {m.senderId !== 'me' && (
              <button
                className="w-8 h-8 rounded-xl flex items-center justify-center mr-2 self-end mb-4 flex-shrink-0 active:opacity-75"
                style={GLASS.icon}
                onClick={() => setProfileOpen(true)}
              >
                <MascotImage type={activeChat.partner.mascotType} className="w-6 h-6" />
              </button>
            )}
            <div className={`flex flex-col gap-1 max-w-[72%] ${m.senderId === 'me' ? 'items-end' : 'items-start'}`}>
              <div
                className={`rounded-[20px] px-4 py-2.5 text-sm leading-relaxed ${m.senderId === 'me' ? 'rounded-tr-none' : 'rounded-tl-none'}`}
                style={
                  m.senderId === 'me'
                    ? { background: '#ffffff', color: COLORS.primary, fontWeight: 500 }
                    : { background: 'rgba(255,255,255,0.25)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)' }
                }
              >
                {m.text.startsWith('/api/chat/image/') ? (
                  <img src={m.text} className="max-w-[200px] rounded-xl" />
                ) : m.text}
              </div>
              <div className="flex items-center gap-1">
                {m.senderId === 'me' && (
                  <span className="text-[9px] font-medium" style={{ color: m.isRead ? 'rgba(255,255,255,0.55)' : 'rgba(255,230,180,0.95)' }}>
                    {m.isRead ? '읽음' : '안읽음'}
                  </span>
                )}
                <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.70)' }}>{m.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* 입력창 */}
      <div
        className="px-4 py-3 pb-6 flex-shrink-0"
        style={{ borderTop: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,140,120,0.2)', backdropFilter: 'blur(12px)' }}
      >
        <div
          className="flex items-center gap-2 rounded-[24px] px-4 py-2 overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.4)' }}
        >
          <button
            style={{ color: uploading ? 'rgba(255,255,255,0.40)' : 'rgba(255,255,255,0.80)' }}
            className="flex-shrink-0"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            <Plus size={20} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) { sendImage(f); e.target.value = ''; } }}
          />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="메시지를 입력하세요"
            className="flex-1 min-w-0 bg-transparent outline-none text-sm py-2"
            style={{ color: '#ffffff' }}
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            className="p-2 rounded-full flex-shrink-0 transition-all"
            style={input.trim() ? { background: '#ffffff', color: COLORS.primary } : { color: 'rgba(255,255,255,0.60)' }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      <HpProfileModal
        user={profileOpen ? activeChat.partner : null}
        onClose={() => setProfileOpen(false)}
      />

      <AnimatePresence>
        {menuOpen && (
          <>
            {/* 오버레이 */}
            <motion.div
              className="absolute inset-0 z-20"
              style={{ background: 'rgba(0,0,0,0.45)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMenu}
            />

            {/* 바텀시트 */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 z-30 rounded-t-3xl"
              style={{
                background: 'rgba(220,80,80,0.92)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.25)',
              }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            >
              {reportStep ? (
                <div className="flex flex-col py-2">
                  <div className="w-10 h-1 rounded-full mx-auto mt-3 mb-1" style={{ background: 'rgba(255,255,255,0.35)' }} />
                  <p className="text-white font-bold text-sm text-center py-3">신고 사유를 선택해주세요</p>
                  {['욕설 / 비방', '불쾌한 내용', '스팸', '기타'].map((reason) => (
                    <button
                      key={reason}
                      className="w-full px-6 py-3.5 text-left text-sm font-medium active:bg-white/10 flex items-center justify-between"
                      style={{ color: reportReason === reason ? '#ffffff' : 'rgba(255,255,255,0.75)' }}
                      onClick={() => setReportReason(reason)}
                    >
                      <span>{reason}</span>
                      {reportReason === reason && <span className="text-base">✓</span>}
                    </button>
                  ))}
                  <div className="flex gap-3 px-6 mt-3 pb-8">
                    <button
                      className="flex-1 py-3 rounded-2xl text-sm font-bold"
                      style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff' }}
                      onClick={() => { setReportStep(false); setReportReason(''); }}
                    >
                      취소
                    </button>
                    <button
                      className="flex-1 py-3 rounded-2xl text-sm font-bold"
                      style={reportReason
                        ? { background: '#ffffff', color: COLORS.primary }
                        : { background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.4)' }}
                      disabled={!reportReason}
                      onClick={handleReport}
                    >
                      신고하기
                    </button>
                  </div>
                </div>
              ) : !confirmLeave ? (
                <div className="flex flex-col py-2">
                  <div className="w-10 h-1 rounded-full mx-auto mt-3 mb-3" style={{ background: 'rgba(255,255,255,0.35)' }} />
                  <button
                    className="w-full px-6 py-4 text-left text-sm font-medium text-white active:bg-white/10"
                    onClick={() => setReportStep(true)}
                  >
                    차단 및 신고
                  </button>
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.18)', margin: '0 24px' }} />
                  <button
                    className="w-full px-6 py-4 text-left text-sm font-medium active:bg-white/10"
                    style={{ color: '#FFD0C8' }}
                    onClick={() => setConfirmLeave(true)}
                  >
                    방 나가기
                  </button>
                  <div className="pb-6" />
                </div>
              ) : (
                <div className="flex flex-col items-center px-6 pt-6 pb-8 gap-3">
                  <div className="w-10 h-1 rounded-full mb-1" style={{ background: 'rgba(255,255,255,0.35)' }} />
                  <p className="font-bold text-white text-base text-center">채팅방을 나가시겠어요?</p>
                  <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.72)' }}>
                    나가면 이 채팅방은 목록에서 사라져요
                  </p>
                  <div className="flex gap-3 w-full mt-3">
                    <button
                      className="flex-1 py-3 rounded-2xl text-sm font-bold"
                      style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff' }}
                      onClick={closeMenu}
                    >
                      취소
                    </button>
                    <button
                      className="flex-1 py-3 rounded-2xl text-sm font-bold"
                      style={{ background: '#ffffff', color: COLORS.primary }}
                      onClick={handleLeave}
                    >
                      나가기
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
