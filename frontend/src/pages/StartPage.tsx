import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const decorations = [
  { type: 'star', top: '8%', left: '10%', size: 14, rotate: 0, opacity: 0.7 },
  { type: 'star', top: '14%', right: '12%', size: 10, rotate: 20, opacity: 0.5 },
  { type: 'star', top: '30%', left: '6%', size: 8, rotate: 45, opacity: 0.4 },
  { type: 'star', top: '22%', right: '8%', size: 16, rotate: 0, opacity: 0.6 },
  { type: 'star', top: '50%', left: '4%', size: 10, rotate: 0, opacity: 0.45 },
  { type: 'star', top: '55%', right: '6%', size: 12, rotate: 30, opacity: 0.5 },
  { type: 'star', top: '72%', left: '12%', size: 8, rotate: 15, opacity: 0.4 },
  { type: 'star', top: '68%', right: '14%', size: 10, rotate: 0, opacity: 0.35 },
  { type: 'heart', top: '18%', left: '20%', size: 10, opacity: 0.5 },
  { type: 'heart', top: '38%', right: '18%', size: 8, opacity: 0.4 },
  { type: 'heart', top: '60%', left: '18%', size: 12, opacity: 0.45 },
  { type: 'heart', top: '75%', right: '20%', size: 9, opacity: 0.4 },
  { type: 'cross', top: '42%', left: '8%', size: 12, opacity: 0.35 },
  { type: 'cross', top: '35%', right: '10%', size: 10, opacity: 0.3 },
];

function StarSVG({ size, rotate, opacity }: { size: number; rotate: number; opacity: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ opacity, transform: `rotate(${rotate}deg)` }}>
      <path d="M8 0 L9 7 L16 8 L9 9 L8 16 L7 9 L0 8 L7 7 Z" fill="#F5C842" />
    </svg>
  );
}

function HeartSVG({ size, opacity }: { size: number; opacity: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ opacity }}>
      <path d="M8 14 C8 14 1 9 1 5 C1 3 3 1 5.5 1 C6.8 1 7.8 1.8 8 2.5 C8.2 1.8 9.2 1 10.5 1 C13 1 15 3 15 5 C15 9 8 14 8 14Z" fill="#FF8FAB" />
    </svg>
  );
}

function CrossSVG({ size, opacity }: { size: number; opacity: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ opacity }}>
      <rect x="7" y="2" width="2" height="12" rx="1" fill="#B388FF" />
      <rect x="2" y="7" width="12" height="2" rx="1" fill="#B388FF" />
    </svg>
  );
}

function PigMascot() {
  return (
    <div className="relative">
      <div className="absolute -top-3 -right-1 z-10">
        <StarSVG size={18} rotate={15} opacity={1} />
      </div>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #F9A8C0 0%, #F07AAA 100%)' }}
      >
        <svg viewBox="0 0 100 100" className="w-20 h-20">
          {/* Head */}
          <circle cx="50" cy="50" r="38" fill="#F4A0B5" />
          {/* Snout */}
          <ellipse cx="50" cy="63" rx="14" ry="10" fill="#E8788A" />
          {/* Nostrils */}
          <ellipse cx="44" cy="64" rx="3.5" ry="3" fill="#C55070" />
          <ellipse cx="56" cy="64" rx="3.5" ry="3" fill="#C55070" />
          {/* Eyes */}
          <path d="M35 42 Q39 38 43 42" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M57 42 Q61 38 65 42" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
          {/* Blush */}
          <circle cx="31" cy="54" r="6" fill="#F07AAA" opacity="0.55" />
          <circle cx="69" cy="54" r="6" fill="#F07AAA" opacity="0.55" />
          {/* Ears */}
          <ellipse cx="22" cy="26" rx="10" ry="12" fill="#F4A0B5" />
          <ellipse cx="78" cy="26" rx="10" ry="12" fill="#F4A0B5" />
          <ellipse cx="22" cy="27" rx="6" ry="7" fill="#E8788A" />
          <ellipse cx="78" cy="27" rx="6" ry="7" fill="#E8788A" />
        </svg>
      </motion.div>
    </div>
  );
}

export default function StartPage() {
  const navigate = useNavigate();

  return (
    <div
      className="h-full w-full flex flex-col items-center relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #1A0A3C 0%, #2A1060 40%, #1E0D4E 100%)' }}
    >
      {/* Soft glow blobs */}
      <div className="absolute top-[-5%] left-[10%] w-52 h-52 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(160,80,220,0.18) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[15%] right-[-5%] w-56 h-56 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,100,160,0.12) 0%, transparent 70%)' }} />

      {/* Scattered decorations */}
      {decorations.map((d, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            top: d.top,
            left: 'left' in d ? (d as any).left : undefined,
            right: 'right' in d ? (d as any).right : undefined,
          }}
        >
          {d.type === 'star' && <StarSVG size={d.size} rotate={d.rotate ?? 0} opacity={d.opacity} />}
          {d.type === 'heart' && <HeartSVG size={d.size} opacity={d.opacity} />}
          {d.type === 'cross' && <CrossSVG size={d.size} opacity={d.opacity} />}
        </div>
      ))}

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-16">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <PigMascot />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex flex-col items-center"
        >
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-1">슘팅</h1>
          <p className="text-xs font-medium tracking-widest mb-6"
            style={{ color: 'rgba(200,180,255,0.75)' }}>
            SUMTING · 2025 대학 축제
          </p>
          <p className="text-sm text-center leading-relaxed"
            style={{ color: 'rgba(230,220,255,0.85)' }}>
            사진 없이, 감성으로 연결되는<br />
            48시간 한정 익명 매칭
          </p>
        </motion.div>
      </div>

      {/* Bottom area */}
      <div className="w-full px-6 pb-8 flex flex-col items-center gap-3">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/signup')}
          className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-lg"
          style={{ background: 'linear-gradient(90deg, #FF6FA8 0%, #FF3E8A 100%)' }}
        >
          🐽 슘팅 시작하기
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="text-xs"
          style={{ color: 'rgba(200,180,255,0.6)' }}
        >
          🌟 2025.05.21 00:00 ~ 05.22 23:59
        </motion.p>
      </div>
    </div>
  );
}
