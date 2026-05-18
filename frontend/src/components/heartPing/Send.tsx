import { Check, Clock, MessageCircle, X } from 'lucide-react';
import { RecommendedUser } from '../../types';
import MascotImage from '../MascotImage';
import { GLASS } from '../../utils/background';

interface SendItem {
  id: string;
  user: RecommendedUser;
  status: 'accepted' | 'pending' | 'rejected';
}

interface SendProps {
  item: SendItem;
  /** 수락됨 상태인 경우 채팅으로 이동 */
  onOpenChat?: (user: RecommendedUser) => void;
  /** 프로필 클릭 시 모달 열기 */
  onProfileClick?: (user: RecommendedUser) => void;
}

export default function Send({ item, onOpenChat, onProfileClick }: SendProps) {
  const accepted = item.status === 'accepted';

  return (
      <div
          className="rounded-2xl overflow-hidden"
          style={accepted
            ? { ...GLASS.card, border: '1px solid rgba(255,180,160,0.7)' }
            : GLASS.card}
      >
        <div className="flex items-center gap-4 p-4">
          {/* 마스코트 + 정보 (클릭 시 프로필 모달) */}
          <button
              className="flex items-center gap-4 flex-1 min-w-0 text-left active:opacity-75"
              onClick={() => onProfileClick?.(item.user)}
          >
            <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0"
                style={GLASS.icon}
            >
              <MascotImage type={item.user.mascotType} className="w-11 h-11" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-white text-sm">{item.user.nickname}</h4>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.85)' }}>
                {item.user.department}
              </p>
            </div>
          </button>

          <div className="flex-shrink-0">
            {accepted ? (
                <span
                    className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.92)', color: '#C62A47', boxShadow: '0 2px 8px rgba(198,42,71,0.25)' }}
                >
                  <Check size={12} strokeWidth={3} /> 수락됨
                </span>
            ) : item.status === 'rejected' ? (
                <span
                    className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(255,100,100,0.2)', color: 'rgba(255,150,150,0.9)' }}
                >
                  <X size={12} strokeWidth={3} /> 거절됨
                </span>
            ) : (
                <span
                    className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}
                >
                  <Clock size={12} /> 대기중
                </span>
            )}
          </div>
        </div>

        {accepted && (
            <div className="px-4 pb-4">
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', marginBottom: '12px' }} />
              <button
                  onClick={() => onOpenChat?.(item.user)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
                  style={{ background: 'rgba(255,255,255,0.22)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
              >
                <MessageCircle size={15} /> 채팅 시작하기
              </button>
            </div>
        )}
      </div>
  );
}
