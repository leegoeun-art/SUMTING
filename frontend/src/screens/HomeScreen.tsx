import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, MessageCircle, User, Bell, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import MascotImage from '../components/MascotImage';
import { RecommendedUser } from '../types';
import { FESTIVAL_END_TIME } from '../constants';

const MOCK_RECOMMENDATIONS: RecommendedUser[] = [
  { id: '1', nickname: '달콤한 바나나', department: '컴퓨터공학과', keywords: ['외향적인', '어른스러운', '열정적인'], mascotType: 'cool', matchScore: 92 },
  { id: '2', nickname: '새벽녘 산책자', department: '미술대학', keywords: ['내향적인', '차분한', '시크한'], mascotType: 'shy', matchScore: 88 },
  { id: '3', nickname: '여름밤의 꿈', department: '심리학과', keywords: ['다정한', '솔직한', '긍정적인'], mascotType: 'heart', matchScore: 85 },
  { id: '4', nickname: '구름 한 스푼', department: '경영학부', keywords: ['귀여운', '유머러스한', '엉뚱한'], mascotType: 'basic', matchScore: 79 },
];

export default function HomeScreen() {
  const navigate = useNavigate();
  const { user, setSelectedUser } = useAppContext();
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(FESTIVAL_END_TIME).getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeLeft('EPISODE ENDED');
        clearInterval(timer);
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSelectUser = (u: RecommendedUser) => {
    setSelectedUser(u);
    navigate('/detail');
  };

  return (
    <div className="h-full w-full bg-[#0a0a0a] flex flex-col relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[#1a1a2e] to-transparent opacity-50 z-0" />
      <div className="absolute top-20 right-[-10%] w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full" />

      {/* Header */}
      <div className="z-10 p-6 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight text-white">SUMTING</h1>
        <div className="flex gap-4">
          <button onClick={() => navigate('/heartpings')} className="relative p-2 text-white/80 hover:text-white">
            <Bell size={24} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto z-10 px-6 pb-24">
        {/* Timer Section */}
        <div className="my-8 flex flex-col items-center">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 px-6 py-4 rounded-[32px] text-center">
            <p className="text-xs text-purple-300 font-medium tracking-widest uppercase mb-1">숨팅 종료까지</p>
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-pink-400" />
              <span className="text-4xl font-mono font-bold text-white tracking-tighter">
                {timeLeft}
              </span>
            </div>
          </div>
        </div>

        {/* User Recommendation */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">오늘의 인연</h3>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {MOCK_RECOMMENDATIONS.map((u, idx) => (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => handleSelectUser(u)}
                className="group relative bg-[#1a1a1a] rounded-[32px] p-6 border border-gray-800 hover:border-purple-500/50 transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center">
                    <MascotImage type={u.mascotType} className="w-16 h-16" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-lg text-white">{u.nickname}</h4>
                      <span className="text-xs font-bold text-pink-400 bg-pink-400/10 px-2 py-1 rounded-full">
                        {u.matchScore}% Match
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{u.department}</p>
                    <div className="flex flex-wrap gap-2">
                      {u.keywords.map(k => (
                        <span key={k} className="text-[10px] bg-white/5 px-2 py-1 rounded-lg text-gray-400">
                          #{k}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="absolute bottom-0 left-0 w-full p-4 z-20">
        <div className="bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 rounded-[24px] p-2 flex justify-around items-center">
          <button className="flex flex-col items-center p-2 text-white">
            <Heart size={24} className="fill-white" />
            <span className="text-[10px] mt-1 font-medium">홈</span>
          </button>
          <button onClick={() => navigate('/heartpings')} className="flex flex-col items-center p-2 text-gray-500 hover:text-white transition-colors">
            <MessageCircle size={24} />
            <span className="text-[10px] mt-1 font-medium">채팅</span>
          </button>
          <button onClick={() => navigate('/profile')} className="flex flex-col items-center p-2 text-gray-500 hover:text-white transition-colors">
            <User size={24} />
            <span className="text-[10px] mt-1 font-medium">마이</span>
          </button>
        </div>
      </div>
    </div>
  );
}
