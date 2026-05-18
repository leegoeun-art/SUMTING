import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MoreHorizontal } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import SumungMascot from '../components/SumungMascot';
import NavBar from '../utils/NavBar';
import { GlowBackground, GLASS } from '../utils/background';
import { RecommendedUser } from '../types';
import { DEPARTMENT_MASCOT } from '../constants';
import Receive from '../components/heartPing/Receive';
import SendCard from '../components/heartPing/Send';
import Chatting, { ChattingHandle } from '../components/heartPing/Chatting';

/* ── 하트핑 API 공통 응답 형태 ── */
interface HeartPingApiItem {
  user_id:    string;
  nickname:   string;
  gender:     boolean;
  department: string;
  age:        number;
  height:     number;
  my_kw1:     string | null;
  my_kw2:     string | null;
  my_kw3:     string | null;
  your_kw1:   string | null;
  your_kw2:   string | null;
  your_kw3:   string | null;
  status:     string;
}

interface SentItem {
  id:     string;
  user:   RecommendedUser;
  status: 'accepted' | 'pending' | 'rejected';
}

function toReceivedUser(item: HeartPingApiItem): RecommendedUser {
  return {
    id:         item.user_id,
    nickname:   item.nickname,
    department: item.department,
    keywords:   [item.my_kw1, item.my_kw2, item.my_kw3].filter((k): k is string => !!k),
    mascotType: DEPARTMENT_MASCOT[item.department] ?? 'basic',
    matchScore: 0,
  };
}

function toSentItem(item: HeartPingApiItem): SentItem {
  return {
    id:   item.user_id,
    user: {
      id:         item.user_id,
      nickname:   item.nickname,
      department: item.department,
      keywords:   [item.my_kw1, item.my_kw2, item.my_kw3].filter((k): k is string => !!k),
      mascotType: DEPARTMENT_MASCOT[item.department] ?? 'basic',
      matchScore: 0,
    },
    status: item.status?.toUpperCase() === 'MATCHED'
      ? 'accepted'
      : (item.status?.toUpperCase() === 'REJECTED' || item.status?.toUpperCase() === 'EXITED')
        ? 'rejected'
        : 'pending',
  };
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="h-56 flex flex-col items-center justify-center">
      <SumungMascot className="w-24 h-28 mb-3 opacity-50" />
      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>{label}</p>
    </div>
  );
}

type TabType = 'received' | 'sent' | 'chat';

const TABS: { key: TabType; label: string }[] = [
  { key: 'received', label: '받은 하트핑' },
  { key: 'sent',     label: '보낸 하트핑' },
  { key: 'chat',     label: '1:1 채팅'  },
];

export default function HeartPingListPage() {
  const { addRejected, sentPings, setActiveChat } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const initialTab = (location.state as { tab?: TabType } | null)?.tab ?? 'received';
  const chattingRef = useRef<ChattingHandle>(null);

  const [tab,          setTab]          = useState<TabType>(initialTab);
  const [receivedList, setReceivedList] = useState<RecommendedUser[]>([]);
  const [apiSentList,  setApiSentList]  = useState<SentItem[]>([]);

  useEffect(() => {
    if (tab !== 'received') return;
    fetch('/api/receiveHeartPing', { credentials: 'include' })
      .then(res => (res.ok ? res.json() : []))
      .then((data: HeartPingApiItem[]) =>
        setReceivedList(
          data
            .filter(item => item.status?.toUpperCase() === 'PENDING')
            .map(toReceivedUser)
        )
      )
      .catch(() => {});
  }, [tab]);

  useEffect(() => {
    if (tab !== 'sent') return;
    fetch('/api/sendHeartPing', { credentials: 'include' })
      .then(res => (res.ok ? res.json() : []))
      .then((data: HeartPingApiItem[]) => setApiSentList(data.map(toSentItem)))
      .catch(() => {});
  }, [tab]);

  const handleStartChat = (user: RecommendedUser) => {
    chattingRef.current?.addChat(user);
    setReceivedList(prev => prev.filter(u => u.id !== user.id));
    setTab('chat');
  };

  const handleRejected = (id: string) => {
    setReceivedList(prev => prev.filter(u => u.id !== id));
    addRejected(id);
  };

  return (
    <GlowBackground>
      <Helmet><title>하트핑 - 숨팅</title></Helmet>

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
          <button style={{ color: 'rgba(255,255,255,0.85)' }}><MoreHorizontal size={20} /></button>
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
                : { color: 'rgba(255,255,255,0.85)' }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="flex-1 overflow-y-auto px-6 pb-28 z-10">
        <AnimatePresence mode="wait">

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
                  onRejected={handleRejected}
                />
              ))}
              {receivedList.length === 0 && <EmptyState label="아직 받은 하트핑이 없어요" />}
            </motion.div>
          )}

          {tab === 'sent' && (
            <motion.div key="sent"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="space-y-3"
            >
              {apiSentList.map((item) => (
                <SendCard
                  key={item.id}
                  item={item}
                  onOpenChat={(u) => { setActiveChat({ id: `c-${u.id}`, partner: u, unreadCount: 0 }); navigate('/chat'); }}
                />
              ))}
              {sentPings
                .filter(u => !apiSentList.some(s => s.user.id === u.id))
                .map(u => (
                  <SendCard
                    key={`ctx-${u.id}`}
                    item={{ id: `ctx-${u.id}`, user: u, status: 'pending' }}
                  />
                ))
              }
              {apiSentList.length === 0 && sentPings.length === 0 && (
                <EmptyState label="아직 보낸 하트핑이 없어요" />
              )}
            </motion.div>
          )}

          {tab === 'chat' && (
            <motion.div key="chat"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            >
              <Chatting ref={chattingRef} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <NavBar />
    </GlowBackground>
  );
}
