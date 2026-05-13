import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bell, Clock, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import MascotImage from '../components/MascotImage';
import SumungMascot from '../components/SumungMascot';
import NavBar from '../utils/NavBar';
import { GlowBackground, GLASS } from '../utils/background';
import { RecommendedUser } from '../types';
import { FESTIVAL_END_TIME } from '../constants';

const DAILY_LIMIT = 5;
const MOCK_USED_TODAY = 2; // 오늘 보낸 하트핑 수 (추후 API로 교체)

const MOCK_RECOMMENDATIONS: RecommendedUser[] = [
  { id: '1', nickname: '달콤한 바나나', department: '컴퓨터공학과', keywords: ['외향적인', '어른스러운', '열정적인'], mascotType: 'cool', matchScore: 92 },
  { id: '2', nickname: '새벽녘 산책자', department: '미술대학', keywords: ['내향적인', '차분한', '시크한'], mascotType: 'shy', matchScore: 88 },
  { id: '3', nickname: '여름밤의 꿈', department: '심리학과', keywords: ['다정한', '솔직한', '긍정적인'], mascotType: 'heart', matchScore: 85 },
  { id: '4', nickname: '구름 한 스푼', department: '경영학부', keywords: ['귀여운', '유머러스한', '엉뚱한'], mascotType: 'basic', matchScore: 79 },
];

export default function HomePage() {
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
    navigate('/heartpings');
  };

  return (
    <GlowBackground>

      {/* Header */}
      <div className="z-10 px-6 pt-5 pb-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <SumungMascot className="w-10 h-11" />
          <h1 className="text-xl font-bold tracking-tight text-white">SUMTING</h1>
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigate('/heartpings')} className="relative p-2 text-white/80 hover:text-white">
            <Bell size={24} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto z-10 px-6 pb-24">
        {/* Timer Section */}
        <div className="my-6 flex flex-col items-center">
          <div className="backdrop-blur-md px-6 py-4 rounded-[32px] w-full"
            style={GLASS.cardLight}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium tracking-widest uppercase mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>숨팅 종료까지</p>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-pink-400" />
                  <span className="text-3xl font-mono font-bold text-white tracking-tighter">
                    {timeLeft}
                  </span>
                </div>
              </div>
              <SumungMascot className="w-16 h-18 -mb-1" />
            </div>
          </div>
        </div>

        {/* Heartping Counter */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="mb-6 rounded-[24px] px-5 py-4"
          style={GLASS.card}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center"
                style={GLASS.icon}>
                <Heart size={14} className="text-white" fill="white" />
              </div>
              <span className="text-sm font-semibold text-white">오늘의 하트핑</span>
            </div>
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.25)', color: '#ffffff' }}
            >
              {DAILY_LIMIT - MOCK_USED_TODAY}개 남음
            </span>
          </div>

          {/* 도트 인디케이터 */}
          <div className="flex items-center gap-2">
            {Array.from({ length: DAILY_LIMIT }).map((_, i) => {
              const used = i < MOCK_USED_TODAY;
              return (
                <div
                  key={i}
                  className="flex-1 h-2 rounded-full transition-all"
                  style={{
                    background: used
                      ? 'rgba(255,255,255,0.25)'
                      : '#ffffff',
                    boxShadow: used ? 'none' : '0 0 6px rgba(255,255,255,0.6)',
                  }}
                />
              );
            })}
          </div>

          <p className="text-[10px] mt-2.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
            축제 3일간 최대 15개 · 하루 {DAILY_LIMIT}개 한도
          </p>
        </motion.div>

        {/* User Recommendation */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-white">오늘의 인연</h3>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {MOCK_RECOMMENDATIONS.map((u, idx) => (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => handleSelectUser(u)}
                className="group relative rounded-[32px] p-6 transition-all active:scale-[0.98]"
                style={GLASS.card}
              >
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                    style={GLASS.icon}>
                    <MascotImage type={u.mascotType} className="w-16 h-16" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-lg text-white">{u.nickname}</h4>
                      <span className="text-xs font-bold text-white bg-white/25 px-2 py-1 rounded-full">
                        {u.matchScore}% Match
                      </span>
                    </div>
                    <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.65)' }}>{u.department}</p>
                    <div className="flex flex-wrap gap-2">
                      {u.keywords.map(k => (
                        <span key={k} className="text-[10px] px-2 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.85)' }}>
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

      {/* 공통 하단 네비게이션 */}
      <NavBar />
    </GlowBackground>
  );
}
