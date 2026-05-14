import { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { UserProfile, RecommendedUser, Chat } from '../types';
import { FESTIVAL_END_TIME } from '../constants';

interface AppContextType {
  user: UserProfile | null;
  setUser: Dispatch<SetStateAction<UserProfile | null>>;
  kakaoId: string | null;
  selectedUser: RecommendedUser | null;
  setSelectedUser: Dispatch<SetStateAction<RecommendedUser | null>>;
  activeChat: Chat | null;
  setActiveChat: Dispatch<SetStateAction<Chat | null>>;
  isFinished: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  /** userId → 거절한 시각(ms) 맵 */
  rejectedUsers: Record<string, number>;
  /** 거절 처리 — localStorage에 저장하여 새로고침 후에도 유지 */
  addRejected: (userId: string) => void;
  /** 하트핑을 보낸 유저 목록 */
  sentPings: RecommendedUser[];
  /** 하트핑 보내기 */
  addSentPing: (user: RecommendedUser) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [kakaoId, setKakaoId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<RecommendedUser | null>(null);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 거절한 userId → 거절 시각(ms) 맵, localStorage 영속
  const [rejectedUsers, setRejectedUsers] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem('sumting_rejected');
      return stored ? (JSON.parse(stored) as Record<string, number>) : {};
    } catch { return {}; }
  });

  const addRejected = (userId: string) => {
    setRejectedUsers(prev => {
      const next = { ...prev, [userId]: Date.now() };
      localStorage.setItem('sumting_rejected', JSON.stringify(next));
      return next;
    });
  };

  const [sentPings, setSentPings] = useState<RecommendedUser[]>([]);

  const addSentPing = (user: RecommendedUser) => {
    setSentPings(prev => {
      if (prev.some(u => u.id === user.id)) return prev;
      return [user, ...prev];
    });
  };

  const logout = () => {
    setUser(null);
    setKakaoId(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    fetch('/api/me', { credentials: 'include', redirect: 'manual', cache: 'no-store' })
      .then(async res => {
        if (res.type === 'opaqueredirect' || res.status === 0 || res.status === 401 || res.status === 403) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        const data = res.status === 200 ? await res.json() : null;
        setIsAuthenticated(true);
        if (data?.id) setKakaoId(data.id);
        // department가 있으면 회원가입 완료된 회원
        if (data?.department) setUser(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = new Date(FESTIVAL_END_TIME).getTime() - new Date().getTime();
      if (remaining <= 0) {
        setIsFinished(true);
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser, kakaoId, selectedUser, setSelectedUser, activeChat, setActiveChat, isFinished, isLoading, isAuthenticated, logout, rejectedUsers, addRejected, sentPings, addSentPing }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
