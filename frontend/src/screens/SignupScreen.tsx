import { useState } from 'react';
import { ChevronLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { DEPARTMENTS } from '../constants';

interface SignupData {
  department: string;
  age: number;
  height: number;
  gender: 'male' | 'female' | 'other';
}

export default function SignupScreen() {
  const navigate = useNavigate();
  const { setUser } = useAppContext();
  const [data, setData] = useState<SignupData>({
    department: '',
    age: 20,
    height: 170,
    gender: 'female'
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleComplete = () => {
    setUser(prev => ({ ...prev, ...data } as any));
    navigate('/keyword');
  };

  return (
    <div className="h-full w-full bg-[#0a0a0a] flex flex-col p-6">
      <div className="flex items-center mb-8">
        <button className="p-2 -ml-2 text-gray-400" onClick={() => navigate(-1)}><ChevronLeft /></button>
        <h2 className="text-lg font-medium ml-2">회원가입</h2>
      </div>

      <div className="flex-1 space-y-8">
        <h1 className="text-2xl font-bold leading-snug">
          기본 정보를<br/>입력해 주세요
        </h1>

        <div className="space-y-6">
          {/* Gender */}
          <div className="space-y-3">
            <p className="text-sm text-gray-400">성별</p>
            <div className="flex gap-3">
              {(['male', 'female', 'other'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setData({ ...data, gender: g })}
                  className={`flex-1 py-3 rounded-xl border transition-all ${
                    data.gender === g
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent text-gray-400 border-gray-800'
                  }`}
                >
                  {g === 'male' ? '남성' : g === 'female' ? '여성' : '기타'}
                </button>
              ))}
            </div>
          </div>

          {/* Department */}
          <div className="space-y-3 relative">
            <p className="text-sm text-gray-400">학과</p>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full py-4 px-4 bg-[#1a1a1a] border border-gray-800 rounded-xl text-left flex justify-between items-center"
            >
              {data.department || '학과를 선택하세요'}
              <Check className={`w-4 h-4 transition-opacity ${data.department ? 'opacity-100' : 'opacity-0'}`} />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 max-h-48 overflow-y-auto bg-[#1a1a1a] border border-gray-800 rounded-xl z-50">
                {DEPARTMENTS.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => {
                      setData({ ...data, department: dept });
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-800 border-b border-gray-800 last:border-none"
                  >
                    {dept}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Age & Height */}
          <div className="flex gap-4">
            <div className="flex-1 space-y-3">
              <p className="text-sm text-gray-400">나이</p>
              <input
                type="number"
                value={data.age}
                onChange={(e) => setData({ ...data, age: parseInt(e.target.value) })}
                className="w-full py-4 px-4 bg-[#1a1a1a] border border-gray-800 rounded-xl outline-none focus:border-white transition-colors"
              />
            </div>
            <div className="flex-1 space-y-3">
              <p className="text-sm text-gray-400">키 (cm)</p>
              <input
                type="number"
                value={data.height}
                onChange={(e) => setData({ ...data, height: parseInt(e.target.value) })}
                className="w-full py-4 px-4 bg-[#1a1a1a] border border-gray-800 rounded-xl outline-none focus:border-white transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleComplete}
        disabled={!data.department}
        className={`w-full py-4 font-bold rounded-2xl mb-4 transition-all ${
          data.department ? 'bg-white text-black' : 'bg-gray-800 text-gray-500 cursor-not-allowed'
        }`}
      >
        다음 단계로
      </button>
    </div>
  );
}
