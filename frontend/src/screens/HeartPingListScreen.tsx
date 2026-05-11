import { useState } from 'react';
import { ChevronLeft, Heart, MessageCircle } from 'lucide-react';
import MascotImage from '../components/MascotImage';
import { RecommendedUser } from '../types';

const MOCK_PINGS = [
  { id: 'p1', user: { id: 'r1', nickname: '달빛 아래 춤', department: '영어영문학과', mascotType: 'heart' }, type: 'received' },
  { id: 'p2', user: { id: 'r2', nickname: '커피 한 잔', department: '경제학과', mascotType: 'basic' }, type: 'sent' },
];

export default function HeartPingListScreen({ onBack, onMatch }: { onBack: () => void, onMatch: (u: RecommendedUser) => void }) {
  const [tab, setTab] = useState<'received' | 'sent'>('received');

  return (
    <div className="h-full w-full bg-[#0a0a0a] flex flex-col p-6">
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-400 font-bold"><ChevronLeft /></button>
        <h2 className="text-lg font-medium ml-2">하트핑 목록</h2>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#1a1a1a] p-1 rounded-2xl mb-8">
        <button
          onClick={() => setTab('received')}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
            tab === 'received' ? 'bg-[#2a2a2a] text-white shadow-sm' : 'text-gray-500'
          }`}
        >
          받은 하트핑
        </button>
        <button
          onClick={() => setTab('sent')}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
            tab === 'sent' ? 'bg-[#2a2a2a] text-white shadow-sm' : 'text-gray-500'
          }`}
        >
          보낸 하트핑
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto">
        {MOCK_PINGS.filter(p => p.type === tab).map((p) => (
          <div key={p.id} className="bg-[#1a1a1a] p-4 rounded-3xl border border-gray-800 flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center overflow-hidden">
              <MascotImage type={p.user.mascotType} className="w-12 h-12" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-white">{p.user.nickname}</h4>
              <p className="text-xs text-gray-500">{p.user.department}</p>
            </div>
            {tab === 'received' ? (
              <div className="flex gap-2">
                <button 
                  onClick={() => onMatch(p.user as any)}
                  className="w-10 h-10 bg-pink-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-pink-500/20"
                >
                  <Heart size={18} fill="white" />
                </button>
                <button className="w-10 h-10 bg-gray-800 text-gray-400 rounded-full flex items-center justify-center">
                  <span className="text-lg">×</span>
                </button>
              </div>
            ) : (
              <div className="text-xs text-gray-600 font-medium">대기 중</div>
            )}
          </div>
        ))}

        {MOCK_PINGS.filter(p => p.type === tab).length === 0 && (
          <div className="h-64 flex flex-col items-center justify-center text-gray-600">
            <Heart size={48} className="mb-4 opacity-10" />
            <p>아직 소식이 없어요</p>
          </div>
        )}
      </div>
    </div>
  );
}
