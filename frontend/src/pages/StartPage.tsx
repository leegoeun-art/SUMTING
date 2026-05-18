import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import SumungMascot from '../components/SumungMascot';
import { useAppContext } from '../context/AppContext';
import { GlowBackground, LottieHeartBackground, COLORS } from '../utils/background';

// ─────────────────────────────────────────
// 메인 페이지
// ─────────────────────────────────────────
function KakaoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 3C6.477 3 2 6.61 2 11.077c0 2.868 1.814 5.392 4.563 6.88l-1.163 4.34a.3.3 0 0 0 .46.325l5.012-3.312c.37.04.745.062 1.128.062 5.523 0 10-3.61 10-8.077C22 6.609 17.523 3 12 3z"
        fill="rgba(0,0,0,0.85)"
      />
    </svg>
  );
}

export default function StartPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useAppContext();

  const fromLogin = new URLSearchParams(location.search).get('from') === 'login';

  useEffect(() => {
    if (isLoading) return;
    if (!fromLogin) return;

    // 방금 카카오 로그인 완료 → 프로필 유무로 분기
    if (user) {
      navigate('/home', { replace: true });     // 케이스 2: 기존 회원
    } else if (isAuthenticated) {
      navigate('/signup', { replace: true });   // 케이스 1: 신규 회원
    }
  }, [isLoading, fromLogin, user, isAuthenticated, navigate]);

  const handleStart = () => navigate('/home');

  const handleKakaoLogin = () => {
    window.location.href = '/oauth2/authorization/kakao';
  };

  return (
    <GlowBackground className="items-center">
      <Helmet>
        <title>숨팅 (SUMTING) - 대학 축제 48시간 익명 매칭</title>
        <meta name="description" content="대학 축제에서 설레는 인연을 만나보세요. 숨팅은 48시간 한정 익명 매칭 서비스입니다. 하트핑을 보내고 새로운 만남을 시작하세요." />
      </Helmet>

      {/* Lottie 하트 배경 */}
      <LottieHeartBackground />

      {/* 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 w-full relative z-10">
        {/* 마스코트 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: -10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-5"
        >
          <SumungMascot className="w-56 h-60" />
        </motion.div>

        {/* 타이틀 */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="font-display text-4xl font-bold text-white tracking-tight mb-1"
        >
          SUMTING
        </motion.h1>

        {/* 서브타이틀 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-col items-center gap-0.5 mb-7"
        >
          <p className="text-sm font-semibold tracking-wide" style={{ color: 'rgba(255,255,255,0.9)' }}>
            숨팅 : 수뭉팅
          </p>
          <p className="text-xs font-medium tracking-widest" style={{ color: 'rgba(255,255,255,0.7)' }}>
            상명대학교 2026 축제
          </p>
        </motion.div>

        {/* 설명 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-sm text-center leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.85)' }}
        >
          사진 없이, 감성으로 연결되는<br />
          48시간 한정 익명 매칭
        </motion.p>
      </div>

      {/* 하단 영역 */}
      <div className="w-full px-8 pb-8 flex flex-col items-center gap-4 relative z-10">
        {/* 시작 / 로그인 버튼 */}
        {!isLoading && !fromLogin && (
          isAuthenticated ? (
            /* 케이스 3: 세션 쿠키 있는 회원 → 버튼 클릭 시 홈 */
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              onClick={handleStart}
              className="w-full py-4 rounded-2xl font-bold text-base active:scale-95 transition-transform shadow-lg"
              style={{
                background: '#ffffff',
                color:      COLORS.primary,
                boxShadow:  '0 8px 24px rgba(198,42,71,0.30)',
              }}
            >
              숨팅 시작하기
            </motion.button>
          ) : !isAuthenticated ? (
            /* 비회원 → 카카오 로그인 */
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              onClick={handleKakaoLogin}
              className="w-full py-4 rounded-2xl font-bold text-base active:scale-95 transition-transform shadow-lg flex items-center justify-center gap-2"
              style={{
                background: '#FEE500',
                color: 'rgba(0,0,0,0.85)',
                boxShadow: '0 8px 24px rgba(254, 229, 0, 0.35)',
              }}
            >
              <KakaoIcon />
              카카오 로그인
            </motion.button>
          ) : null
        )}

        {/* 날짜 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="text-[11px]"
          style={{ color: 'rgba(255,255,255,0.6)' }}
        >
          🌟 2026.5.20 00:00 ~ 05.22 23:59
        </motion.p>
      </div>
    </GlowBackground>
  );
}
