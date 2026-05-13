import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import SumungMascot from '../components/SumungMascot';
import heartLottieUrl from '../assets/heart.lottie?url';

// ─────────────────────────────────────────
// Lottie 하트 위치 정의
// ─────────────────────────────────────────
const LOTTIE_SRC = heartLottieUrl;

type HeartDot = {
  id:       number;
  top:      string;
  left?:    string;
  right?:   string;
  size:     number;
  opacity:  number;
  delay:    number; // 깜빡임 시작 딜레이 (초)
  duration: number; // 깜빡임 한 사이클 시간 (초)
};

const HEARTS: HeartDot[] = [
  { id:  0, top:  '4%', left:  '6%',  size: 48, opacity: 0.70, delay: 0.0, duration: 3.2 },
  { id:  1, top:  '8%', right:'10%',  size: 34, opacity: 0.55, delay: 1.5, duration: 4.1 },
  { id:  2, top: '16%', left:  '2%',  size: 36, opacity: 0.50, delay: 0.7, duration: 2.8 },
  { id:  3, top: '13%', right:  '4%', size: 52, opacity: 0.65, delay: 2.3, duration: 3.7 },
  { id:  4, top: '24%', left: '16%',  size: 26, opacity: 0.45, delay: 0.4, duration: 4.5 },
  { id:  5, top: '28%', right:'16%',  size: 30, opacity: 0.45, delay: 3.1, duration: 2.6 },
  { id:  6, top: '32%', left:  '4%',  size: 40, opacity: 0.55, delay: 1.8, duration: 3.9 },
  { id:  7, top: '36%', right:  '5%', size: 44, opacity: 0.50, delay: 0.2, duration: 4.2 },
  { id:  8, top: '44%', left:  '2%',  size: 30, opacity: 0.45, delay: 2.9, duration: 3.1 },
  { id:  9, top: '48%', right:  '3%', size: 36, opacity: 0.50, delay: 1.1, duration: 2.9 },
  { id: 10, top: '55%', left: '12%',  size: 28, opacity: 0.40, delay: 3.6, duration: 4.3 },
  { id: 11, top: '58%', right:'12%',  size: 32, opacity: 0.45, delay: 0.8, duration: 3.6 },
  { id: 12, top: '64%', left:  '4%',  size: 44, opacity: 0.55, delay: 2.1, duration: 2.7 },
  { id: 13, top: '62%', right:  '4%', size: 38, opacity: 0.50, delay: 3.8, duration: 4.0 },
  { id: 14, top: '74%', left:  '8%',  size: 32, opacity: 0.45, delay: 1.3, duration: 3.4 },
  { id: 15, top: '72%', right:  '8%', size: 42, opacity: 0.50, delay: 0.5, duration: 4.8 },
  { id: 16, top: '83%', left:  '3%',  size: 36, opacity: 0.40, delay: 2.6, duration: 2.5 },
  { id: 17, top: '80%', right:  '5%', size: 28, opacity: 0.40, delay: 1.9, duration: 3.3 },
];

// ─────────────────────────────────────────
// 하트 배경 컴포넌트
// ─────────────────────────────────────────
function LottieHeartBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {HEARTS.map((h) => (
        <div
          key={h.id}
          className="absolute"
          style={{
            top:       h.top,
            left:      h.left,
            right:     h.right,
            width:     h.size,
            height:    h.size,
            animation: `heartBlink ${h.duration}s ease-in-out ${h.delay}s infinite`,
            opacity:   h.opacity,
          }}
        >
          <DotLottieReact
            src={LOTTIE_SRC}
            loop
            autoplay
            style={{ width: h.size, height: h.size }}
          />
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────
// 메인 페이지
// ─────────────────────────────────────────
export default function StartPage() {
  const navigate = useNavigate();

  return (
    <div
      className="h-full w-full flex flex-col items-center relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #1A0A3C 0%, #2D1268 45%, #1E0D4E 100%)' }}
    >
      {/* 글로우 블롭 */}
      <div className="absolute top-[-8%] left-[-15%] w-72 h-72 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(140,60,220,0.35) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[15%] right-[-15%] w-72 h-72 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(220,60,120,0.25) 0%, transparent 70%)' }} />

      {/* Lottie 하트 배경 */}
      <LottieHeartBackground />

      {/* 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 w-full relative z-10">
        {/* 마스코트 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: -10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-5"
        >
          <SumungMascot className="w-56 h-60" />
        </motion.div>

        {/* 타이틀 */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-4xl font-extrabold text-white tracking-tight mb-1"
        >
          SUMTING
        </motion.h1>

        {/* 서브타이틀 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-col items-center gap-0.5 mb-7"
        >
          <p className="text-sm font-semibold tracking-wide" style={{ color: '#E8C8FF' }}>
            숨팅 : 수뭉팅
          </p>
          <p className="text-xs font-medium tracking-widest" style={{ color: '#B89FE0' }}>
            상명대학교 2026 축제
          </p>
        </motion.div>

        {/* 설명 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-sm text-center leading-relaxed"
          style={{ color: '#D4C0F0' }}
        >
          사진 없이, 감성으로 연결되는<br />
          48시간 한정 익명 매칭
        </motion.p>
      </div>

      {/* 하단 영역 */}
      <div className="w-full px-8 pb-8 flex flex-col items-center gap-4 relative z-10">
        {/* 시작 버튼 */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          onClick={() => navigate('/signup')}
          className="w-full py-4 rounded-2xl font-bold text-white text-base active:scale-95 transition-transform shadow-lg"
          style={{
            background: 'linear-gradient(90deg, #FF6FA8 0%, #FF3E8A 100%)',
            boxShadow:  '0 8px 24px rgba(255, 80, 140, 0.40)',
          }}
        >
          숨팅 시작하기
        </motion.button>

        {/* 날짜 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="text-[11px]"
          style={{ color: '#8B7AAE' }}
        >
          🌟 2026.5.20 00:00 ~ 05.22 23:59
        </motion.p>
      </div>
    </div>
  );
}
