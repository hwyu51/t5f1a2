import type { Menu } from '../types';

export const MENUS: Menu[] = [
  // === 바베큐 4종 (식사, 8인분) ===
  {
    id: 'bbq-pork',
    name: '삼겹살/목살 바베큐',
    category: '식사',
    servings: 8,
    notes: '1인당 200~250g. 굵은소금 + 쌈장 필수. 펜션 실내 그릴 사용',
    ingredients: [
      { name: '삼겹살',     amount: '2kg',    category: '정육' },
      { name: '목살',       amount: '1kg',    category: '정육' },
      { name: '상추',       amount: '충분히', category: '채소' },
      { name: '깻잎',       amount: '2단',    category: '채소' },
      { name: '마늘',       amount: '1망',    category: '채소' },
      { name: '쌈장',       amount: '1통',    category: '소스/양념' },
      { name: '굵은소금',   amount: '1봉',    category: '소스/양념' },
      { name: '참기름',     amount: '1병',    category: '소스/양념' },
    ],
  },
  {
    id: 'smoked-pork',
    name: '훈제 통삼겹 (훈제박스)',
    category: '식사',
    servings: 8,
    notes: '훈제박스 1시간 돌려놓고 머드 갔다 오면 딱 익어 있음',
    ingredients: [
      { name: '통삼겹',     amount: '2kg',    category: '정육' },
      { name: '훈제박스',   amount: '1개',    category: '잡화', note: '⚠️ 일회용 사야 됨' },
      { name: '훈제칩',     amount: '1봉',    category: '잡화', optional: true },
    ],
  },
  {
    id: 'oven-belly',
    name: '통오겹 오븐구이 (지빈 담당)',
    category: '식사',
    servings: 8,
    notes: '지빈 시그니처. 펜션 오븐 쓸 수 있는지 확인 필요',
    ingredients: [
      { name: '통오겹',     amount: '2kg',    category: '정육' },
      { name: '허브솔트',   amount: '1통',    category: '소스/양념' },
      { name: '로즈마리',   amount: '1팩',    category: '채소' },
    ],
  },
  {
    id: 'bbq-crab',
    name: '꽃게 호일구이 (혜원이 하고 싶은)',
    category: '식사',
    servings: 8,
    notes: '호일에 싸서 그릴에 올리기. 마요네즈 곁들이기',
    ingredients: [
      { name: '꽃게',       amount: '8마리',  category: '정육' },
      { name: '호일',       amount: '1롤',    category: '잡화' },
      { name: '마요네즈',   amount: '1통',    category: '소스/양념' },
      { name: '버터',       amount: '1통',    category: '소스/양념' },
    ],
  },

  // === 안주 (4인분 정도) ===
  {
    id: 'dakbokkeumtang',
    name: '닭볶음탕',
    category: '안주',
    servings: 4,
    notes: '안주로도 굿',
    ingredients: [
      { name: '닭(볶음탕용)', amount: '1마리',  category: '정육' },
      { name: '감자',         amount: '3개',    category: '채소' },
      { name: '당근',         amount: '1개',    category: '채소' },
      { name: '양파',         amount: '2개',    category: '채소' },
      { name: '간장',         amount: '1병',    category: '소스/양념' },
      { name: '고추장',       amount: '1통',    category: '소스/양념' },
      { name: '고춧가루',     amount: '1봉',    category: '소스/양념' },
    ],
  },
  {
    id: 'oden',
    name: '오뎅탕',
    category: '안주',
    servings: 4,
    notes: '국물 시원. 술안주로 굿',
    ingredients: [
      { name: '모듬어묵',   amount: '1봉',    category: '정육' },
      { name: '무',         amount: '1/2개',  category: '채소' },
      { name: '대파',       amount: '2대',    category: '채소' },
      { name: '다시팩',     amount: '1봉',    category: '소스/양념' },
    ],
  },
  {
    id: 'izakaya-skewer',
    name: '이자카야 꼬치 (혜원 사전 준비)',
    category: '안주',
    servings: 4,
    notes: '미리 냉동으로 만들어 가져옴. 종류 다양',
    ingredients: [{ name: '꼬치 (혜원이 직접)', amount: '1세트', category: '정육' }],
  },
  {
    id: 'kimbap',
    name: '잠보덤보 김밥 (지연+병도 담당)',
    category: '안주',
    servings: 4,
    ingredients: [
      { name: '김밥김',     amount: '1봉',    category: '잡화' },
      { name: '밥',         amount: '3인분',  category: '잡화' },
      { name: '단무지',     amount: '1봉',    category: '채소' },
      { name: '햄',         amount: '1팩',    category: '정육' },
      { name: '계란',       amount: '5개',    category: '잡화' },
      { name: '시금치',     amount: '1/2단',  category: '채소' },
      { name: '참기름',     amount: '1병',    category: '소스/양념' },
    ],
  },
];
