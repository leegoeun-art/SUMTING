import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { KEYWORD_CATEGORIES } from '../constants';
import Profile, { SignupData } from '../components/signUp/Profile';
import MyKeyword from '../components/signUp/MyKeyword';
import YourKeyword from '../components/signUp/YourKeyword';
import SignUpResult from '../components/signUp/SignUpResult';
import { registerPushToken } from '../firebase';

type View = 'profile' | 'myKeyword' | 'yourKeyword' | 'result';

export default function SignupPage() {
  const navigate = useNavigate();
  const { kakaoId, setUser } = useAppContext();

  const [view, setView] = useState<View>('profile');
  const [profileData, setProfileData] = useState<SignupData | null>(null);
  const [myKeywords, setMyKeywords] = useState<string[]>([]);
  const [yourKeywords, setYourKeywords] = useState<string[]>([]);
  const [nickname, setNickname] = useState('');

  const makeSelectKw = (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    (keyword: string, categoryLabel: string) => {
      const cat = KEYWORD_CATEGORIES.find(c => c.label === categoryLabel);
      if (!cat) return;
      setter(prev => {
        if (prev.includes(keyword)) return prev.filter(k => k !== keyword);
        const catSelected = prev.filter(k => cat.keywords.includes(k));
        if (catSelected.length >= cat.max) {
          if (cat.max === 1) return [...prev.filter(k => !cat.keywords.includes(k)), keyword];
          return prev;
        }
        return [...prev, keyword];
      });
    };

  const selectMyKw = makeSelectKw(setMyKeywords);
  const selectYourKw = makeSelectKw(setYourKeywords);

  const handleSubmit = async () => {
    if (!profileData) return;
    const res = await fetch('/api/profile', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id:    kakaoId,
        gender:     profileData.gender === 'male',
        department: profileData.department,
        age:        profileData.age,
        height:     profileData.height,
        my_kw1: myKeywords[0] ?? null,
        my_kw2: myKeywords[1] ?? null,
        my_kw3: myKeywords[2] ?? null,
        your_kw1: yourKeywords[0] ?? null,
        your_kw2: yourKeywords[1] ?? null,
        your_kw3: yourKeywords[2] ?? null,
      }),
    });
    const { nickname } = await res.json();
    setNickname(nickname);
    setView('result');
  };

  const helmet = (
    <Helmet>
      <title>회원가입 - 숨팅 (SUMTING)</title>
      <meta name="description" content="숨팅에 가입하고 대학 축제에서 나만의 매칭을 시작해보세요." />
    </Helmet>
  );

  if (view === 'profile') {
    return (
      <>
        {helmet}
        <Profile
          onComplete={(data) => { setProfileData(data); setView('myKeyword'); }}
          onBack={() => navigate(-1)}
        />
      </>
    );
  }

  if (view === 'myKeyword') {
    return (
      <>
        {helmet}
        <MyKeyword
          selected={myKeywords}
          onSelect={selectMyKw}
          onNext={() => setView('yourKeyword')}
          onBack={() => setView('profile')}
        />
      </>
    );
  }

  if (view === 'yourKeyword') {
    return (
      <>
        {helmet}
        <YourKeyword
          selected={yourKeywords}
          onSelect={selectYourKw}
          onNext={handleSubmit}
          onBack={() => setView('myKeyword')}
        />
      </>
    );
  }

  const handleEnter = async () => {
    await registerPushToken();
    const res = await fetch('/api/me', { credentials: 'include', cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data?.department) setUser(data);
    }
    navigate('/home');
  };

  return (
    <>
      {helmet}
      <SignUpResult
        nickname={nickname}
        department={profileData?.department ?? ''}
        keywords={myKeywords}
        onEnter={handleEnter}
      />
    </>
  );
}
