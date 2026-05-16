import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Profile, { SignupData } from '../components/signUp/Profile';
import MyKeyword from '../components/signUp/MyKeyword';
import YourKeyword from '../components/signUp/YourKeyword';
import SignUpResult from '../components/signUp/SignUpResult';
import { registerPushToken } from '../firebase';

type View = 'profile' | 'myKeyword' | 'yourKeyword' | 'result';

export default function SignupPage() {
  const navigate = useNavigate();
  const { kakaoId } = useAppContext();

  const [view, setView] = useState<View>('profile');
  const [profileData, setProfileData] = useState<SignupData | null>(null);
  const [myKeywords, setMyKeywords] = useState<string[]>([]);
  const [yourKeywords, setYourKeywords] = useState<string[]>([]);
  const [nickname, setNickname] = useState('');

  const toggleMyKw = (k: string) =>
    setMyKeywords(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]);

  const toggleYourKw = (k: string) =>
    setYourKeywords(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]);

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

  if (view === 'profile') {
    return (
      <Profile
        onComplete={(data) => { setProfileData(data); setView('myKeyword'); }}
        onBack={() => navigate(-1)}
      />
    );
  }

  if (view === 'myKeyword') {
    return (
      <MyKeyword
        selected={myKeywords}
        onToggle={toggleMyKw}
        onNext={() => setView('yourKeyword')}
        onBack={() => setView('profile')}
      />
    );
  }

  if (view === 'yourKeyword') {
    return (
      <YourKeyword
        selected={yourKeywords}
        onToggle={toggleYourKw}
        onNext={handleSubmit}
        onBack={() => setView('myKeyword')}
      />
    );
  }

  const handleEnter = async () => {
    await registerPushToken();
    navigate('/home');
  };

  return (
    <SignUpResult
      nickname={nickname}
      department={profileData?.department ?? ''}
      keywords={myKeywords}
      onEnter={handleEnter}
    />
  );
}
