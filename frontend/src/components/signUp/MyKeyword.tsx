import { ChevronLeft } from 'lucide-react';
import SumungMascot from '../SumungMascot';

const KEYWORDS = [
  '다정한', '빠른 답장', '재미있는', '감성적인',
  '운동좋아', '게임러', '영화마니아', '카페탐방',
  '독서가', '음악덕후', '새벽감성', '맛집탐방',
  '여행러', '조용한', '활발한', '소확행', '드라마퀸',
  '로맨티스트', '현실주의자', '4차원',
];

const MAX = 3;

interface Props {
  selected: string[];
  onToggle: (k: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function MyKeyword({ selected, onToggle, onNext, onBack }: Props) {
  const canNext = selected.length === MAX;

  return (
    <div
      className="h-full w-full flex flex-col"
      style={{ background: 'linear-gradient(160deg, #C62A47 0%, #F07085 50%, #FFC4C4 100%)' }}
    >
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex-shrink-0">
        <div className="flex items-center gap-2 mb-0.5">
          <button onClick={onBack} className="p-1 -ml-1 text-white/70 active:text-white transition-colors">
            <ChevronLeft size={22} />
          </button>
          <h1 className="text-lg font-bold text-white">나의 키워드</h1>
        </div>
        <p className="text-xs pl-7" style={{ color: 'rgba(255,255,255,0.65)' }}>최대 3개 선택</p>
      </div>

      {/* Info card */}
      <div className="mx-5 mb-5 flex-shrink-0">
        <div
          className="rounded-2xl px-4 py-3 flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}
        >
          <SumungMascot className="w-10 h-12 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-white">나를 표현하는 단어는?</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.65)' }}>
              {selected.length}/3 선택됨
            </p>
          </div>
        </div>
      </div>

      {/* Keywords */}
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <div className="flex flex-wrap gap-2">
          {KEYWORDS.map((k) => {
            const active = selected.includes(k);
            return (
              <button
                key={k}
                onClick={() => {
                  if (active || selected.length < MAX) onToggle(k);
                }}
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
          {canNext ? '다음' : `${MAX - selected.length}개 더 선택하세요`}
        </button>
      </div>
    </div>
  );
}
