import { motion, AnimatePresence } from 'motion/react';
import { Heart } from 'lucide-react';
import { RecommendedUser } from '../../types';
import MascotImage from '../MascotImage';
import { GLASS } from '../../utils/background';

interface ProfileModalProps {
  user: RecommendedUser | null;
  /** 하트핑 보내기 버튼 클릭 */
  onSendHeartPing: (user: RecommendedUser) => void;
  /** 닫기 버튼 클릭 */
  onClose: () => void;
}

export default function ProfileModal({ user, onSendHeartPing, onClose }: ProfileModalProps) {
  return (
    <AnimatePresence>
      {user && (
        /* 딤드 오버레이 */
        <motion.div
          key="profile-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[80] flex items-center justify-center px-5"
          style={{ background: 'rgba(60,5,15,0.6)', backdropFilter: 'blur(10px)' }}
          onClick={onClose}
        >
          {/* 바텀 시트 카드 */}
          <motion.div
            key="profile-modal-card"
            initial={{ scale: 0.88, opacity: 0, y: 16 }}
            animate={{ scale: 1,    opacity: 1, y: 0  }}
            exit={{ scale: 0.88,    opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="w-full max-w-sm rounded-[36px] pb-7 overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.10) 100%)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 24px 60px rgba(100,0,30,0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 마스코트 + 매치 점수 */}
            <div className="flex flex-col items-center px-6 pt-7 pb-5">
              <div className="relative mb-4">
                <div
                  className="w-28 h-28 rounded-[32px] flex items-center justify-center"
                  style={{
                    background: 'rgba(255,255,255,0.18)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    boxShadow: '0 8px 32px rgba(198,42,71,0.25)',
                  }}
                >
                  <MascotImage type={user.mascotType} className="w-20 h-20" />
                </div>
                {/* 매치 점수 뱃지 */}
                <div
                  className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full text-[11px] font-extrabold"
                  style={{
                    background: '#ffffff',
                    color: '#C62A47',
                    boxShadow: '0 4px 12px rgba(198,42,71,0.3)',
                  }}
                >
                  {user.matchScore}% ♥
                </div>
              </div>

              {/* 이름 + 학과 */}
              <h2 className="text-xl font-extrabold text-white mb-1">{user.nickname}</h2>
              <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.65)' }}>
                {user.department}
              </p>

              {/* 매칭률 바 */}
              <div className="w-full mb-5">
                <div className="flex justify-between text-[10px] mb-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  <span>키워드 매칭률</span>
                  <span className="font-bold text-white">{user.matchScore}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${user.matchScore}%` }}
                    transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #FF6FA8, #ffffff)' }}
                  />
                </div>
              </div>

              {/* 키워드 칩 */}
              {user.keywords.length > 0 && (
                <div className="w-full">
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2 ml-1"
                    style={{ color: 'rgba(255,255,255,0.5)' }}>
                    키워드
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {user.keywords.map((k) => (
                      <span
                        key={k}
                        className="text-xs px-3 py-1.5 rounded-full font-medium"
                        style={{
                          background: 'rgba(255,255,255,0.18)',
                          border: '1px solid rgba(255,255,255,0.3)',
                          color: 'rgba(255,255,255,0.9)',
                        }}
                      >
                        #{k}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 하단 버튼 영역 */}
            <div className="px-6 pt-2 flex gap-3"
              style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
              <button
                onClick={onClose}
                className="flex-1 py-3.5 rounded-2xl text-sm font-bold transition-all active:scale-95"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: 'rgba(255,255,255,0.8)',
                }}
              >
                닫기
              </button>
              <button
                onClick={() => onSendHeartPing(user)}
                className="flex-[2] py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                style={{
                  background: '#ffffff',
                  color: '#C62A47',
                  boxShadow: '0 8px 24px rgba(198,42,71,0.35)',
                }}
              >
                <Heart size={16} fill="#C62A47" />
                하트핑 보내기
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
