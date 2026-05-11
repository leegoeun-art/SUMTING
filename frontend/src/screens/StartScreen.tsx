import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function StartScreen() {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full bg-[#0a0a0a] flex flex-col items-center p-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-pink-500/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full" />

      <div className="mt-32 flex-1 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-12 relative"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-pink-500/30">
            <Heart className="w-12 h-12 text-white fill-white" />
          </div>
        </motion.div>

        <h2 className="text-3xl font-bold text-center mb-4 text-white">
          설레는 축제의 시작,<br/>지금 바로 만나보세요
        </h2>
        <p className="text-gray-400 text-center text-sm leading-relaxed mb-12">
          대학교 페스티벌 기간 한정 48시간!<br/>
          아무도 모르게, 당신의 인연을 찾아보세요.
        </p>
      </div>

      <button
        onClick={() => navigate('/signup')}
        className="w-full py-4 bg-white text-black font-bold rounded-2xl mb-6 active:scale-95 transition-transform"
      >
        시작하기
      </button>

      <p className="text-xs text-gray-500 mb-8">
        로그인 시 서비스 <span className="underline">이용약관</span> 및 <span className="underline">개인정보처리방침</span>에 동의하게 됩니다.
      </p>
    </div>
  );
}
