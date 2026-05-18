import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { HelpCircle, FileText, BellOff, BellRing } from 'lucide-react';

import { useAppContext } from '../context/AppContext';
import MascotImage from '../components/MascotImage';
import NavBar from '../utils/NavBar';
import { GlowBackground, GLASS } from '../utils/background';
import QuestionModal from '../components/profile/QuestionModal';
import LogOutModal from '../components/profile/LogOutModal';
import PrivacyModal from '../components/profile/PrivacyModal';
import { registerPushToken, unregisterPushToken } from '../firebase';

export default function ProfilePage() {
  const { user, logout } = useAppContext();
  const [showFaq, setShowFaq] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    || (window.navigator as unknown as { standalone?: boolean }).standalone === true;

  const [notifEnabled, setNotifEnabled] = useState<boolean>(() => {
    if (!('Notification' in window)) return false;
    if (Notification.permission !== 'granted') return false;
    return localStorage.getItem('sumting_notif_enabled') !== 'false';
  });

  const handleToggleNotification = async () => {
    if (notifEnabled) {
      await unregisterPushToken();
      localStorage.setItem('sumting_notif_enabled', 'false');
      setNotifEnabled(false);
      return;
    }
    if (isIOS && !isStandalone) {
      alert('iOS에서는 홈 화면에 추가 후 알림을 켤 수 있어요.\nSafari 하단 공유 버튼 → "홈 화면에 추가"를 눌러주세요.');
      return;
    }
    if ('Notification' in window && Notification.permission === 'denied') {
      alert('알림이 차단되어 있어요. 기기 설정에서 직접 허용해주세요.');
      return;
    }
    await registerPushToken();
    if ('Notification' in window && Notification.permission === 'granted') {
      localStorage.setItem('sumting_notif_enabled', 'true');
      setNotifEnabled(true);
    }
  };

  const handleLogout = async () => {
    await fetch('/logout', { method: 'POST', credentials: 'include' });
    logout();
    window.location.href =
      'https://kauth.kakao.com/oauth/logout?client_id=31a7d5d4e54711631ace5fb8be607dc2&logout_redirect_uri=https://sumting.co.kr/';
  };

  const handleWithdraw = async () => {
    await fetch('/api/me', { method: 'DELETE', credentials: 'include' });
    logout();
    window.location.href =
      'https://kauth.kakao.com/oauth/logout?client_id=31a7d5d4e54711631ace5fb8be607dc2&logout_redirect_uri=https://sumting.co.kr/';
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
      <Helmet><title>프로필 - 숨팅</title></Helmet>

      <div className="flex-1 overflow-y-auto pb-24 z-10">

        {/* 유저 정보 */}
        <div className="flex items-center justify-center gap-5 px-6 pt-8 mb-6">
          <div className="relative flex-shrink-0">
            <div
              className="absolute inset-0 rounded-full scale-150 blur-[40px]"
              style={{ background: 'rgba(255,255,255,0.2)' }}
            />
            <MascotImage type={user?.mascotType ?? 'basic'} className="w-24 h-28 relative" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-0.5">{displayUser.nickname || '익명의 수뭉이'}</h2>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.88)' }}>{displayUser.department}</p>
            {(displayUser.age > 0 || displayUser.height > 0) && (
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
                {[displayUser.age > 0 && `${displayUser.age}세`, displayUser.height > 0 && `${displayUser.height}cm`]
                  .filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
        </div>

        {/* 메뉴 섹션 */}
        <div className="px-6 space-y-4">
          {user?.keywords && user.keywords.length > 0 && (
            <section>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-center"
                style={{ color: 'rgba(255,255,255,0.78)' }}>자기소개 키워드</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {user.keywords.map(kw => (
                  <span key={kw} className="px-4 py-2 rounded-2xl text-sm font-medium text-white" style={GLASS.cardLight}>{kw}</span>
                ))}
              </div>
            </section>
          )}

          {user?.idealKeywords && user.idealKeywords.length > 0 && (
            <section>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-center"
                style={{ color: 'rgba(255,255,255,0.78)' }}>이상형 키워드</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {user.idealKeywords.map(kw => (
                  <span key={kw} className="px-4 py-2 rounded-2xl text-sm font-medium text-white" style={GLASS.cardLight}>{kw}</span>
                ))}
              </div>
            </section>
          )}

          <section>
            <div className="rounded-3xl overflow-hidden" style={GLASS.card}>
              <button
                onClick={handleToggleNotification}
                className="w-full flex items-center gap-4 px-6 py-4 active:bg-white/10 transition-colors"
              >
                <div style={{ color: 'rgba(255,255,255,0.85)' }}>
                  {notifEnabled ? <BellRing size={18} /> : <BellOff size={18} />}
                </div>
                <span className="text-sm font-medium text-white flex-1 text-left">
                  하트핑 · 채팅 알림
                </span>
                <div
                  className="relative w-12 h-6 rounded-full transition-colors duration-200"
                  style={{ background: notifEnabled ? '#C62A47' : 'rgba(255,255,255,0.25)' }}
                >
                  <div
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
                    style={{ left: notifEnabled ? '28px' : '4px' }}
                  />
                </div>
              </button>
            </div>
          </section>

          <section>
            <div
              className="rounded-3xl overflow-hidden"
              style={GLASS.card}
            >
              <MenuItem icon={<HelpCircle size={18} />} label="자주 묻는 질문" onClick={() => setShowFaq(true)} />
              <MenuItem icon={<FileText size={18} />} label="개인정보처리방침" onClick={() => setShowPrivacy(true)} />
              <div className="flex" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                <button
                  onClick={() => setShowLogout(true)}
                  className="flex-1 py-4 text-sm font-medium active:bg-white/10 transition-colors"
                  style={{ color: '#ff4444', borderRight: '1px solid rgba(255,255,255,0.15)' }}
                >
                  로그아웃
                </button>
                <button
                  onClick={() => setShowWithdraw(true)}
                  className="flex-1 py-4 text-sm font-medium active:bg-white/10 transition-colors"
                  style={{ color: '#ff4444' }}
                >
                  탈퇴
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-10 text-center pb-4">
          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.62)' }}>SUMTING Version 1.0.0 (Beta)</p>
        </div>
      </div>

      <NavBar />

      <QuestionModal visible={showFaq} onClose={() => setShowFaq(false)} />
      <PrivacyModal visible={showPrivacy} onClose={() => setShowPrivacy(false)} />
      <LogOutModal visible={showLogout} onClose={() => setShowLogout(false)} onConfirm={handleLogout} />
      <LogOutModal visible={showWithdraw} onClose={() => setShowWithdraw(false)} onConfirm={handleWithdraw} type="withdraw" />
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
