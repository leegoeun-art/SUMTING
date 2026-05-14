import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MoreHorizontal, Send, Plus, ChevronLeft } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import MascotImage from '../components/MascotImage';
import SumungMascot from '../components/SumungMascot';
import NavBar from '../utils/NavBar';
import { GlowBackground, GRADIENT, GLASS, COLORS } from '../utils/background';
import { RecommendedUser, Message as IMessage } from '../types';
import Receive from '../components/heartPing/Receive';
import SendCard from '../components/heartPing/Send';

/* ── Mock 데이터 ── */
const INITIAL_RECEIVED: RecommendedUser[] = [
  {
    id: 'r1', nickname: '달빛토끼', department: '디자인학과',
    mascotType: 'heart', keywords: ['감성적인', '열정적인', '카페탐방'], matchScore: 92,
  },
  {
    id: 'r2', nickname: '별빛여우', department: '심리학과',
    mascotType: 'shy', keywords: ['다정한', '빠른 답장', '새벽감성'], matchScore: 85,
  },
];

const INITIAL_SENT = [
  { id: 's1', user: { id: 'u1', nickname: '달빛토끼',  department: '디자인학과', mascotType: 'heart', keywords: [], matchScore: 0 }, status: 'accepted' as const },
  { id: 's2', user: { id: 'u2', nickname: '별빛여우',  department: '심리학과',   mascotType: 'shy',   keywords: [], matchScore: 0 }, status: 'pending'  as const },
  { id: 's3', user: { id: 'u3', nickname: '솜사탕곰',  department: '경영학과',   mascotType: 'basic', keywords: [], matchScore: 0 }, status: 'pending'  as const },
];

const INITIAL_CHATS = [
  {
    id: 'c1',
    partner: { id: 'u1', nickname: '달빛토끼', department: '디자인학과', mascotType: 'heart', keywords: [], matchScore: 0 },
    lastMessage: '맞아요ㅎㅎ 축제 어디서 봐요?',
    lastTime: '22:17',
    unread: 1,
  },
];

const INITIAL_MESSAGES: IMessage[] = [
  { id: '1', senderId: 'u1', text: '안녕하세요! 숨팅 매칭됐네요 ✨',       timestamp: '22:14' },
  { id: '2', senderId: 'me', text: '안녕하세요! 저도 기대하고 있었어요 🌙', timestamp: '22:15' },
  { id: '3', senderId: 'u1', text: '디자인학과 다니시나요? 작품 보고 싶어요', timestamp: '22:16' },
  { id: '4', senderId: 'me', text: '맞아요ㅎㅎ 축제 어디서 봐요?',          timestamp: '22:17' },
];

/* ── 빈 상태 ── */
function EmptyState({ label }: { label: string }) {
  return (
    <div className="h-56 flex flex-col items-center justify-center">
      <SumungMascot className="w-24 h-28 mb-3" style={{ opacity: 0.5 }} />
      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</p>
    </div>
  );
}

/* ── 인라인 채팅 화면 ── */
function ChatView({ partner, onBack }: { partner: RecommendedUser; onBack: () => void }) {
  const [messages, setMessages] = useState<IMessage[]>(INITIAL_MESSAGES);
  const [input, setInput]       = useState('');

  const send = () => {
    if (!input.trim()) return;
    setMessages(prev => [
      ...prev,
      {
        id:        Date.now().toString(),
        senderId:  'me',
        text:      input,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }),
      },
    ]);
    setInput('');
  };

  return (
    <motion.div
      key="chat-view"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'tween', duration: 0.25 }}
      className="absolute inset-0 z-50 flex flex-col"
      style={{ background: GRADIENT }}
    >
      {/* 헤더 */}
      <div
        className="flex items-center px-4 py-3 border-b flex-shrink-0"
        style={{ borderColor: 'rgba(255,255,255,0.2)', background: 'rgba(198,42,71,0.3)', backdropFilter: 'blur(12px)' }}
      >
        <button onClick={onBack} className="p-2 -ml-2 text-white/80">
          <ChevronLeft size={22} />
        </button>
        <div className="flex items-center gap-3 ml-1 flex-1">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden" style={GLASS.icon}>
            <MascotImage type={partner.mascotType} className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">{partner.nickname}</h3>
            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.65)' }}>{partner.department} · 익명 채팅</p>
          </div>
        </div>
        <button className="p-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
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
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mr-2 self-end mb-4 flex-shrink-0" style={GLASS.icon}>
                <MascotImage type={partner.mascotType} className="w-6 h-6" />
              </div>
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
                {m.text}
              </div>
              <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{m.timestamp}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 입력창 */}
      <div
        className="px-4 py-3 pb-6 flex-shrink-0"
        style={{ borderTop: '1px solid rgba(255,255,255,0.2)', background: 'rgba(198,42,71,0.2)', backdropFilter: 'blur(12px)' }}
      >
        <div
          className="flex items-center gap-2 rounded-[24px] px-4 py-2"
          style={{ background: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.4)' }}
        >
          <button style={{ color: 'rgba(255,255,255,0.6)' }} className="flex-shrink-0"><Plus size={20} /></button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="메시지를 입력하세요"
            className="flex-1 bg-transparent outline-none text-sm py-2"
            style={{ color: '#ffffff' }}
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            className="p-2 rounded-full flex-shrink-0 transition-all"
            style={input.trim() ? { background: '#ffffff', color: '#C62A47' } : { color: 'rgba(255,255,255,0.4)' }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ── 탭 타입 ── */
type TabType = 'received' | 'sent' | 'chat';

const TABS: { key: TabType; label: string }[] = [
  { key: 'received', label: '받은 하트핑' },
  { key: 'sent',     label: '보낸 하트핑' },
  { key: 'chat',     label: '1:1 채팅'  },
];

/* ── 채팅 항목 타입 ── */
interface ChatItem {
  id: string;
  partner: RecommendedUser;
  lastMessage: string;
  lastTime: string;
  unread: number;
}

/* ── 메인 컴포넌트 ── */
export default function HeartPingListPage() {
  const { addRejected, sentPings } = useAppContext();
  const location = useLocation();
  const initialTab = (location.state as { tab?: TabType } | null)?.tab ?? 'received';

  const [tab,          setTab]          = useState<TabType>(initialTab);
  const [activeChat,   setActiveChat]   = useState<RecommendedUser | null>(null);
  const [receivedList, setReceivedList] = useState<RecommendedUser[]>(INITIAL_RECEIVED);
  const [chatList,     setChatList]     = useState<ChatItem[]>(INITIAL_CHATS);

  /* 나중에 하기 → 채팅 목록만 추가, 받은 하트핑 탭 유지 */
  const handleLater = (user: RecommendedUser) => {
    setChatList(prev => {
      if (prev.some(c => c.partner.id === user.id)) return prev;
      return [{
        id:          `c-${user.id}`,
        partner:     user,
        lastMessage: '매칭되었어요! 먼저 인사해 보세요 👋',
        lastTime:    new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }),
        unread:      0,
      }, ...prev];
    });
    setReceivedList(prev => prev.filter(u => u.id !== user.id));
    // 탭 이동 없음 — 받은 하트핑 화면 유지
  };

  /* 1:1 채팅 시작하기 → 채팅 목록 추가 후 채팅 탭으로 이동 */
  const handleStartChat = (user: RecommendedUser) => {
    // 이미 채팅 목록에 없으면 추가
    setChatList(prev => {
      const exists = prev.some(c => c.partner.id === user.id);
      if (exists) return prev;
      return [
        {
          id:          `c-${user.id}`,
          partner:     user,
          lastMessage: '매칭되었어요! 먼저 인사해 보세요 👋',
          lastTime:    new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }),
          unread:      0,
        },
        ...prev,
      ];
    });
    // 받은 목록에서 제거
    setReceivedList(prev => prev.filter(u => u.id !== user.id));
    // 채팅 탭으로 이동 + 채팅 화면 열기
    setTab('chat');
    setActiveChat(user);
  };

  /* 거절 → 받은 목록에서만 제거 + 24시간 홈 노출 차단 등록 */
  const handleRejected = (id: string) => {
    setReceivedList(prev => prev.filter(u => u.id !== id));
    addRejected(id);
  };

  return (
    <GlowBackground>

      {/* 인라인 채팅 화면 */}
      <AnimatePresence>
        {activeChat && (
          <ChatView key="chat-view" partner={activeChat} onBack={() => setActiveChat(null)} />
        )}
      </AnimatePresence>

      {/* 헤더 */}
      <div className="px-6 pt-6 pb-3 flex items-center justify-between flex-shrink-0 z-10">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          {tab === 'received' && <>받은 하트핑 <Heart size={18} fill="white" className="text-white" /></>}
          {tab === 'sent'     && <>보낸 하트핑 <Heart size={18} fill="white" className="text-white" /></>}
          {tab === 'chat'     && '1:1 채팅'}
        </h2>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div key={i}
                className="rounded-full transition-all"
                style={{
                  width:      i === 0 ? '16px' : '6px',
                  height:     '6px',
                  background: i === 0 ? '#ffffff' : 'rgba(255,255,255,0.3)',
                }}
              />
            ))}
          </div>
          <button style={{ color: 'rgba(255,255,255,0.7)' }}><MoreHorizontal size={20} /></button>
        </div>
      </div>

      {/* 탭 바 */}
      <div className="px-6 mb-4 flex-shrink-0 z-10">
        <div className="flex p-1 rounded-2xl" style={GLASS.card}>
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="flex-1 py-2.5 text-xs font-bold rounded-xl transition-all"
              style={tab === key
                ? { background: '#ffffff', color: '#C62A47', boxShadow: '0 4px 12px rgba(198,42,71,0.25)' }
                : { color: 'rgba(255,255,255,0.65)' }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="flex-1 overflow-y-auto px-6 pb-28 z-10">
        <AnimatePresence mode="wait">

          {/* 받은 하트핑 */}
          {tab === 'received' && (
            <motion.div key="received"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="space-y-3"
            >
              {receivedList.map((u) => (
                <Receive
                  key={u.id}
                  user={u}
                  onStartChat={handleStartChat}
                  onLater={handleLater}
                  onRejected={handleRejected}
                />
              ))}
              {receivedList.length === 0 && <EmptyState label="아직 받은 하트핑이 없어요" />}
            </motion.div>
          )}

          {/* 보낸 하트핑 */}
          {tab === 'sent' && (
            <motion.div key="sent"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="space-y-3"
            >
              {/* context에서 방금 보낸 하트핑 (pending) */}
              {sentPings.map((user) => (
                <SendCard
                  key={`ctx-${user.id}`}
                  item={{ id: `ctx-${user.id}`, user, status: 'pending' }}
                />
              ))}
              {/* 기존 Mock 데이터 */}
              {INITIAL_SENT.map((item) => (
                <SendCard
                  key={item.id}
                  item={item}
                  onOpenChat={(user) => {
                    setTab('chat');
                    setActiveChat(user);
                  }}
                />
              ))}
              {sentPings.length === 0 && INITIAL_SENT.length === 0 && (
                <EmptyState label="아직 보낸 하트핑이 없어요" />
              )}
            </motion.div>
          )}

          {/* 1:1 채팅 목록 */}
          {tab === 'chat' && (
            <motion.div key="chat"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="space-y-3"
            >
              {chatList.map((chat) => (
                <button key={chat.id}
                  onClick={() => setActiveChat(chat.partner)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl text-left active:scale-[0.98] transition-transform"
                  style={GLASS.card}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden" style={GLASS.icon}>
                      <MascotImage type={chat.partner.mascotType} className="w-11 h-11" />
                    </div>
                    {chat.unread > 0 && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: '#ffffff' }}>
                        <span className="text-[8px] font-bold" style={{ color: '#C62A47' }}>{chat.unread}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-white text-sm">{chat.partner.nickname}</h4>
                      <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{chat.lastTime}</span>
                    </div>
                    <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.6)' }}>{chat.lastMessage}</p>
                  </div>
                </button>
              ))}
              {chatList.length === 0 && <EmptyState label="아직 채팅이 없어요" />}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <NavBar />
    </GlowBackground>
  );
}
