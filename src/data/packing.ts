import type { PackingItem } from '../types';

export const PACKING: PackingItem[] = [
  // === 공용 ===
  { id: 'p01', name: '훈제박스', type: '공용' },
  { id: 'p02', name: '폭죽', type: '공용' /* 멤버 임의로 구매 → 정산 */ },
  { id: 'p03', name: '돗자리', type: '공용' },
  { id: 'p04', name: '아이스박스', type: '공용' },
  { id: 'p05', name: '블루투스 스피커', type: '공용', assigneeId: 'jibin' },
  { id: 'p06', name: '카발란 위스키', type: '공용', assigneeId: 'jihwan' },
  { id: 'p08', name: '물티슈/키친타월', type: '공용' },
  { id: 'p13', name: '호일', type: '공용' },

  // === 개인 ===
  { id: 'p20', name: '야구 유니폼', type: '개인' },
  { id: 'p21', name: '버릴 옷 한 벌', type: '개인' },
  { id: 'p22', name: '비닐봉지', type: '개인' },
  { id: 'p23', name: '크록스/슬리퍼', type: '개인' /* 운동화 X */ },
  { id: 'p25', name: '큰 수건', type: '개인' },
  { id: 'p26', name: '여벌 옷', type: '개인' },
  { id: 'p27', name: '세면도구', type: '개인' },
  { id: 'p28', name: '개인 약', type: '개인' },
  { id: 'p29', name: '선크림', type: '개인' },
  { id: 'p30', name: '충전기 + 보조배터리', type: '개인' },
];
