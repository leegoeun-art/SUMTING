/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from './context/AppContext';

import SplashPage from '@/src/pages/SplashPage.tsx';
import StartPage from '@/src/pages/StartPage.tsx';
import SignupPage from '@/src/pages/SignupPage.tsx';
import KeywordSelectionPage from '@/src/pages/KeywordSelectionPage.tsx';
import IdealTypePage from '@/src/pages/IdealTypePage.tsx';
import ResultPage from '@/src/pages/ResultPage.tsx';
import HomePage from '@/src/pages/HomePage.tsx';
import UserDetailPage from '@/src/pages/UserDetailPage.tsx';
import HeartPingListPage from '@/src/pages/HeartPingListPage.tsx';
import MatchSuccessPage from '@/src/pages/MatchSuccessPage.tsx';
import ChatPage from '@/src/pages/ChatPage.tsx';
import ProfilePage from '@/src/pages/ProfilePage.tsx';
import EndingPage from '@/src/pages/EndingPage.tsx';

function AnimatedRoutes() {
  const location = useLocation();
  const { isFinished } = useAppContext();

  if (isFinished) {
    return <EndingPage />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="h-full w-full"
      >
        <Routes location={location}>
          <Route path="/" element={<SplashPage />} />
          <Route path="/start" element={<StartPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/keyword" element={<KeywordSelectionPage />} />
          <Route path="/ideal" element={<IdealTypePage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/detail" element={<UserDetailPage />} />
          <Route path="/heartpings" element={<HeartPingListPage />} />
          <Route path="/match-success" element={<MatchSuccessPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/ending" element={<EndingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

//고은이 origin  `  준혁이 upstream(준혁이 origin)`
//고은이 local     준혁이 local


export default function App() {
  return (
    <div className="h-screen w-full max-w-[430px] mx-auto bg-black overflow-hidden relative font-sans text-white">
      <AnimatedRoutes />
    </div>
  );
}
