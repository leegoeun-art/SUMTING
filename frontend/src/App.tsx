/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, HeartPing, RecommendedUser, Chat } from './types';
import { FESTIVAL_END_TIME } from './constants';

// Screens
import SplashScreen from './screens/SplashScreen';
import StartScreen from './screens/StartScreen';
import SignupScreen from './screens/SignupScreen';
import KeywordSelectionScreen from './screens/KeywordSelectionScreen';
import IdealTypeScreen from './screens/IdealTypeScreen';
import ResultScreen from './screens/ResultScreen';
import HomeScreen from './screens/HomeScreen';
import UserDetailScreen from './screens/UserDetailScreen';
import HeartPingListScreen from './screens/HeartPingListScreen';
import MatchSuccessScreen from './screens/MatchSuccessScreen';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScreen';
import EndingScreen from './screens/EndingScreen';

export type ScreenName = 
  | 'splash' | 'start' | 'signup' | 'keyword' | 'ideal' 
  | 'result' | 'home' | 'detail' | 'heartpings' 
  | 'match-success' | 'chat' | 'profile' | 'ending';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('splash');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedUser, setSelectedUser] = useState<RecommendedUser | null>(null);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  // Timer logic for festival ending
  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = new Date(FESTIVAL_END_TIME).getTime() - new Date().getTime();
      if (remaining <= 0) {
        setIsFinished(true);
        setCurrentScreen('ending');
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const navigate = (screen: ScreenName) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    if (isFinished && currentScreen !== 'ending') {
      return <EndingScreen />;
    }

    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onComplete={() => navigate('start')} />;
      case 'start':
        return <StartScreen onStart={() => navigate('signup')} />;
      case 'signup':
        return <SignupScreen onComplete={(data) => {
          setUser(prev => ({ ...prev, ...data } as UserProfile));
          navigate('keyword');
        }} />;
      case 'keyword':
        return <KeywordSelectionScreen onComplete={(keywords) => {
          setUser(prev => ({ ...prev, keywords } as UserProfile));
          navigate('ideal');
        }} />;
      case 'ideal':
        return <IdealTypeScreen onComplete={(idealKeywords) => {
          setUser(prev => ({ ...prev, idealKeywords } as UserProfile));
          navigate('result');
        }} />;
      case 'result':
        return <ResultScreen 
          user={user!} 
          onComplete={(finalUser) => {
            setUser(finalUser);
            navigate('home');
          }} 
        />;
      case 'home':
        return <HomeScreen 
          user={user!} 
          onSelectUser={(u) => {
            setSelectedUser(u);
            navigate('detail');
          }}
          onViewHeartPings={() => navigate('heartpings')}
          onViewProfile={() => navigate('profile')}
        />;
      case 'detail':
        return <UserDetailScreen 
          user={selectedUser!} 
          onBack={() => navigate('home')}
          onSendHeartPing={() => navigate('heartpings')}
        />;
      case 'heartpings':
        return <HeartPingListScreen 
          onBack={() => navigate('home')}
          onMatch={(partner) => {
            setSelectedUser(partner);
            navigate('match-success');
          }}
        />;
      case 'match-success':
        return <MatchSuccessScreen 
          partner={selectedUser!} 
          onChat={() => {
            setActiveChat({
              id: 'chat_' + Math.random(),
              partner: selectedUser!,
              unreadCount: 0
            });
            navigate('chat');
          }}
        />;
      case 'chat':
        return <ChatScreen 
          chat={activeChat!} 
          onBack={() => navigate('home')} 
        />;
      case 'profile':
        return <ProfileScreen 
          user={user!} 
          onBack={() => navigate('home')} 
        />;
      case 'ending':
        return <EndingScreen />;
      default:
        return <SplashScreen onComplete={() => navigate('start')} />;
    }
  };

  return (
    <div className="h-screen w-full max-w-[430px] mx-auto bg-black overflow-hidden relative font-sans text-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="h-full w-full"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

