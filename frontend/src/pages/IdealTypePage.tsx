import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { PERSONALITY_KEYWORDS } from '../constants';

export default function IdealTypePage() {
  const navigate = useNavigate();
  const { setUser } = useAppContext();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleKeyword = (k: string) => {
    if (selected.includes(k)) {
      setSelected(selected.filter(item => item !== k));
    } else {
      if (selected.length < 3) {
        setSelected([...selected, k]);
      }
    }
  };

  const handleComplete = () => {
    setUser(prev => ({ ...prev, idealKeywords: selected } as any));
    navigate('/result');
  };

  return (
    <div className="h-full w-full bg-[#0a0a0a] flex flex-col p-6 overflow-y-auto">
      <div className="mt-8 mb-10">
        <h1 className="text-2xl font-bold mb-3">어떤 분을<br/>만나고 싶나요?</h1>
        <p className="text-gray-400 text-sm">선호하는 상대방의 키워드 3개를 골라주세요.</p>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-3 mb-8">
        {PERSONALITY_KEYWORDS.map((k) => {
          const isSelected = selected.includes(k);
          return (
            <motion.button
              key={k}
              onClick={() => toggleKeyword(k)}
              whileTap={{ scale: 0.95 }}
              className={`py-3 px-1 text-sm rounded-xl border transition-all ${
                isSelected
                ? 'bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-500/30'
                : 'bg-[#1a1a1a] border-gray-800 text-gray-400'
              }`}
            >
              {k}
            </motion.button>
          );
        })}
      </div>

      <button
        onClick={handleComplete}
        disabled={selected.length < 3}
        className={`w-full py-4 font-bold rounded-2xl mb-4 sticky bottom-0 transition-all ${
          selected.length === 3 ? 'bg-white text-black' : 'bg-gray-800 text-gray-500'
        }`}
      >
        선택 완료 ({selected.length}/3)
      </button>
    </div>
  );
}
