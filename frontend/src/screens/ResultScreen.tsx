import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import MascotImage from '../components/MascotImage';
import { MASCOTS } from '../constants';

const NICKNAMES = ['수줍은 토끼', '춤추는 구름', '비오는 날의 산책', '햇살 가득한 오후', '비밀의 정원', '우주 여행자'];

export default function ResultScreen() {
  const navigate = useNavigate();
  const { user, setUser } = useAppContext();

  const randomNickname = NICKNAMES[Math.floor(Math.random() * NICKNAMES.length)];
  const randomMascot = MASCOTS[Math.floor(Math.random() * MASCOTS.length)];

  const finalUser = {
    ...user,
    id: 'user_' + Math.random(),
    nickname: randomNickname,
    mascotType: randomMascot.id
  };

  const handleComplete = () => {
    setUser(finalUser as any);
    navigate('/home');
  };

  return (
    <div className="h-full w-full bg-[#0a0a0a] flex flex-col items-center p-8 text-center">
      <div className="mt-20 mb-12">
        <h1 className="text-2xl font-bold mb-4">당신의 숨팅 캐릭터가<br/>생성되었어요!</h1>
        <p className="text-gray-400 text-sm">축제 기간 동안 이 캐릭터로 활동하게 됩니다.</p>
      </div>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 10, stiffness: 100 }}
        className="flex flex-col items-center"
      >
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-purple-500/20 blur-[60px] rounded-full" />
          <MascotImage type={finalUser.mascotType} className="w-64 h-64 relative" />
        </div>

        <div className="bg-[#1a1a1a] px-8 py-3 rounded-full border border-gray-800 mb-2">
          <span className="text-xl font-bold text-white">{finalUser.nickname}</span>
        </div>
        <p className="text-sm text-gray-500">{finalUser.department}</p>
      </motion.div>

      <div className="flex-1" />

      <button
        onClick={handleComplete}
        className="w-full py-4 bg-white text-black font-bold rounded-2xl mb-4 active:scale-95 transition-transform"
      >
        홈으로 이동하기
      </button>
    </div>
  );
}
