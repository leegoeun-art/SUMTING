import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import MascotImage from '../components/MascotImage';

export default function MatchSuccessPage() {
  const navigate = useNavigate();
  const { selectedUser, setActiveChat } = useAppContext();

  if (!selectedUser) {
    navigate('/home');
    return null;
  }

  const handleChat = () => {
    setActiveChat({
      id: 'chat_' + Math.random(),
      partner: selectedUser,
      unreadCount: 0
    });
    navigate('/chat');
  };

  return (
    <div className="h-full w-full bg-[#0a0a0a] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      {/* Background celebration */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-pink-500/20 blur-[60px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-blue-500/20 blur-[60px] rounded-full animate-pulse delay-1000" />

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 12 }}
        className="z-10"
      >
        <div className="flex gap-4 mb-8 justify-center items-center">
          <MascotImage type="basic" className="w-24 h-24 rotate-[-12deg]" />
          <div className="text-4xl text-pink-500 font-bold">♥</div>
          <MascotImage type={selectedUser.mascotType} className="w-24 h-24 rotate-[12deg]" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">매칭 성공!</h1>
        <p className="text-gray-400 mb-12">
          {selectedUser.nickname}님과<br/>새로운 대화를 시작해보세요.
        </p>

        <button
          onClick={handleChat}
          className="w-72 py-4 bg-white text-black font-bold rounded-2xl shadow-xl shadow-white/10 mb-4 active:scale-95 transition-transform"
        >
          대화하러 가기
        </button>
      </motion.div>
    </div>
  );
}
