import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { GLASS, GRADIENT } from '../../utils/background';

interface FaqItem {
  q: string;
  a: string;
}

const FAQ_SECTIONS: { category: string; items: FaqItem[] }[] = [
  {
    category: '🎪 서비스 기본',
    items: [
      {
        q: '숨팅은 언제까지 이용할 수 있나요?',
        a: '숨팅은 축제 기간 3일 동안만 운영돼요. 축제가 끝나면 서비스가 종료되고, 모든 매칭 및 채팅 내역은 삭제돼요.',
      },
      {
        q: '숨팅은 무료인가요?',
        a: '네, 축제 기간 동안 완전 무료로 이용할 수 있어요.',
      },
      {
        q: '같은 학교 학생만 이용할 수 있나요?',
        a: '네, 숨팅은 우리 학교 재학생만 이용 가능한 캠퍼스 전용 서비스예요.',
      },
    ],
  },
  {
    category: '💘 하트핑',
    items: [
      {
        q: '하트핑이 뭔가요?',
        a: '마음에 드는 상대에게 관심을 표현하는 기능이에요. 상대방도 수락하면 1:1 익명 채팅이 열려요.',
      },
      {
        q: '하루에 하트핑을 몇 개까지 보낼 수 있나요?',
        a: '하루 최대 5개까지 보낼 수 있어요. 축제 3일 동안 총 최대 15개예요. 자정이 지나면 매일 초기화돼요.',
      },
      {
        q: '보낸 하트핑을 취소할 수 있나요?',
        a: '한 번 보낸 하트핑은 취소할 수 없어요. 신중하게 보내주세요!',
      },
      {
        q: '상대방이 하트핑을 수락하면 어떻게 되나요?',
        a: '즉시 1:1 익명 채팅방이 열려요. 채팅 탭에서 대화를 시작할 수 있어요.',
      },
      {
        q: '하트핑을 받았는데 거절하면 상대방에게 알림이 가나요?',
        a: '별도의 거절 알림은 가지 않아요. 상대방에게는 조용히 처리돼요.',
      },
    ],
  },
  {
    category: '🔁 오늘의 인연',
    items: [
      {
        q: '오늘의 인연은 어떻게 추천되나요?',
        a: '내가 설정한 키워드와 상대방의 키워드 일치율을 기반으로 추천돼요. 매칭률이 높을수록 상단에 표시돼요.',
      },
      {
        q: '한 번 거절한 사람이 다시 뜰 수 있나요?',
        a: '거절 후 24시간 동안은 오늘의 인연에 나타나지 않아요. 24시간이 지나면 목록 맨 하단에 다시 표시될 수 있어요.',
      },
      {
        q: '하트핑을 보낸 상대는 오늘의 인연에서 사라지나요?',
        a: '네, 하트핑을 보낸 상대는 오늘의 인연 목록에서 자동으로 사라져요.',
      },
    ],
  },
  {
    category: '🔒 익명 & 개인정보',
    items: [
      {
        q: '상대방이 제 실제 이름이나 학번을 알 수 있나요?',
        a: '아니요. 숨팅에서는 닉네임과 학과만 공개돼요. 실명, 학번, 카카오 계정 정보는 절대 노출되지 않아요.',
      },
      {
        q: '채팅 내용이 외부에 유출될 수 있나요?',
        a: '1:1 채팅은 매칭된 두 사람만 볼 수 있고, 축제 종료 후 전체 삭제돼요.',
      },
    ],
  },
  {
    category: '👤 계정',
    items: [
      {
        q: '회원가입은 어떻게 하나요?',
        a: '카카오 로그인 후, 학과 · 성별 · 나이 · 키를 입력하면 가입 완료예요. 개인정보는 익명으로 보호돼요.',
      },
      {
        q: '프로필을 수정할 수 있나요?',
        a: '현재 버전에서는 가입 후 프로필 수정이 제한돼요. 신중하게 입력해주세요.',
      },
      {
        q: '탈퇴하면 어떻게 되나요?',
        a: '탈퇴 즉시 모든 데이터가 삭제되며, 진행 중인 채팅도 종료돼요.',
      },
    ],
  },
];

/* ── 아코디언 아이템 ── */
function FaqRow({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="overflow-hidden transition-all"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}
    >
      <button
        className="w-full flex items-center justify-between px-4 py-3.5 text-left transition-all active:bg-white/10"
        onClick={() => setOpen(o => !o)}
      >
        <span className="text-sm font-medium text-white pr-3 leading-snug">{item.q}</span>
        {open
          ? <ChevronUp  size={16} style={{ color: 'rgba(255,255,255,0.78)', flexShrink: 0 }} />
          : <ChevronDown size={16} style={{ color: 'rgba(255,255,255,0.78)', flexShrink: 0 }} />
        }
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
          >
            <p
              className="px-4 pb-4 text-xs leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.88)' }}
            >
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── 메인 모달 ── */
interface QuestionModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function QuestionModal({ visible, onClose }: QuestionModalProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="faq-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] flex flex-col"
          style={{ background: GRADIENT }}
        >
          {/* 헤더 */}
          <div
            className="flex items-center justify-between px-5 pt-6 pb-4 flex-shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}
          >
            <h2 className="text-lg font-bold text-white">자주 묻는 질문</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full transition-all active:scale-90"
              style={{ background: 'rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.8)' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* FAQ 목록 */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 pb-10">
            {FAQ_SECTIONS.map((section) => (
              <div key={section.category}>
                {/* 카테고리 레이블 */}
                <p
                  className="text-[11px] font-bold uppercase tracking-widest mb-2 ml-1"
                  style={{ color: 'rgba(255,255,255,0.82)' }}
                >
                  {section.category}
                </p>
                {/* 아코디언 카드 */}
                <div className="rounded-2xl overflow-hidden" style={GLASS.card}>
                  {section.items.map((item) => (
                    <FaqRow key={item.q} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
