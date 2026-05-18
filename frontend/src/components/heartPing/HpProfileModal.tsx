import { motion, AnimatePresence } from 'motion/react';
import { RecommendedUser } from '../../types';
import MascotImage from '../MascotImage';

interface HpProfileModalProps {
  user: RecommendedUser | null;
  onClose: () => void;
}

export default function HpProfileModal({ user, onClose }: HpProfileModalProps) {
  return (
    <AnimatePresence>
      {user && (
        <motion.div
          key="hp-profile-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[80] flex items-center justify-center px-5"
          style={{ background: 'rgba(60,5,15,0.6)', backdropFilter: 'blur(10px)' }}
          onClick={onClose}
        >
          <motion.div
            key="hp-profile-modal-card"
            initial={{ scale: 0.88, opacity: 0, y: 16 }}
            animate={{ scale: 1,    opacity: 1, y: 0  }}
            exit={{ scale: 0.88,    opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="w-full max-w-sm rounded-[36px] pb-7 overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.10) 100%)',
              border: user.matchScore === 100 ? '1.5px solid rgba(255,180,200,0.9)' : '1px solid rgba(255,255,255,0.3)',
              boxShadow: user.matchScore === 100
                ? '0 24px 60px rgba(100,0,30,0.5), 0 0 32px rgba(255,100,150,0.35)'
                : '0 24px 60px rgba(100,0,30,0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
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

              <h2 className="text-xl font-extrabold text-white mb-1">{user.nickname}</h2>
              <div className="flex flex-col items-center gap-0.5 mb-5">
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.88)' }}>{user.department}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {[user.age != null && `${user.age}세`, user.height != null && `${user.height}cm`]
                    .filter(Boolean).join(' · ') || '정보 없음'}
                </p>
              </div>

              <div className="w-full mb-5">
                <div className="flex justify-between text-[10px] mb-1.5" style={{ color: 'rgba(255,255,255,0.82)' }}>
                  <span>키워드 매칭률</span>
                  <span className="font-numeral font-bold text-white">{user.matchScore}%</span>
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
                {user.matchScore === 100 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.7 }}
                    className="mt-2.5 flex items-center justify-center gap-1.5 py-2 text-sm font-extrabold"
                    style={{
                      color: '#ffffff',
                      letterSpacing: '0.05em',
                    }}
                  >
                    ✨ 찰떡궁합 ✨
                  </motion.div>
                )}
              </div>

              <div className="w-full">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2 ml-1"
                   style={{ color: 'rgba(255,255,255,0.78)' }}>
                  자기소개 키워드
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.keywords.length > 0 ? user.keywords.map((k) => (
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
                  )) : (
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>없음</span>
                  )}
                </div>
              </div>

              <div className="w-full mt-3">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2 ml-1"
                   style={{ color: 'rgba(255,255,255,0.78)' }}>
                  이상형 키워드
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.yourKeywords && user.yourKeywords.length > 0 ? user.yourKeywords.map((k) => (
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
                  )) : (
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>없음</span>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl text-sm font-bold transition-all active:scale-95"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: 'rgba(255,255,255,0.8)',
                }}
              >
                닫기
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
