/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from './context/AppContext';

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

function AnimatedRoutes() {
  const location = useLocation();
  const { isFinished } = useAppContext();

  if (isFinished) {
    return <EndingScreen />;
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
          <Route path="/" element={<SplashScreen />} />
          <Route path="/start" element={<StartScreen />} />
          <Route path="/signup" element={<SignupScreen />} />
          <Route path="/keyword" element={<KeywordSelectionScreen />} />
          <Route path="/ideal" element={<IdealTypeScreen />} />
          <Route path="/result" element={<ResultScreen />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/detail" element={<UserDetailScreen />} />
          <Route path="/heartpings" element={<HeartPingListScreen />} />
          <Route path="/match-success" element={<MatchSuccessScreen />} />
          <Route path="/chat" element={<ChatScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/ending" element={<EndingScreen />} />
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
