import { Check, Clock, X } from 'lucide-react';
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
}

export default function Send({ item, onOpenChat }: SendProps) {
  return (
    <div
      className="flex items-center gap-4 p-4 rounded-2xl"
      style={GLASS.card}
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

      <div className="flex-shrink-0">
        {item.status === 'accepted' ? (
          <button
            onClick={() => onOpenChat?.(item.user)}
            className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full transition-all active:scale-95"
            style={{ background: 'rgba(255,255,255,0.25)', color: '#ffffff' }}
          >
            <Check size={12} strokeWidth={3} /> 수락됨
          </button>
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
  );
}
