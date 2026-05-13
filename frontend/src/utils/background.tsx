import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import heartLottieUrl from '../assets/heart.lottie?url';

export const COLORS = {
  primary:     '#C62A47',
  primaryMid:  '#F07085',
  primaryPale: '#FFC4C4',
  kakao:       '#FEE500',
} as const;

export const GRADIENT = 'linear-gradient(160deg, #C62A47 0%, #F07085 50%, #FFC4C4 100%)';

// 자주 쓰이는 glass-morphism 스타일
export const GLASS = {
  card:      { background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.28)' },
  cardLight: { background: 'rgba(255,255,255,0.2)',  border: '1px solid rgba(255,255,255,0.35)' },
  icon:      { background: 'rgba(255,255,255,0.25)' },
} as const;

// ── 하트 Lottie 배경 (StartPage 전용) ──────────────────────────
type HeartDot = {
  id: number; top: string; left?: string; right?: string;
  size: number; opacity: number; delay: number; duration: number;
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

export function LottieHeartBackground() {
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
            src={heartLottieUrl}
            loop
            autoplay
            style={{ width: h.size, height: h.size }}
          />
        </div>
      ))}
    </div>
  );
}

// ── 공용 페이지 배경 (그라디언트 + 글로우 블롭) ──────────────────
interface GlowBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function GlowBackground({ children, className = '' }: GlowBackgroundProps) {
  return (
    <div
      className={`h-full w-full flex flex-col relative overflow-hidden ${className}`}
      style={{ background: GRADIENT }}
    >
      <div
        className="absolute top-[-5%] left-[10%] w-52 h-52 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,200,200,0.25) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-[15%] right-[-5%] w-56 h-56 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(198,42,71,0.2) 0%, transparent 70%)' }}
      />
      {children}
    </div>
  );
}
