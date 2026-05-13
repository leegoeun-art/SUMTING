/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from './context/AppContext';

import StartPage from '@/src/pages/StartPage.tsx';
import SignupPage from '@/src/pages/SignupPage.tsx';
import HomePage from '@/src/pages/HomePage.tsx';
import HeartPingListPage from '@/src/pages/HeartPingListPage.tsx';
import ChatPage from '@/src/pages/ChatPage.tsx';
import ProfilePage from '@/src/pages/ProfilePage.tsx';

function AnimatedRoutes() {
  const location = useLocation();
  useAppContext(); // context 구독 (현재 라우팅에서 직접 사용하지 않음)

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
          <Route path="/" element={<StartPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/heartpings" element={<HeartPingListPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/profile" element={<ProfilePage />} />
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
