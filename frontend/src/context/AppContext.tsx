import { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { UserProfile, RecommendedUser, Chat } from '../types';
import { FESTIVAL_END_TIME } from '../constants';

interface AppContextType {
  user: UserProfile | null;
  setUser: Dispatch<SetStateAction<UserProfile | null>>;
  selectedUser: RecommendedUser | null;
  setSelectedUser: Dispatch<SetStateAction<RecommendedUser | null>>;
  activeChat: Chat | null;
  setActiveChat: Dispatch<SetStateAction<Chat | null>>;
  isFinished: boolean;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedUser, setSelectedUser] = useState<RecommendedUser | null>(null);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/me', { credentials: 'include' })
      .then(res => (res.ok ? res.json() : null))
      .then(data => { if (data) setUser(data); })
      .catch(() => {})
      .finally(() => setIsLoading(false));
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
    <AppContext.Provider value={{ user, setUser, selectedUser, setSelectedUser, activeChat, setActiveChat, isFinished, isLoading }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
