import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MoreHorizontal, RefreshCw } from 'lucide-react';
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
import HpProfileModal from '../components/heartPing/HpProfileModal';

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

function computeMatchScore(theirKeywords: string[], myIdealKeywords: string[]): number {
  const matchCount = theirKeywords.filter(k => myIdealKeywords.includes(k)).length;
  return Math.round((matchCount / 3) * 100);
}

function toReceivedUser(item: HeartPingApiItem, idealKeywords: string[]): RecommendedUser {
  const keywords = [item.my_kw1, item.my_kw2, item.my_kw3].filter((k): k is string => !!k);
  return {
    id:           item.user_id,
    nickname:     item.nickname,
    department:   item.department,
    age:          item.age,
    height:       item.height,
    keywords,
    yourKeywords: [item.your_kw1, item.your_kw2, item.your_kw3].filter((k): k is string => !!k),
    mascotType:   DEPARTMENT_MASCOT[item.department] ?? 'basic',
    matchScore:   computeMatchScore(keywords, idealKeywords),
  };
}

function toSentItem(item: HeartPingApiItem, idealKeywords: string[]): SentItem {
  const keywords = [item.my_kw1, item.my_kw2, item.my_kw3].filter((k): k is string => !!k);
  return {
    id:   item.user_id,
    user: {
      id:           item.user_id,
      nickname:     item.nickname,
      department:   item.department,
      age:          item.age,
      height:       item.height,
      keywords,
      yourKeywords: [item.your_kw1, item.your_kw2, item.your_kw3].filter((k): k is string => !!k),
      mascotType:   DEPARTMENT_MASCOT[item.department] ?? 'basic',
      matchScore:   computeMatchScore(keywords, idealKeywords),
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
  const { user, addRejected, sentPings, setActiveChat } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const initialTab = (location.state as { tab?: TabType } | null)?.tab ?? 'received';
  const chattingRef = useRef<ChattingHandle>(null);

  const [tab,          setTab]          = useState<TabType>(initialTab);
  const [receivedList, setReceivedList] = useState<RecommendedUser[]>([]);
  const [apiSentList,  setApiSentList]  = useState<SentItem[]>([]);
  const [refreshing,   setRefreshing]   = useState(false);
  const [profileUser,  setProfileUser]  = useState<RecommendedUser | null>(null);

  const idealKeywords = user?.idealKeywords ?? [];

  const loadReceived = () => {
    setRefreshing(true);
    fetch('/api/receiveHeartPing', { credentials: 'include' })
      .then(res => (res.ok ? res.json() : []))
      .then((data: HeartPingApiItem[]) =>
        setReceivedList(
          data
            .filter(item => item.status?.toUpperCase() === 'PENDING')
            .map(item => toReceivedUser(item, idealKeywords))
        )
      )
      .catch(() => {})
      .finally(() => setRefreshing(false));
  };

  const loadSent = () => {
    setRefreshing(true);
    fetch('/api/sendHeartPing', { credentials: 'include' })
      .then(res => (res.ok ? res.json() : []))
      .then((data: HeartPingApiItem[]) => setApiSentList(data.map(item => toSentItem(item, idealKeywords))))
      .catch(() => {})
      .finally(() => setRefreshing(false));
  };

  useEffect(() => {
    if (tab !== 'received') return;
    loadReceived();
  }, [tab]);

  useEffect(() => {
    if (tab !== 'sent') return;
    loadSent();
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
          <button
            onClick={() => {
              if (tab === 'received') loadReceived();
              else if (tab === 'sent') loadSent();
              else chattingRef.current?.refresh();
            }}
            style={{ color: 'rgba(255,255,255,0.85)' }}
          >
            <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
          </button>
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
                  onProfileClick={setProfileUser}
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
                  onProfileClick={setProfileUser}
                />
              ))}
              {sentPings
                .filter(u => !apiSentList.some(s => s.user.id === u.id))
                .map(u => (
                  <SendCard
                    key={`ctx-${u.id}`}
                    item={{ id: `ctx-${u.id}`, user: u, status: 'pending' }}
                    onProfileClick={setProfileUser}
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

      <HpProfileModal user={profileUser} onClose={() => setProfileUser(null)} />
    </GlowBackground>
  );
}
