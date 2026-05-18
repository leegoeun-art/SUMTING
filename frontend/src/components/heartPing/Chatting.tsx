import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import { useAppContext } from '../../context/AppContext';
import MascotImage from '../MascotImage';
import SumungMascot from '../SumungMascot';
import { GLASS } from '../../utils/background';
import { RecommendedUser } from '../../types';
import { DEPARTMENT_MASCOT } from '../../constants';

interface ChatMessageResponse {
  id: number;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

function formatTime(isoStr: string): string {
  return new Date(isoStr).toLocaleTimeString('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

interface MatchedPartnerApiItem {
  userId:       string;
  nickname:     string;
  department:   string;
  mascotType:   string;
  lastMessage:  string | null;
  lastTime:     string | null;
  unreadCount:  number;
  age:          number | null;
  height:       number | null;
  myKw1:        string | null;
  myKw2:        string | null;
  myKw3:        string | null;
  yourKw1:      string | null;
  yourKw2:      string | null;
  yourKw3:      string | null;
}

interface ChatItem {
  id:          string;
  partner:     RecommendedUser;
  lastMessage: string;
  lastTime:    string;
  unread:      number;
}

export interface ChattingHandle {
  addChat: (user: RecommendedUser) => void;
  refresh: () => void;
}

function computeMatchScore(theirKeywords: string[], myIdealKeywords: string[]): number {
  const matchCount = theirKeywords.filter(k => myIdealKeywords.includes(k)).length;
  return Math.round((matchCount / 3) * 100);
}

function toApiChatItem(item: MatchedPartnerApiItem, idealKeywords: string[]): ChatItem {
  const keywords = [item.myKw1, item.myKw2, item.myKw3].filter((k): k is string => !!k);
  return {
    id:          `c-${item.userId}`,
    partner: {
      id:           item.userId,
      nickname:     item.nickname,
      department:   item.department,
      keywords,
      yourKeywords: [item.yourKw1, item.yourKw2, item.yourKw3].filter((k): k is string => !!k),
      mascotType:   DEPARTMENT_MASCOT[item.department] ?? 'basic',
      matchScore:   computeMatchScore(keywords, idealKeywords),
      age:          item.age ?? undefined,
      height:       item.height ?? undefined,
    },
    lastMessage: item.lastMessage
      ? item.lastMessage.startsWith('/api/chat/image/') ? '사진을 보냈습니다.' : item.lastMessage
      : '매칭되었어요! 먼저 인사해 보세요 👋',
    lastTime:    item.lastTime ? formatTime(item.lastTime) : '',
    unread:      item.unreadCount,
  };
}

interface ChattingProps {
  onProfileClick?: (user: RecommendedUser) => void;
}

const Chatting = forwardRef<ChattingHandle, ChattingProps>(({ onProfileClick }, ref) => {
  const navigate = useNavigate();
  const { setActiveChat, kakaoId, user } = useAppContext();
  const [chatList, setChatList] = useState<ChatItem[]>([]);

  const loadMatches = () => {
    const idealKeywords = user?.idealKeywords ?? [];
    fetch('/api/chat/matches', { credentials: 'include' })
      .then(res => (res.ok ? res.json() : []))
      .then((data: MatchedPartnerApiItem[]) => setChatList(data.map(item => toApiChatItem(item, idealKeywords))))
      .catch(() => {});
  };

  useEffect(() => { loadMatches(); }, [kakaoId, user]);

  const stompRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!kakaoId) return;

    const wsProto = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsHost = import.meta.env.PROD ? window.location.host : 'localhost:8080';
    const client = new Client({
      brokerURL: `${wsProto}://${wsHost}/ws`,
      onConnect: () => {
        client.subscribe('/user/queue/chat', frame => {
          const msg: ChatMessageResponse = JSON.parse(frame.body);
          if (msg.senderId === kakaoId) return;

          const chatId = `c-${msg.senderId}`;
          setChatList(prev =>
            prev.map(chat =>
              chat.id === chatId
                ? { ...chat, lastMessage: msg.content.startsWith('/api/chat/image/') ? '사진을 보냈습니다.' : msg.content, lastTime: formatTime(msg.createdAt), unread: chat.unread + 1 }
                : chat
            )
          );
        });
      },
    });

    client.activate();
    stompRef.current = client;
    return () => { client.deactivate(); stompRef.current = null; };
  }, [kakaoId]);

  useImperativeHandle(ref, () => ({
    refresh: loadMatches,
    addChat: (user: RecommendedUser) => {
      setChatList(prev => {
        if (prev.some(c => c.partner.id === user.id)) return prev;
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
    },
  }));

  if (chatList.length === 0) {
    return (
      <div className="h-56 flex flex-col items-center justify-center">
        <SumungMascot className="w-24 h-28 mb-3 opacity-50" />
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>아직 채팅이 없어요</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {chatList.map((chat) => (
        <div
          key={chat.id}
          className="w-full flex items-center gap-4 p-4 rounded-2xl active:scale-[0.98] transition-transform cursor-pointer"
          style={GLASS.card}
          onClick={() => {
            setActiveChat({ id: chat.id, partner: chat.partner, unreadCount: chat.unread });
            setChatList(prev => prev.map(c => c.id === chat.id ? { ...c, unread: 0 } : c));
            navigate('/chat');
          }}
        >
          <button
            className="relative flex-shrink-0"
            onClick={(e) => { e.stopPropagation(); onProfileClick?.(chat.partner); }}
          >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden" style={GLASS.icon}>
                <MascotImage type={chat.partner.mascotType} className="w-11 h-11" />
              </div>
              {chat.unread > 0 && (
                <div
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center"
                  style={{ background: '#ffffff' }}
                >
                  <span className="text-[8px] font-bold" style={{ color: '#C62A47' }}>
                    {chat.unread > 9 ? '9+' : chat.unread}
                  </span>
                </div>
              )}
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-white text-sm">{chat.partner.nickname}</h4>
                {chat.lastTime && (
                  <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.72)' }}>{chat.lastTime}</span>
                )}
              </div>
              <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.82)' }}>{chat.lastMessage}</p>
            </div>
          </div>
        ))}
    </div>
  );
});

Chatting.displayName = 'Chatting';
export default Chatting;