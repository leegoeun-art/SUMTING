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

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAppContext();
  if (isLoading) return null;
  return user !== null ? <>{children}</> : <Navigate to="/" replace />;
}

function AnimatedRoutes() {
  const location = useLocation();

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
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/heartpings" element={<ProtectedRoute><HeartPingListPage /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
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
