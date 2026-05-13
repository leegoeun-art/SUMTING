import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft, Heart, Send, Plus,
  MoreHorizontal, Check, X, Clock,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import MascotImage from '../components/MascotImage';
import SumungMascot from '../components/SumungMascot';
import NavBar from '../utils/NavBar';
import { RecommendedUser, Message as IMessage } from '../types';

/* ── Mock 데이터 ── */
const MOCK_RECEIVED: RecommendedUser[] = [
  {
    id: 'r1', nickname: '달빛토끼', department: '디자인학과',
    mascotType: 'heart', keywords: ['감성적인', '열정적인', '카페탐방'], matchScore: 92,
  },
  {
    id: 'r2', nickname: '별빛여우', department: '심리학과',
    mascotType: 'shy', keywords: ['다정한', '빠른 답장', '새벽감성'], matchScore: 85,
  },
];

const MOCK_SENT = [
  { id: 's1', user: { id: 'u1', nickname: '달빛토끼',  department: '디자인학과', mascotType: 'heart', keywords: [], matchScore: 0 }, status: 'accepted' as const },
  { id: 's2', user: { id: 'u2', nickname: '별빛여우',  department: '심리학과',   mascotType: 'shy',   keywords: [], matchScore: 0 }, status: 'pending'  as const },
  { id: 's3', user: { id: 'u3', nickname: '솜사탕곰',  department: '경영학과',   mascotType: 'basic', keywords: [], matchScore: 0 }, status: 'pending'  as const },
];

const MOCK_CHATS = [
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
      <SumungMascot className="w-24 h-28 opacity-50 mb-3" />
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}

/* ── 인라인 채팅 화면 ── */
function ChatView({
  partner,
  onBack,
}: {
  partner: RecommendedUser;
  onBack: () => void;
}) {
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
        timestamp: new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit', minute: '2-digit', hour12: false,
        }),
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
      className="absolute inset-0 z-50 flex flex-col bg-[#0d0a1e]"
    >
      {/* 헤더 */}
      <div
        className="flex items-center px-4 py-3 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(13,10,30,0.9)', backdropFilter: 'blur(12px)' }}
      >
        <button onClick={onBack} className="p-2 -ml-2 text-gray-400">
          <ChevronLeft size={22} />
        </button>
        <div className="flex items-center gap-3 ml-1 flex-1">
          <div className="w-10 h-10 bg-[#1a1630] rounded-xl flex items-center justify-center overflow-hidden">
            <MascotImage type={partner.mascotType} className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">{partner.nickname}</h3>
            <p className="text-[10px] text-gray-500">{partner.department} · 익명 채팅</p>
          </div>
        </div>
        <button className="p-2 text-gray-500">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <div className="flex justify-center">
          <span className="text-[10px] text-gray-500 px-3 py-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}>
            익명으로 보호되는 채팅입니다 🔒
          </span>
        </div>

        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
            {m.senderId !== 'me' && (
              <div className="w-8 h-8 bg-[#1a1630] rounded-xl flex items-center justify-center mr-2 self-end mb-4 flex-shrink-0">
                <MascotImage type={partner.mascotType} className="w-6 h-6" />
              </div>
            )}
            <div className={`flex flex-col gap-1 max-w-[72%] ${m.senderId === 'me' ? 'items-end' : 'items-start'}`}>
              <div
                className={`rounded-[20px] px-4 py-2.5 text-sm leading-relaxed ${
                  m.senderId === 'me'
                    ? 'text-white rounded-tr-none'
                    : 'text-gray-200 rounded-tl-none'
                }`}
                style={
                  m.senderId === 'me'
                    ? { background: 'linear-gradient(135deg, #7C3AED, #A855F7)' }
                    : { background: '#1a1630', border: '1px solid rgba(255,255,255,0.07)' }
                }
              >
                {m.text}
              </div>
              <span className="text-[9px] text-gray-600">{m.timestamp}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 입력창 */}
      <div className="px-4 py-3 pb-6"
        style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(13,10,30,0.95)' }}>
        <div
          className="flex items-center gap-2 rounded-[24px] px-4 py-2"
          style={{ background: '#1a1630', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <button className="text-gray-500 flex-shrink-0"><Plus size={20} /></button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="메시지를 입력하세요"
            className="flex-1 bg-transparent outline-none text-sm text-white py-2 placeholder-gray-600"
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            className={`p-2 rounded-full flex-shrink-0 transition-all ${
              input.trim() ? 'text-white' : 'text-gray-600'
            }`}
            style={input.trim() ? { background: 'linear-gradient(135deg, #7C3AED, #A855F7)' } : {}}
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
  { key: 'received', label: '받은 숨핑' },
  { key: 'sent',     label: '보낸 숨핑' },
  { key: 'chat',     label: '1:1 채팅'  },
];

/* ── 메인 컴포넌트 ── */
export default function HeartPingListPage() {
  const [tab, setTab]             = useState<TabType>('received');
  const [activeChat, setActiveChat] = useState<RecommendedUser | null>(null);
  useAppContext(); // context 유지

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #120C28 0%, #0D0A1E 100%)' }}>

      {/* ── 인라인 채팅 화면 (슬라이드 인) ── */}
      <AnimatePresence>
        {activeChat && (
          <ChatView
            key="chat-view"
            partner={activeChat}
            onBack={() => setActiveChat(null)}
          />
        )}
      </AnimatePresence>

      {/* ── 헤더 ── */}
      <div className="px-6 pt-6 pb-3 flex items-center justify-between flex-shrink-0">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          {tab === 'received' && <>받은 숨핑 <span>💜</span></>}
          {tab === 'sent'     && <>보낸 숨핑 <span>💜</span></>}
          {tab === 'chat'     && '1:1 채팅'}
        </h2>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div key={i}
                className={`rounded-full transition-all ${
                  i === 0 ? 'w-4 h-1.5 bg-pink-400' : 'w-1.5 h-1.5 bg-gray-700'
                }`}
              />
            ))}
          </div>
          <button className="p-1 text-gray-500"><MoreHorizontal size={20} /></button>
        </div>
      </div>

      {/* ── 탭 바 ── */}
      <div className="px-6 mb-4 flex-shrink-0">
        <div className="flex p-1 rounded-2xl" style={{ background: '#1a1630' }}>
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                tab === key ? 'text-white shadow-lg' : 'text-gray-500'
              }`}
              style={tab === key
                ? { background: 'linear-gradient(135deg, #7C3AED, #A855F7)', boxShadow: '0 4px 12px rgba(124,58,237,0.35)' }
                : {}}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 탭 콘텐츠 ── */}
      <div className="flex-1 overflow-y-auto px-6 pb-28">
        <AnimatePresence mode="wait">

          {/* 받은 숨핑 */}
          {tab === 'received' && (
            <motion.div key="received"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="space-y-3">
              {MOCK_RECEIVED.map((u) => (
                <div key={u.id}
                  className="flex items-center gap-4 p-4 rounded-2xl"
                  style={{ background: '#1a1630', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="w-14 h-14 bg-[#241d3a] rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0">
                    <MascotImage type={u.mascotType} className="w-11 h-11" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-sm">{u.nickname}</h4>
                    <p className="text-xs text-gray-500 mb-2">{u.department}</p>
                    <div className="flex flex-wrap gap-1">
                      {u.keywords.map((k) => (
                        <span key={k} className="text-[9px] px-1.5 py-0.5 rounded text-gray-400"
                          style={{ background: 'rgba(255,255,255,0.05)' }}>
                          #{k}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button className="w-9 h-9 rounded-full flex items-center justify-center text-white"
                      style={{ background: 'linear-gradient(135deg, #FF6FA8, #FF3E8A)', boxShadow: '0 4px 10px rgba(255,80,140,0.35)' }}>
                      <Check size={16} strokeWidth={3} />
                    </button>
                    <button className="w-9 h-9 bg-gray-800 text-gray-400 rounded-full flex items-center justify-center">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {MOCK_RECEIVED.length === 0 && <EmptyState label="아직 받은 숨핑이 없어요" />}
            </motion.div>
          )}

          {/* 보낸 숨핑 */}
          {tab === 'sent' && (
            <motion.div key="sent"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="space-y-3">
              {MOCK_SENT.map((item) => (
                <div key={item.id}
                  className="flex items-center gap-4 p-4 rounded-2xl"
                  style={{ background: '#1a1630', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="w-14 h-14 bg-[#241d3a] rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0">
                    <MascotImage type={item.user.mascotType} className="w-11 h-11" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-sm">{item.user.nickname}</h4>
                    <p className="text-xs text-gray-500">{item.user.department}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {item.status === 'accepted' ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 px-3 py-1.5 rounded-full"
                        style={{ background: 'rgba(52,211,153,0.12)' }}>
                        <Check size={12} strokeWidth={3} /> 수락됨
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-800 px-3 py-1.5 rounded-full">
                        <Clock size={12} /> 대기중
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {MOCK_SENT.length === 0 && <EmptyState label="아직 보낸 숨핑이 없어요" />}
            </motion.div>
          )}

          {/* 1:1 채팅 목록 */}
          {tab === 'chat' && (
            <motion.div key="chat"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="space-y-3">
              {MOCK_CHATS.map((chat) => (
                <button key={chat.id}
                  onClick={() => setActiveChat(chat.partner)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl text-left active:scale-[0.98] transition-transform"
                  style={{ background: '#1a1630', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 bg-[#241d3a] rounded-2xl flex items-center justify-center overflow-hidden">
                      <MascotImage type={chat.partner.mascotType} className="w-11 h-11" />
                    </div>
                    {chat.unread > 0 && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-[8px] font-bold text-white">{chat.unread}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-white text-sm">{chat.partner.nickname}</h4>
                      <span className="text-[10px] text-gray-600">{chat.lastTime}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
                  </div>
                </button>
              ))}
              {MOCK_CHATS.length === 0 && <EmptyState label="아직 채팅이 없어요" />}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── 공통 하단 네비게이션 ── */}
      <NavBar />
    </div>
  );
}
