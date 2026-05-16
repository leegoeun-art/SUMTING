import { ChevronLeft } from 'lucide-react';
import SumungMascot from '../SumungMascot';
import { KEYWORD_CATEGORIES } from '../../constants';
import { GRADIENT } from '../../utils/background';

interface Props {
  selected: string[];
  onSelect: (keyword: string, category: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function YourKeyword({ selected, onSelect, onNext, onBack }: Props) {
  const canNext = KEYWORD_CATEGORIES.every(cat =>
    selected.filter(k => cat.keywords.includes(k)).length === cat.max
  );

  return (
    <div
      className="h-full w-full flex flex-col"
      style={{ background: GRADIENT }}
    >
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex-shrink-0">
        <div className="flex items-center gap-2 mb-0.5">
          <button onClick={onBack} className="p-1 -ml-1 text-white/70 active:text-white transition-colors">
            <ChevronLeft size={22} />
          </button>
          <h1 className="text-lg font-bold text-white">이상형 키워드</h1>
        </div>
        <p className="text-xs pl-7" style={{ color: 'rgba(255,255,255,0.65)' }}>성격 2개, 취향 1개 선택</p>
      </div>

      {/* Info card */}
      <div className="mx-5 mb-5 flex-shrink-0">
        <div
          className="rounded-2xl px-4 py-3 flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}
        >
          <SumungMascot className="w-14 h-16 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-white">어떤 사람을 만나고 싶나요?</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.65)' }}>
              {selected.length}/3 선택됨
            </p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto px-5 pb-4 flex flex-col gap-5">
        {KEYWORD_CATEGORIES.map(cat => (
          <div key={cat.label}>
            <p className="text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>
              {cat.label} ({selected.filter(k => cat.keywords.includes(k)).length}/{cat.max})
            </p>
            <div className="flex flex-wrap gap-2">
              {cat.keywords.map(k => {
                const active = selected.includes(k);
                return (
                  <button
                    key={k}
                    onClick={() => onSelect(k, cat.label)}
                    className="py-2 px-4 rounded-full text-sm transition-all active:scale-95"
                    style={{
                      background: active ? '#ffffff' : 'rgba(255,255,255,0.15)',
                      color: active ? '#C62A47' : 'rgba(255,255,255,0.9)',
                      border: `1px solid ${active ? '#ffffff' : 'rgba(255,255,255,0.3)'}`,
                      fontWeight: active ? 700 : 500,
                    }}
                  >
                    {k}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom button */}
      <div className="px-5 pb-8 pt-3 flex-shrink-0">
        <button
          onClick={onNext}
          disabled={!canNext}
          className="w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-95"
          style={
            canNext
              ? { background: '#ffffff', color: '#C62A47', boxShadow: '0 8px 24px rgba(198,42,71,0.30)' }
              : { background: 'rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.45)', cursor: 'not-allowed' }
          }
        >
          {canNext ? '완료' : '각 카테고리에서 1개씩 선택하세요'}
        </button>
      </div>
    </div>
  );
}
