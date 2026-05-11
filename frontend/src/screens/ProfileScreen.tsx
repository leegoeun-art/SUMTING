import React from 'react';
import { ChevronLeft, Settings, Shield, Bell, HelpCircle, LogOut } from 'lucide-react';
import MascotImage from '../components/MascotImage';
import { UserProfile } from '../types';

export default function ProfileScreen({ user, onBack }: { user: UserProfile, onBack: () => void }) {
  return (
    <div className="h-full w-full bg-[#0a0a0a] flex flex-col p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-10">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-400"><ChevronLeft /></button>
        <button className="p-2 -mr-2 text-gray-400"><Settings size={22} /></button>
      </div>

      {/* User Info */}
      <div className="flex flex-col items-center mb-10">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-purple-500/10 blur-[40px] rounded-full" />
          <MascotImage type={user.mascotType || 'basic'} className="w-40 h-40 relative" />
        </div>
        <h2 className="text-2xl font-bold mb-1">{user.nickname || '익명의 숨뭉이'}</h2>
        <p className="text-sm text-gray-500 mb-6">{user.department}</p>
        
        <div className="flex gap-4">
          <div className="bg-[#1a1a1a] px-6 py-2 rounded-2xl border border-gray-800 text-center">
            <span className="block text-xs text-gray-500 mb-1">나이</span>
            <span className="font-bold text-white">{user.age}세</span>
          </div>
          <div className="bg-[#1a1a1a] px-6 py-2 rounded-2xl border border-gray-800 text-center">
            <span className="block text-xs text-gray-500 mb-1">키</span>
            <span className="font-bold text-white">{user.height}cm</span>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="space-y-6">
        <section>
          <h3 className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-4 ml-2">계정 설정</h3>
          <div className="bg-[#1a1a1a] rounded-3xl border border-gray-800 overflow-hidden">
            <MenuItem icon={<Bell size={18} />} label="알림 설정" />
            <MenuItem icon={<Shield size={18} />} label="차단 및 신고 관리" />
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-4 ml-2">고객지원</h3>
          <div className="bg-[#1a1a1a] rounded-3xl border border-gray-800 overflow-hidden">
            <MenuItem icon={<HelpCircle size={18} />} label="자주 묻는 질문" />
            <MenuItem icon={<LogOut size={18} />} label="로그아웃" color="text-red-400" />
          </div>
        </section>
      </div>

      <div className="mt-12 text-center">
        <p className="text-[10px] text-gray-700">SUMTING Version 1.0.0 (Beta)</p>
      </div>
    </div>
  );
}

function MenuItem({ icon, label, color = "text-white" }: { icon: React.ReactNode, label: string, color?: string }) {
  return (
    <button className="w-full flex items-center gap-4 px-6 py-4 hover:bg-white/5 active:bg-white/5 border-b border-gray-800 last:border-none transition-colors">
      <div className="text-gray-500">{icon}</div>
      <span className={`text-sm font-medium ${color}`}>{label}</span>
    </button>
  );
}
