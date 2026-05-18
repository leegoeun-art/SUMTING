import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { GLASS, GRADIENT } from '../../utils/background';

interface PrivacyModalProps {
  visible: boolean;
  onClose: () => void;
}

const SECTIONS = [
  {
    title: '1. 수집하는 개인정보 항목',
    body: '카카오 고유 식별자(ID), 닉네임, 학과, 성별, 나이, 키, 키워드, FCM 기기 토큰',
  },
  {
    title: '2. 수집 및 이용 목적',
    body: '서비스 회원 식별, 매칭 및 채팅 서비스 제공, 푸시 알림 발송',
  },
  {
    title: '3. 보유 및 이용 기간',
    body: '축제 종료 후 모든 개인정보 및 채팅 내역을 즉시 파기합니다. 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.',
  },
  {
    title: '4. 개인정보의 파기',
    body: '서비스 종료 시 수집된 모든 개인정보는 복구 불가능한 방법으로 즉시 삭제됩니다.',
  },
  {
    title: '5. 이용자의 권리',
    body: '이용자는 언제든지 로그아웃(탈퇴)을 통해 자신의 개인정보 삭제를 요청할 수 있습니다. 탈퇴 즉시 모든 데이터가 삭제됩니다.',
  },
  {
    title: '6. 개인정보 보호책임자',
    body: '개인정보 처리에 관한 문의는 서비스 내 문의 채널을 이용해 주세요.',
  },
];

export default function PrivacyModal({ visible, onClose }: PrivacyModalProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="privacy-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] flex items-center justify-center px-4"
          style={{ background: 'rgba(60,5,15,0.55)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            key="privacy-card"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="w-full max-w-sm flex flex-col rounded-[28px] overflow-hidden"
            style={{ background: GRADIENT, maxHeight: '80dvh' }}
            onClick={e => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div
              className="flex items-center justify-between px-5 pt-5 pb-4 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}
            >
              <h2 className="text-lg font-bold text-white">개인정보처리방침</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full transition-all active:scale-90"
                style={{ background: 'rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.8)' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* 본문 */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 pb-6">
              <p className="text-xs leading-relaxed mb-2" style={{ color: 'rgba(255,255,255,0.70)' }}>
                숨팅(이하 "서비스")은 이용자의 개인정보를 소중히 여기며 아래와 같이 처리합니다.
              </p>
              {SECTIONS.map((s) => (
                <div key={s.title} className="rounded-2xl px-4 py-4" style={GLASS.card}>
                  <p className="text-xs font-bold text-white mb-1.5">{s.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
