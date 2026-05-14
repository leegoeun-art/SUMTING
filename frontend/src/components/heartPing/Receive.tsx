import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RecommendedUser } from '../../types';
import MascotImage from '../MascotImage';
import { GLASS } from '../../utils/background';
import SuccessModal from './SucessModal';

interface ReceiveProps {
  user: RecommendedUser;
  /** 1:1 채팅 시작하기 — 채팅 탭으로 이동 */
  onStartChat: (user: RecommendedUser) => void;
  /** 나중에 하기 — 받은 하트핑 탭 유지 */
  onLater: (user: RecommendedUser) => void;
  /** 거절 확정 후 호출 */
  onRejected: (id: string) => void;
}

export default function Receive({ user, onStartChat, onLater, onRejected }: ReceiveProps) {
  const [showSuccess,       setShowSuccess]       = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

  const handleAccept = () => setShowSuccess(true);
  const handleReject = () => setShowRejectConfirm(true);

  const confirmReject = () => {
    setShowRejectConfirm(false);
    onRejected(user.id);
  };

  const handleStartChat = () => {
    setShowSuccess(false);
    onStartChat(user); // 채팅 탭으로 이동
  };

  const handleLater = () => {
    setShowSuccess(false);
    onLater(user); // 받은 하트핑 탭 유지
  };

  return (
    <>
      {/* ── 카드 ── */}
      <div
        className="flex items-center gap-4 p-4 rounded-2xl"
        style={GLASS.card}
      >
        {/* 마스코트 */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0"
          style={GLASS.icon}
        >
          <MascotImage type={user.mascotType} className="w-11 h-11" />
        </div>

        {/* 정보 */}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-white text-sm">{user.nickname}</h4>
          <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {user.department}
          </p>
          <div className="flex flex-wrap gap-1">
            {user.keywords.map((k) => (
              <span
                key={k}
                className="text-[9px] px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.85)' }}
              >
                #{k}
              </span>
            ))}
          </div>
        </div>

        {/* 수락 / 거절 버튼 */}
        <div className="flex flex-col gap-2 flex-shrink-0">
          <button
            onClick={handleAccept}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{ background: '#ffffff', boxShadow: '0 4px 10px rgba(198,42,71,0.3)' }}
          >
            <Check size={16} strokeWidth={3} style={{ color: '#C62A47' }} />
          </button>
          <button
            onClick={handleReject}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}
          >
            <X size={16} className="text-white" />
          </button>
        </div>
      </div>

      {/* ── 거절 확인 미니 모달 ── */}
      <AnimatePresence>
        {showRejectConfirm && (
          <motion.div
            key="reject-confirm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-8"
            style={{ background: 'rgba(60,5,15,0.65)', backdropFilter: 'blur(12px)' }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1,   opacity: 1 }}
              exit={{ scale: 0.9,    opacity: 0 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              className="w-full max-w-xs rounded-[24px] p-6 flex flex-col items-center gap-4"
              style={{
                background: 'linear-gradient(160deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.08) 100%)',
                border: '1px solid rgba(255,255,255,0.3)',
                boxShadow: '0 20px 50px rgba(80,0,20,0.5)',
              }}
            >
              {/* 아이콘 */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}
              >
                <X size={20} className="text-white" />
              </div>

              {/* 텍스트 */}
              <div className="text-center">
                <p className="font-bold text-white text-base mb-1">하트핑을 거절할까요?</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  거절하면 되돌릴 수 없어요
                </p>
              </div>

              {/* 버튼 */}
              <div className="flex gap-2 w-full">
                <button
                  onClick={() => setShowRejectConfirm(false)}
                  className="flex-1 py-3 rounded-2xl text-sm font-bold transition-all active:scale-95"
                  style={{
                    background: 'rgba(255,255,255,0.18)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: '#ffffff',
                  }}
                >
                  아니오
                </button>
                <button
                  onClick={confirmReject}
                  className="flex-1 py-3 rounded-2xl text-sm font-bold transition-all active:scale-95"
                  style={{
                    background: '#ffffff',
                    color: '#C62A47',
                    boxShadow: '0 4px 12px rgba(198,42,71,0.3)',
                  }}
                >
                  예, 거절할게요
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 매칭 성공 모달 ── */}
      <SuccessModal
        user={user}
        visible={showSuccess}
        onStartChat={handleStartChat}
        onClose={handleLater}
      />
    </>
  );
}
