import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { DEPARTMENTS } from '../constants';
import SumungMascot from '../components/SumungMascot';
import MyKeyword from '../components/signUp/MyKeyword';
import YourKeyword from '../components/signUp/YourKeyword';
import SignUpResult from '../components/signUp/SignUpResult';

const NICKNAMES = ['반딧불이', '새벽별', '봄비향기', '달빛소나타', '초록마음', '하늘구름', '은하수별', '아침이슬', '노을빛', '첫눈처럼'];
const randomNickname = () => NICKNAMES[Math.floor(Math.random() * NICKNAMES.length)];

// ── 회원가입 데이터 타입 (기존 유지) ──────────────────
interface SignupData {
  department: string;
  age:        number;
  height:     number;
  gender:     'male' | 'female' | 'other';
}

// ── 스텝별 제목·부제목 ────────────────────────────────
const TOTAL_STEPS = 4;
const STEP_CONFIG = [
  { title: '학과를 알려주세요',  subtitle: '익명으로 보호됩니다 🔒' },
  { title: '성별을 알려주세요',  subtitle: '익명으로 보호됩니다 🔒' },
  { title: '나이를 알려주세요',  subtitle: '익명으로 보호됩니다 🔒' },
  { title: '키를 알려주세요',    subtitle: '익명으로 보호됩니다 🔒' },
];

// ── 공통 선택 버튼 스타일 ─────────────────────────────
function SelectBtn({
  label, selected, onClick,
}: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="py-4 rounded-2xl text-sm font-medium transition-all active:scale-95"
      style={{
        background: selected ? '#ffffff' : 'rgba(255,255,255,0.15)',
        border: `1px solid ${selected ? '#ffffff' : 'rgba(255,255,255,0.3)'}`,
        color:  selected ? '#C62A47' : 'rgba(255,255,255,0.8)',
        boxShadow: selected ? '0 4px 14px rgba(198,42,71,0.25)' : 'none',
      }}
    >
      {label}
    </button>
  );
}

// ── 스텝 콘텐츠 ─────────────────────────────────────
function StepDepartment({
  value, onChange,
}: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {DEPARTMENTS.map((dept) => (
        <SelectBtn
          key={dept} label={dept}
          selected={value === dept}
          onClick={() => onChange(dept)}
        />
      ))}
    </div>
  );
}

function StepGender({
  value, onChange,
}: { value: 'male' | 'female' | 'other'; onChange: (v: 'male' | 'female' | 'other') => void }) {
  return (
    <div className="grid grid-cols-3 gap-3 mt-4">
      {(['male', 'female', 'other'] as const).map((g) => (
        <SelectBtn
          key={g}
          label={g === 'male' ? '남성' : g === 'female' ? '여성' : '기타'}
          selected={value === g}
          onClick={() => onChange(g)}
        />
      ))}
    </div>
  );
}

function Stepper({
  value, unit, min, max, onChange,
}: { value: number; unit: string; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="flex flex-col items-center gap-8 mt-6">
      {/* 큰 숫자 표시 */}
      <div className="flex items-center gap-10">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-14 h-14 rounded-full text-2xl font-bold text-white flex items-center justify-center transition-all active:scale-90"
          style={{ background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.14)' }}
        >
          −
        </button>

        <div className="text-center w-28">
          <span className="text-6xl font-extrabold text-white tabular-nums">{value}</span>
          <p className="text-sm text-gray-500 mt-1">{unit}</p>
        </div>

        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-14 h-14 rounded-full text-2xl font-bold text-white flex items-center justify-center transition-all active:scale-90"
          style={{ background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.14)' }}
        >
          +
        </button>
      </div>

      {/* 슬라이더 */}
      <input
        type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{
          accentColor: '#C62A47',
          background: `linear-gradient(to right, #C62A47 0%, #F07085 ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.25) ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.25) 100%)`,
        }}
      />
      <div className="w-full flex justify-between text-[10px] text-gray-600 -mt-5">
        <span>{min}</span><span>{max}</span>
      </div>
    </div>
  );
}

// ── 메인 컴포넌트 ────────────────────────────────────
export default function SignupPage() {
  const navigate = useNavigate();
  const { setUser } = useAppContext();

  const [step, setStep] = useState(1);
  const [data, setData] = useState<SignupData>({
    department: '',
    age:        21,
    height:     168,
    gender:     'female',
  });
  const [myKeywords,   setMyKeywords]   = useState<string[]>([]);
  const [yourKeywords, setYourKeywords] = useState<string[]>([]);
  const [nickname] = useState(randomNickname);

  // 스텝 5~7은 전체 화면 컴포넌트로 분기
  if (step === 5) {
    return (
      <MyKeyword
        selected={myKeywords}
        onToggle={(k) => setMyKeywords(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k])}
        onNext={() => setStep(6)}
        onBack={() => setStep(4)}
      />
    );
  }
  if (step === 6) {
    return (
      <YourKeyword
        selected={yourKeywords}
        onToggle={(k) => setYourKeywords(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k])}
        onNext={() => setStep(7)}
        onBack={() => setStep(5)}
      />
    );
  }
  if (step === 7) {
    return (
      <SignUpResult
        nickname={nickname}
        department={data.department}
        keywords={myKeywords}
        onEnter={() => {
          setUser(prev => ({
            ...prev,
            ...data,
            nickname,
            keywords:      myKeywords,
            idealKeywords: yourKeywords,
          } as any));
          navigate('/home');
        }}
      />
    );
  }

  // 현재 스텝에서 '다음' 활성화 여부
  const canProceed =
    step === 1 ? data.department !== '' :
    step === 2 ? true :
    step === 3 ? data.age > 0 :
                 data.height > 0;

  const handleBack = () => {
    if (step > 1) setStep(s => s - 1);
    else navigate(-1);
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(s => s + 1);
    } else {
      setStep(5);
    }
  };

  const { title, subtitle } = STEP_CONFIG[step - 1];

  return (
    <div
      className="h-full w-full flex flex-col"
      style={{ background: 'linear-gradient(160deg, #C62A47 0%, #F07085 50%, #FFC4C4 100%)' }}
    >
      {/* ── 상단: 뒤로가기 + 진행 표시 ── */}
      <div className="px-5 pt-6 pb-3 flex-shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={handleBack} className="p-1 -ml-1 text-gray-400 active:text-white transition-colors">
            <ChevronLeft size={22} />
          </button>
          <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {step} / {TOTAL_STEPS}
          </span>
        </div>

        {/* 진행 바 */}
        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width:      `${(step / TOTAL_STEPS) * 100}%`,
              background: 'linear-gradient(90deg, #C62A47, #F07085)',
            }}
          />
        </div>
      </div>

      {/* ── 타이틀 영역 ── */}
      <div className="px-5 pt-3 pb-5 flex items-center gap-3 flex-shrink-0">
        <div className="w-12 h-14 flex-shrink-0">
          <SumungMascot className="w-12 h-14" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white leading-tight">{title}</h1>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>{subtitle}</p>
        </div>
      </div>

      {/* ── 콘텐츠 ── */}
      <div className="flex-1 overflow-y-auto px-5 pb-4">

        {step === 1 && (
          <StepDepartment
            value={data.department}
            onChange={(v) => setData({ ...data, department: v })}
          />
        )}

        {step === 2 && (
          <StepGender
            value={data.gender}
            onChange={(v) => setData({ ...data, gender: v })}
          />
        )}

        {step === 3 && (
          <Stepper
            value={data.age} unit="세"
            min={18} max={40}
            onChange={(v) => setData({ ...data, age: v })}
          />
        )}

        {step === 4 && (
          <Stepper
            value={data.height} unit="cm"
            min={140} max={200}
            onChange={(v) => setData({ ...data, height: v })}
          />
        )}

      </div>

      {/* ── 하단 버튼 ── */}
      <div className="px-5 pb-8 pt-3 flex-shrink-0">
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className="w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-95"
          style={canProceed ? {
            background: '#ffffff',
            boxShadow:  '0 8px 24px rgba(198,42,71,0.30)',
            color:      '#C62A47',
          } : {
            background: 'rgba(255,255,255,0.25)',
            color:      'rgba(255,255,255,0.4)',
            cursor:     'not-allowed',
          }}
        >
          다음
        </button>
      </div>
    </div>
  );
}
