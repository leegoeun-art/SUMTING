import React from 'react';
import { Settings, Shield, HelpCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import SumungMascot from '../components/SumungMascot';
import NavBar from '../utils/NavBar';
import { GlowBackground, GLASS } from '../utils/background';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAppContext();

  if (!user) {
    navigate('/home');
    return null;
  }

  return (
    <GlowBackground>

      <div className="flex-1 overflow-y-auto pb-28 z-10">
        {/* 상단 버튼 */}
        <div className="flex justify-end items-center px-6 pt-6 mb-2">
          <button className="p-2 -mr-2" style={{ color: 'rgba(255,255,255,0.75)' }}>
            <Settings size={22} />
          </button>
        </div>

        {/* 유저 정보 */}
        <div className="flex flex-col items-center px-6 mb-8">
          <div className="relative mb-4">
            <div
              className="absolute inset-0 rounded-full scale-150 blur-[40px]"
              style={{ background: 'rgba(255,255,255,0.2)' }}
            />
            <SumungMascot className="w-40 h-44 relative" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">{user.nickname || '익명의 수뭉이'}</h2>
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.7)' }}>{user.department}</p>

          <div className="flex gap-3">
            <div
              className="px-8 py-3 rounded-2xl text-center"
              style={GLASS.cardLight}
            >
              <span className="block text-[10px] mb-1" style={{ color: 'rgba(255,255,255,0.65)' }}>나이</span>
              <span className="font-bold text-white text-sm">{user.age}세</span>
            </div>
            <div
              className="px-8 py-3 rounded-2xl text-center"
              style={GLASS.cardLight}
            >
              <span className="block text-[10px] mb-1" style={{ color: 'rgba(255,255,255,0.65)' }}>키</span>
              <span className="font-bold text-white text-sm">{user.height}cm</span>
            </div>
          </div>
        </div>

        {/* 메뉴 섹션 */}
        <div className="px-6 space-y-5">
          <section>
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-3 ml-1"
              style={{ color: 'rgba(255,255,255,0.55)' }}>
              계정 설정
            </h3>
            <div
              className="rounded-3xl overflow-hidden"
              style={GLASS.card}
            >
              <MenuItem icon={<Shield size={18} />} label="차단 및 신고 관리" />
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-3 ml-1"
              style={{ color: 'rgba(255,255,255,0.55)' }}>
              고객지원
            </h3>
            <div
              className="rounded-3xl overflow-hidden"
              style={GLASS.card}
            >
              <MenuItem icon={<HelpCircle size={18} />} label="자주 묻는 질문" />
              <MenuItem icon={<LogOut size={18} />} label="로그아웃" danger />
            </div>
          </section>
        </div>

        <div className="mt-10 text-center pb-4">
          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>SUMTING Version 1.0.0 (Beta)</p>
        </div>
      </div>

      <NavBar />
    </GlowBackground>
  );
}

function MenuItem({
  icon, label, danger = false,
}: { icon: React.ReactNode; label: string; danger?: boolean }) {
  return (
    <button
      className="w-full flex items-center gap-4 px-6 py-4 active:bg-white/10 transition-colors"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}
    >
      <div style={{ color: danger ? '#ffb3b3' : 'rgba(255,255,255,0.65)' }}>{icon}</div>
      <span
        className="text-sm font-medium"
        style={{ color: danger ? '#ffb3b3' : '#ffffff' }}
      >
        {label}
      </span>
    </button>
  );
}
