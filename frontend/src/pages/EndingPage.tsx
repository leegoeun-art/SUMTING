import { motion } from 'motion/react';
import MascotImage from '../components/MascotImage';

export default function EndingPage() {
  return (
    <div className="h-full w-full bg-gradient-to-b from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a] flex flex-col items-center justify-center p-8 text-center overscroll-none">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
      >
        <div className="relative mb-12 flex justify-center">
          <div className="absolute inset-0 bg-purple-500/20 blur-[80px] rounded-full" />
          <MascotImage type="shy" className="w-48 h-48 relative grayscale opacity-60" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-6 leading-tight">
          48시간의 숨팅이<br/>종료되었어요.
        </h1>
        
        <p className="text-gray-400 text-sm leading-relaxed mb-12 max-w-[260px] mx-auto">
          올해 축제에서의 설레는 만남들이<br/>
          당신의 마음속에 따뜻한 추억으로<br/>
          남았기를 바랍니다.
        </p>

        <div className="space-y-4">
          <button className="w-64 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-2xl border border-white/5 active:scale-95 transition-transform">
            매칭 결과 저장하기
          </button>
          <div className="py-4 text-xs text-gray-600">
            당신의 인연은 계속될 거예요.
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-10 left-0 w-full flex flex-col items-center gap-2 opacity-30">
        <div className="w-1 h-1 bg-white rounded-full" />
        <div className="w-1 h-1 bg-white rounded-full" />
        <div className="w-1 h-1 bg-white rounded-full" />
      </div>
    </div>
  );
}
