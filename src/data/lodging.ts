export const LODGING = {
  name: '대천 해녀펜션 2층 독채',
  bookingUrl: 'https://www.bookinghub.co.kr/seawoman',
  cost: 400000,
  paid: true,
  payerId: 'hyewon', // 혜원 결제
  address: '충남 보령시 머드로 176-21 (신흑동)',
  lat: 36.3193027,
  lng: 126.5091286,
  phone: '010-2371-4287',
  bizName: '해녀민박 (사장 김만종)',
  checkIn: '15:00',
  checkOut: '11:00',
  notes: [
    '전 객실 금연 — 흡연은 사장님께 문의',
    '바베큐존 실내, 에어컨 있음',
    '주차 2대 OK. 더 필요하면 20초 거리 무료 공영주차장',
    '⚠️ 그릴+숯 대여 4인 2만원 (8명이면 4만원, 현장 결제)',
    '카드 결제 가능',
  ],
} as const;
