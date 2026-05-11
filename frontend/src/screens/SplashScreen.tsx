import { motion } from 'motion/react';
import MascotImage from '../components/MascotImage';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  return (
    <div 
      className="h-full w-full bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex flex-col items-center justify-center p-8 text-center cursor-pointer"
      onClick={onComplete}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <MascotImage type="basic" className="w-48 h-48 mb-8" />
        <h1 className="text-4xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 mb-2">
          SUMTING
        </h1>
        <p className="text-lg text-purple-200 opacity-80">숨 가쁜 축제 속의 특별한 만남</p>
      </motion.div>

      <motion.div 
        className="absolute bottom-20 text-sm text-purple-300/50"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        화면을 터치해서 시작하세요
      </motion.div>
    </div>
  );
}
