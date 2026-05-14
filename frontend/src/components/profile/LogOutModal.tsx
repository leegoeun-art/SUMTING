import { motion, AnimatePresence } from 'motion/react';
import { LogOut } from 'lucide-react';
import { GLASS } from '../../utils/background';

interface LogOutModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogOutModal({ visible, onClose, onConfirm }: LogOutModalProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="logout-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] flex items-center justify-center px-6"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(12px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-sm rounded-3xl p-6"
            style={GLASS.card}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center gap-3 mb-6">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(255,100,100,0.2)' }}
              >
                <LogOut size={22} style={{ color: '#ffb3b3' }} />
              </div>
              <h2 className="text-lg font-bold text-white">로그아웃</h2>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                로그아웃하면 카카오 로그인이 필요해요.<br />정말 로그아웃할까요?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl text-sm font-semibold transition-all active:scale-95"
                style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.85)' }}
              >
                취소
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-3 rounded-2xl text-sm font-semibold transition-all active:scale-95"
                style={{ background: 'rgba(255,80,80,0.4)', color: '#ffb3b3' }}
              >
                로그아웃
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
