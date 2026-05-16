import React, { useState } from 'react';
import { Settings, Shield, HelpCircle, LogOut } from 'lucide-react';

import { useAppContext } from '../context/AppContext';
import SumungMascot from '../components/SumungMascot';
import NavBar from '../utils/NavBar';
import { GlowBackground, GLASS } from '../utils/background';
import QuestionModal from '../components/profile/QuestionModal';
import LogOutModal from '../components/profile/LogOutModal';

export default function ProfilePage() {
  const { user, logout } = useAppContext();
  const [showFaq, setShowFaq] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = async () => {
    await fetch('/logout', { method: 'POST', credentials: 'include' });
    logout();
    window.location.href =
      'https://kauth.kakao.com/oauth/logout?client_id=31a7d5d4e54711631ace5fb8be607dc2&logout_redirect_uri=http://localhost:3000/';
  };

  // user가 없으면 골격 UI 표시 (로그인은 됐지만 프로필 미완성 or 로딩 중)
  const displayUser = user ?? {
    nickname: '익명의 수뭉이',
    department: '학과 미등록',
    age: 0,
    height: 0,
  };

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
          <h2 className="text-2xl font-bold text-white mb-1">{displayUser.nickname || '익명의 수뭉이'}</h2>
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.88)' }}>{displayUser.department}</p>

          <div className="flex gap-3">
            {displayUser.age > 0 && (
              <div
                className="px-8 py-3 rounded-2xl text-center"
                style={GLASS.cardLight}
              >
                <span className="block text-[10px] mb-1" style={{ color: 'rgba(255,255,255,0.85)' }}>나이</span>
                <span className="font-bold text-white text-sm"><span className="font-numeral">{displayUser.age}</span>세</span>
              </div>
            )}
            {displayUser.height > 0 && (
              <div
                className="px-8 py-3 rounded-2xl text-center"
                style={GLASS.cardLight}
              >
                <span className="block text-[10px] mb-1" style={{ color: 'rgba(255,255,255,0.85)' }}>키</span>
                <span className="font-bold text-white text-sm"><span className="font-numeral">{displayUser.height}</span>cm</span>
              </div>
            )}
          </div>
        </div>

        {/* 메뉴 섹션 */}
        <div className="px-6 space-y-5">
          <section>
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-3 ml-1"
              style={{ color: 'rgba(255,255,255,0.80)' }}>
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
              style={{ color: 'rgba(255,255,255,0.80)' }}>
              고객지원
            </h3>
            <div
              className="rounded-3xl overflow-hidden"
              style={GLASS.card}
            >
              <MenuItem icon={<HelpCircle size={18} />} label="자주 묻는 질문" onClick={() => setShowFaq(true)} />
              <MenuItem icon={<LogOut size={18} />} label="로그아웃" danger onClick={() => setShowLogout(true)} />
            </div>
          </section>
        </div>

        <div className="mt-10 text-center pb-4">
          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.62)' }}>SUMTING Version 1.0.0 (Beta)</p>
        </div>
      </div>

      <NavBar />

      <QuestionModal visible={showFaq} onClose={() => setShowFaq(false)} />
      <LogOutModal visible={showLogout} onClose={() => setShowLogout(false)} onConfirm={handleLogout} />
    </GlowBackground>
  );
}

function MenuItem({
  icon, label, danger = false, onClick,
}: { icon: React.ReactNode; label: string; danger?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-6 py-4 active:bg-white/10 transition-colors"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}
    >
      <div style={{ color: danger ? '#ffb3b3' : 'rgba(255,255,255,0.85)' }}>{icon}</div>
      <span
        className="text-sm font-medium"
        style={{ color: danger ? '#ffb3b3' : '#ffffff' }}
      >
        {label}
      </span>
    </button>
  );
}
