import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { RecommendedUser } from '../../types';
import MascotImage from '../MascotImage';
import { GLASS } from '../../utils/background';

interface SuccessModalProps {
  user: RecommendedUser;
  onStartChat: () => void;
  onClose: () => void;
  visible: boolean;
}

export default function SuccessModal({ user, onStartChat, onClose, visible }: SuccessModalProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="success-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-6"
          style={{ background: 'rgba(80, 5, 20, 0.75)', backdropFilter: 'blur(16px)' }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 24 }}
            animate={{ scale: 1,    opacity: 1, y: 0  }}
            exit={{ scale: 0.85,    opacity: 0, y: 24 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="w-full max-w-sm rounded-[32px] overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.10) 100%)',
              border: '1px solid rgba(255,255,255,0.35)',
              boxShadow: '0 24px 60px rgba(100,0,30,0.5)',
            }}
          >
            {/* 상단 헤더 배너 */}
            <div
              className="px-6 pt-7 pb-5 flex flex-col items-center gap-1"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={16} className="text-yellow-300" />
                <span className="text-xs font-bold tracking-widest uppercase"
                  style={{ color: 'rgba(255,255,255,0.92)' }}>
                  매칭 성공
                </span>
                <Sparkles size={16} className="text-yellow-300" />
              </div>
              <h2 className="text-2xl font-extrabold text-white text-center leading-tight">
                새로운 인연을<br />만났어요! 🎉
              </h2>
            </div>

            {/* 유저 정보 */}
            <div className="px-6 py-6 flex flex-col items-center gap-4">

              {/* 마스코트 + 매칭 점수 */}
              <div className="relative">
                <div
                  className="w-24 h-24 rounded-[28px] flex items-center justify-center"
                  style={{
                    background: 'rgba(255,255,255,0.18)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    boxShadow: '0 8px 32px rgba(198,42,71,0.3)',
                  }}
                >
                  <MascotImage type={user.mascotType} className="w-18 h-18" />
                </div>
                {/* 매칭 점수 뱃지 */}
                <div
                  className="font-numeral absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full text-[11px] font-bold"
                  style={{
                    background: '#ffffff',
                    color: '#C62A47',
                    boxShadow: '0 4px 12px rgba(198,42,71,0.3)',
                  }}
                >
                  {user.matchScore}% ♥
                </div>
              </div>

              {/* 닉네임 + 학과 */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-white">{user.nickname}</h3>
                <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.88)' }}>
                  {user.department}
                </p>
              </div>
            </div>

            {/* 버튼 영역 */}
            <div className="px-6 pb-7 flex flex-col gap-2">
              <button
                onClick={onStartChat}
                className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.97]"
                style={{
                  background: '#ffffff',
                  color: '#C62A47',
                  boxShadow: '0 8px 24px rgba(198,42,71,0.35)',
                }}
              >
                <MessageCircle size={18} />
                1:1 채팅 시작하기
              </button>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl text-sm font-medium transition-all active:scale-[0.97]"
                style={{ color: 'rgba(255,255,255,0.80)' }}
              >
                나중에 하기
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
