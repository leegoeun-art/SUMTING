import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Bell, Clock, Heart, RefreshCw, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import MascotImage from '../components/MascotImage';
import SumungMascot from '../components/SumungMascot';
import NavBar from '../utils/NavBar';
import { GlowBackground, GLASS } from '../utils/background';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import heartLottieUrl from '../assets/heart.lottie?url';
import { RecommendedUser } from '../types';
import { FESTIVAL_END_TIME, DEPARTMENT_MASCOT } from '../constants';
import ProfileModal from '../components/home/ProfileModal';
import { registerPushToken } from '../firebase';

const DAILY_LIMIT = 5;
const MS_24H = 24 * 60 * 60 * 1000;

/** GET /api/couples 응답 형태 */
interface CouplesApiItem {
  user_id:    string;
  nickname:   string;
  department: string;
  my_kw1:     string | null;
  my_kw2:     string | null;
  my_kw3:     string | null;
  status:     string;
}

/** API 응답 → RecommendedUser 변환 */
function toRecommendedUser(item: CouplesApiItem): RecommendedUser {
  return {
    id:         item.user_id,
    nickname:   item.nickname,
    department: item.department,
    keywords:   [item.my_kw1, item.my_kw2, item.my_kw3].filter((k): k is string => !!k),
    mascotType: DEPARTMENT_MASCOT[item.department] ?? 'basic',
    matchScore: 0,
    status:     (item.status as RecommendedUser['status']) ?? 'none',
  };
}

/** 내 이상형 키워드와 상대 키워드의 일치율 계산 (0 / 33 / 66 / 100) */
function computeMatchScore(theirKeywords: string[], myIdealKeywords: string[]): number {
  const matchCount = theirKeywords.filter(k => myIdealKeywords.includes(k)).length;
  return Math.round((matchCount / 3) * 100);
}

function isNotifOff() {
  if (!('Notification' in window)) return false;
  if (Notification.permission !== 'granted') return true;
  return localStorage.getItem('sumting_notif_enabled') === 'false';
}

function isIosNonPwa() {
  const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isStandalone = ('standalone' in navigator) && (navigator as { standalone?: boolean }).standalone === true;
  return isIos && !isStandalone;
}

export default function HomePage() {
  const navigate = useNavigate();
  const { user, setUser, rejectedUsers, addSentPing, setActiveChat } = useAppContext();
  const [timeLeft,        setTimeLeft]        = useState('');
  const [modalUser,       setModalUser]       = useState<RecommendedUser | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendedUser[]>([]);
  const [loadingCouples,  setLoadingCouples]  = useState(true);
  const [showNotifBanner, setShowNotifBanner] = useState(
    () => isNotifOff() && sessionStorage.getItem('sumting_notif_banner_dismissed') !== '1'
  );
  const [showIosBanner, setShowIosBanner] = useState(
    () => isIosNonPwa() && sessionStorage.getItem('sumting_notif_banner_dismissed') !== '1'
  );

  const handleBannerEnable = async () => {
    await registerPushToken();
    if ('Notification' in window && Notification.permission === 'granted') {
      localStorage.setItem('sumting_notif_enabled', 'true');
      setShowNotifBanner(false);
    }
  };

  const handleBannerDismiss = () => {
    sessionStorage.setItem('sumting_notif_banner_dismissed', '1');
    setShowNotifBanner(false);
    setShowIosBanner(false);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(FESTIVAL_END_TIME).getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeLeft('EPISODE ENDED');
        clearInterval(timer);
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const loadCouples = () => {
    setLoadingCouples(true);
    fetch('/api/couples', { credentials: 'include' })
        .then(res => (res.ok ? res.json() : []))
        .then((data: CouplesApiItem[]) => setRecommendations(data.map(toRecommendedUser)))
        .catch(() => {})
        .finally(() => setLoadingCouples(false));
  };

  // GET /api/couples — 추천 상대 목록 로드
  useEffect(() => { loadCouples(); }, []);

  // 하트핑 보내기 — API 성공 후에만 UI 업데이트
  const handleSendHeartPing = async (u: RecommendedUser) => {
    if (!user || user.heart <= 0) {
      alert('오늘의 하트핑을 다 사용하셨습니다!');
      return;
    }

    const res = await fetch('/api/heartPing', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiverUuid: u.id }),
    }).catch(() => null);

    if (!res || !res.ok) {
      const msg = res?.status === 409
          ? await res.text().catch(() => '하트가 부족합니다.')
          : '오류가 발생했습니다. 다시 시도해주세요.';
      alert(msg);
      return;
    }

    setUser(prev => prev ? { ...prev, heart: prev.heart - 1 } : prev);
    setRecommendations(prev => prev.map(r => r.id === u.id ? { ...r, status: 'pending' as const } : r));
    addSentPing(u);
    setModalUser(null);
    navigate('/heartpings', { state: { tab: 'sent' } });
  };

  const heartRemaining = user?.heart ?? DAILY_LIMIT;
  const usedToday = DAILY_LIMIT - heartRemaining;

  const idealKeywords = user?.idealKeywords ?? [];

  // 오늘의 인연 필터 & 정렬
  // - 하트핑 보낸 유저 → 완전 제외
  // - 24시간 미만 거절 → 완전 제외
  // - 24시간 이상 거절 → 하단 배치
  const now = Date.now();
  const visibleRecommendations = recommendations
      .map(u => ({ ...u, matchScore: computeMatchScore(u.keywords, idealKeywords) }))
      .filter(u => {
        const rejectedAt = rejectedUsers[u.id];
        if (!rejectedAt) return true;
        return now - rejectedAt >= MS_24H;
      })
      .sort((a, b) => {
        const aRejected = rejectedUsers[a.id] ?? 0;
        const bRejected = rejectedUsers[b.id] ?? 0;
        if (aRejected && !bRejected) return 1;
        if (!aRejected && bRejected) return -1;
        return 0;
      });

  return (
      <GlowBackground>
        <Helmet><title>홈 - 숨팅</title></Helmet>

        {/* Header */}
        <div
            className="z-10 px-6 pt-5 pb-2 flex justify-between items-center"
            style={{ background: 'linear-gradient(180deg, rgba(140,50,20,0.14) 0%, transparent 100%)' }}
        >
          <div className="flex items-center gap-2.5">
            <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(198,42,71,0.22)', border: '1px solid rgba(198,42,71,0.35)' }}
            >
              <Heart size={15} fill="#C62A47" className="" />
            </div>
            <h1
                className="font-display text-xl font-bold tracking-tight"
                style={{
                  background: 'linear-gradient(135deg, #7A1528 0%, #C62A47 50%, #FF8C78 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
            >SUMTING</h1>
          </div>
          <div className="flex gap-4">
            <button onClick={loadCouples} className="p-2" style={{ color: '#7A1528' }}>
              <RefreshCw size={20} className={loadingCouples ? 'animate-spin' : ''} />
            </button>
            <button onClick={() => navigate('/heartpings')} className="relative p-2" style={{ color: '#7A1528' }}>
              <Bell size={24} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: '#C62A47' }} />
            </button>
          </div>
        </div>

        {showIosBanner && (
          <div className="z-10 mx-4 mt-2 mb-1 flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{ background: 'rgba(198,42,71,0.22)', border: '1px solid rgba(198,42,71,0.4)' }}>
            <Bell size={16} style={{ color: '#FF8C78', flexShrink: 0 }} />
            <p className="text-xs text-white flex-1">
              알림을 받으려면 <span className="font-bold">공유 → 홈 화면에 추가</span>해주세요
            </p>
            <button onClick={handleBannerDismiss} style={{ color: 'rgba(255,255,255,0.6)' }}>
              <X size={14} />
            </button>
          </div>
        )}

        {showNotifBanner && !showIosBanner && (
          <div className="z-10 mx-4 mt-2 mb-1 flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{ background: 'rgba(198,42,71,0.22)', border: '1px solid rgba(198,42,71,0.4)' }}>
            <Bell size={16} style={{ color: '#FF8C78', flexShrink: 0 }} />
            <p className="text-xs text-white flex-1">하트핑·채팅 알림을 켜보세요</p>
            <button
              onClick={handleBannerEnable}
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: '#C62A47', color: '#fff' }}
            >
              켜기
            </button>
            <button onClick={handleBannerDismiss} style={{ color: 'rgba(255,255,255,0.6)' }}>
              <X size={14} />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto z-10 px-6 pb-24">
          {/* Timer Section */}
          <div className="my-6 flex flex-col items-center">
            <div className="backdrop-blur-md px-6 py-4 rounded-[32px] w-full"
                 style={GLASS.cardLight}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium tracking-widest uppercase mb-2" style={{ color: 'rgba(255,255,255,0.90)' }}>숨팅 종료까지</p>
                  <div className="flex items-center gap-2">
                    <Clock size={14} style={{ color: '#E87060' }} />
                    <span className="font-numeral text-3xl font-bold text-white tracking-tighter">
                    {timeLeft}
                  </span>
                  </div>
                </div>
                <SumungMascot className="w-28 h-30 -mb-4" />
              </div>
            </div>
          </div>

          {/* Heartping Counter */}
          <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="mb-6 rounded-[24px] px-5 py-4"
              style={GLASS.card}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-white">오늘의 하트핑</span>
              <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{
                    background: 'rgba(255,255,255,0.18)',
                    color: 'rgba(255,255,255,0.95)',
                    border: '1px solid rgba(255,255,255,0.35)',
                  }}
              >
              <span className="font-numeral">{heartRemaining}</span>개 남음
            </span>
            </div>

            {/* 하트 인디케이터 */}
            <div className="flex items-center justify-center gap-3">
              {Array.from({ length: DAILY_LIMIT }).map((_, i) => {
                const used = i < usedToday;
                return (
                    <Heart
                        key={i}
                        size={28}
                        fill={used ? 'rgba(255,255,255,0.10)' : 'rgba(255,248,240,0.88)'}
                        stroke={used ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.55)'}
                        strokeWidth={1.2}
                        style={{ filter: used ? 'none' : 'drop-shadow(0 0 7px rgba(255,240,230,0.7))' }}
                    />
                );
              })}
            </div>

            <p className="text-[10px] mt-2.5" style={{ color: 'rgba(255,255,255,0.80)' }}>
              축제 3일간 최대 15개 · 하루 {DAILY_LIMIT}개 한도
            </p>
          </motion.div>

          {/* User Recommendation */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-white">오늘의 인연</h3>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* 로딩 중 */}
              {loadingCouples && (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <DotLottieReact src={heartLottieUrl} loop autoplay style={{ width: 80, height: 80 }} />
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>인연을 찾고 있어요...</p>
                  </div>
              )}

              {/* 데이터 없음 */}
              {!loadingCouples && visibleRecommendations.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <DotLottieReact src={heartLottieUrl} loop autoplay style={{ width: 96, height: 96 }} />
                    <p className="text-sm font-semibold text-white">오늘의 인연이 없어요</p>
                    <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.75)' }}>
                      내일 다시 확인해보세요 💌
                    </p>
                  </div>
              )}

              {!loadingCouples && visibleRecommendations.map((u, idx) => (
                  <motion.div
                      key={u.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => {
                        if (u.status === 'matched') {
                          setActiveChat({ id: `c-${u.id}`, partner: u, unreadCount: 0 });
                          navigate('/chat');
                        } else {
                          setModalUser(u);
                        }
                      }}
                      className="group relative rounded-[32px] p-6 transition-all active:scale-[0.98]"
                      style={GLASS.card}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                             style={GLASS.icon}>
                          <MascotImage type={u.mascotType} className="w-16 h-16" />
                        </div>
                        {u.status === 'matched' && (
                            <span className="absolute -top-2 -right-2 text-xs font-bold px-2 py-0.5 rounded-full"
                                  style={{ background: 'rgba(255,255,255,0.95)', color: '#C62A47', boxShadow: '0 2px 8px rgba(198,42,71,0.3)' }}>
                        ✨ 매칭
                      </span>
                        )}
                        {u.status === 'received' && (
                            <span className="absolute -top-2 -right-2 text-xs font-bold px-2 py-0.5 rounded-full"
                                  style={{ background: '#C62A47', color: '#ffffff', boxShadow: '0 2px 8px rgba(198,42,71,0.4)' }}>
                        💗 받음
                      </span>
                        )}
                        {u.status === 'pending' && (
                            <span className="absolute -top-2 -right-2 text-xs font-bold px-2 py-0.5 rounded-full"
                                  style={{ background: 'rgba(255,255,255,0.25)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.4)' }}>
                        💌 보냄
                      </span>
                        )}
                        {(u.status === 'exited' || u.status === 'rejected') && (
                            <span className="absolute -top-2 -right-2 text-xs font-bold px-2 py-0.5 rounded-full"
                                  style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.25)' }}>
                        ✗ 거절
                      </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-lg text-white">{u.nickname}</h4>
                          {u.matchScore > 0 && (
                              <span
                                  className="font-numeral text-xs font-bold"
                                  style={{ color: '#FF6B6B' }}
                              >
                          {u.matchScore}% Match
                        </span>
                          )}
                        </div>
                        <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.88)' }}>{u.department}</p>
                        <div className="flex flex-wrap gap-2">
                          {u.keywords.map(k => {
                            const matched = idealKeywords.includes(k);
                            return (
                                <span
                                    key={k}
                                    className="inline-flex items-center gap-0.5 text-[10px] px-2 py-1 rounded-lg font-semibold"
                                    style={matched
                                        ? { background: 'rgba(232,80,80,0.22)', color: '#FF6B6B', border: '1px solid rgba(232,80,80,0.4)' }
                                        : { background: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.85)' }
                                    }
                                >
                            #{k}
                                  {matched && (
                                      <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                                        <path d="M2 5l2.5 2.5L8 3" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                  )}
                          </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* 공통 하단 네비게이션 */}
        <NavBar />

        {/* 프로필 모달 */}
        <ProfileModal
            user={modalUser}
            onSendHeartPing={handleSendHeartPing}
            onClose={() => setModalUser(null)}
        />
      </GlowBackground>
  );
}
