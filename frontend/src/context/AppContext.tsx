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
    <AppContext.Provider value={{ user, setUser, kakaoId, selectedUser, setSelectedUser, activeChat, setActiveChat, isFinished, isLoading, isAuthenticated }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
