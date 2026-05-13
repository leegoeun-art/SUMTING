import { motion } from 'motion/react';
import SumungMascot from '../SumungMascot';

interface Props {
  nickname: string;
  department: string;
  keywords: string[];
  onEnter: () => void;
}

export default function SignUpResult({ nickname, department, keywords, onEnter }: Props) {
  return (
    <div
      className="h-full w-full flex flex-col items-center relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #C62A47 0%, #F07085 50%, #FFC4C4 100%)' }}
    >
      {/* 배경 글로우 */}
      <div className="absolute top-[-5%] left-[10%] w-52 h-52 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,200,200,0.25) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[15%] right-[-5%] w-56 h-56 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(198,42,71,0.2) 0%, transparent 70%)' }} />

      <div className="flex-1 flex flex-col items-center justify-center px-8 w-full z-10">
        {/* 완료 텍스트 */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-sm font-medium mb-5"
          style={{ color: 'rgba(255,255,255,0.8)' }}
        >
          캐릭터 생성 완료
        </motion.p>

        {/* 마스코트 원형 */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-32 h-32 rounded-full flex items-center justify-center mb-5"
          style={{ background: 'rgba(255,255,255,0.25)', border: '2px solid rgba(255,255,255,0.4)' }}
        >
          <SumungMascot className="w-24 h-24" />
        </motion.div>

        {/* 닉네임 */}
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-2xl font-extrabold text-white mb-1"
        >
          {nickname}
        </motion.h1>

        {/* 학과 · 수뭉 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-sm mb-4"
          style={{ color: 'rgba(255,255,255,0.75)' }}
        >
          {department} · 수뭉
        </motion.p>

        {/* 키워드 뱃지 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="flex gap-2 flex-wrap justify-center mb-6"
        >
          {keywords.map((k) => (
            <span
              key={k}
              className="px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: 'rgba(255,255,255,0.25)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.4)' }}
            >
              #{k}
            </span>
          ))}
        </motion.div>

        {/* 메시지 박스 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="w-full rounded-2xl px-5 py-4 text-center"
          style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}
        >
          <p className="text-sm leading-relaxed text-white">
            🎉 당신의 수뭉이가 완성됐어요!<br />
            이제 축제에서 숨팅을 시작해보세요
          </p>
        </motion.div>
      </div>

      {/* 입장 버튼 */}
      <div className="w-full px-8 pb-8 flex-shrink-0 z-10">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          onClick={onEnter}
          className="w-full py-4 rounded-2xl font-bold text-base active:scale-95 transition-transform"
          style={{
            background: '#ffffff',
            color: '#C62A47',
            boxShadow: '0 8px 24px rgba(198,42,71,0.30)',
          }}
        >
          축제 입장하기 🌙
        </motion.button>
      </div>
    </div>
  );
}
