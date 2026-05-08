import type { PackingItem } from '../types';

export const PACKING: PackingItem[] = [
  // === 공용 ===
  { id: 'p01', name: '훈제박스 (사야 됨)', type: '공용' },
  { id: 'p02', name: '폭죽', type: '공용' /* 멤버 임의로 구매 → 정산 */ },
  { id: 'p03', name: '돗자리 (노상용)', type: '공용' },
  { id: 'p04', name: '아이스박스', type: '공용' },
  { id: 'p05', name: '블루투스 스피커 (지빈)', type: '공용', assigneeId: 'jibin' },
  { id: 'p06', name: '카바나 위스키 (지환)', type: '공용', assigneeId: 'jihwan' },
  { id: 'p07', name: '쓰레기봉투', type: '공용' },
  { id: 'p08', name: '물티슈/키친타월', type: '공용' },
  { id: 'p09', name: '종이컵/종이접시', type: '공용' },
  { id: 'p10', name: '나무젓가락', type: '공용' },
  { id: 'p11', name: '숯/번개탄 (펜션 그릴 따로 쓸 때)', type: '공용' },
  { id: 'p12', name: '토치/라이터', type: '공용' },
  { id: 'p13', name: '호일 (꽃게 호일구이용)', type: '공용' },
  { id: 'p14', name: '휴지심 (카바나용)', type: '공용' },

  // === 개인 ===
  {
    id: 'p20',
    name: '야구 유니폼 (노상 드레스코드)',
    type: '개인',
    /* 혜원 4장, 지환 6장 보유 → 빌려달라기 */
  },
  { id: 'p21', name: '버릴 옷 한 벌 (머드축제용)', type: '개인' },
  { id: 'p22', name: '비닐봉지 (버릴 옷 담을 거)', type: '개인' },
  { id: 'p23', name: '크록스/슬리퍼 (머드축제용)', type: '개인' /* 운동화 X */ },
  { id: 'p25', name: '큰 수건 (머드 후 닦기)', type: '개인' },
  { id: 'p26', name: '여벌 옷 (머드 후 갈아입을)', type: '개인' },
  { id: 'p27', name: '세면도구', type: '개인' },
  { id: 'p28', name: '개인 약', type: '개인' },
  { id: 'p29', name: '선크림', type: '개인' },
  { id: 'p30', name: '충전기 + 보조배터리', type: '개인' },
];
