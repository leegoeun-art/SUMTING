export const PERSONALITY_KEYWORDS = [
  '외향적인', '내향적인', '다정한', '시크한', '유머러스한',
  '어른스러운', '귀여운', '열정적인', '차분한', '엉뚱한',
  '꼼꼼한', '털털한', '솔직한', '신중한', '긍정적인'
];

export const MASCOTS = [
  { id: 'basic', name: '기본 숨뭉이', color: '#FFF' },
  { id: 'shy', name: '수줍 숨뭉이', color: '#FFE4E1' },
  { id: 'cool', name: '멋쟁이 숨뭉이', color: '#E0FFFF' },
  { id: 'heart', name: '사랑 숨뭉이', color: '#FFF0F5' }
];

export const DEPARTMENTS = [
  // 인문사회과학대학
  '인문콘텐츠학부', '공간환경학부', '행정학부', '가족복지학과', '국가안보학과',
  // 사범대학
  '국어교육과', '영어교육과', '교육학과', '수학교육과',
  // 경영경제대학
  '경제금융학부', '경영학부', '글로벌경영학과', '융합경영학과',
  // 융합공과대학
  '지능·데이터융합학부', 'SW융합학부', '생명화학공학부',
  // 문화예술대학
  '의류학과', '스포츠무용학부', '미술학부', '음악학부',
  // 자유전공학부대학
  '자유전공(인문계열)', '자유전공(이공계열)', '자유전공(예체능계열)',
];

/** 학과 → 수뭉이 이미지 키 매핑 */
export const DEPARTMENT_MASCOT: Record<string, string> = {
  // 인문사회과학대학
  '인문콘텐츠학부': 'ribbongirl',
  '공간환경학부':   'ribbongirl',
  '행정학부':       'ribbongirl',
  '가족복지학과':   'ribbongirl',
  '국가안보학과':   'ribbongirl',
  // 사범대학
  '국어교육과': 'ribbonboy',
  '영어교육과': 'ribbonboy',
  '교육학과':   'ribbonboy',
  '수학교육과': 'ribbonboy',
  // 경영경제대학
  '경제금융학부':   'business',
  '경영학부':       'business',
  '글로벌경영학과': 'business',
  '융합경영학과':   'business',
  // 융합공과대학
  '지능·데이터융합학부': 'computer',
  'SW융합학부':          'computer',
  '생명화학공학부':      'computer',
  // 문화예술대학
  '의류학과':     'art',
  '미술학부':     'art',
  '스포츠무용학부': 'sport',
  '음악학부':     'music',
  // 자유전공학부대학
  '자유전공(인문계열)':   'basic',
  '자유전공(이공계열)':   'basic',
  '자유전공(예체능계열)': 'basic',
};

export const FESTIVAL_END_TIME = '2026-05-22T23:59:59';
