import type { Expense } from '../types';

export const INITIAL_EXPENSES: Omit<Expense, 'id' | 'createdAt'>[] = [
  {
    payerId: 'hyewon',
    amount: 400000,
    memo: '대천 해녀펜션 2층 독채 (1박)',
    type: '공통',
    date: '2026-07-25',
    receipts: [],
  },
  {
    payerId: '', // 현장 결제할 사람 (장부 도착 후 등록)
    amount: 40000,
    memo: '펜션 그릴+숯 대여 (4인 기준 20,000원 × 2 = 40,000원, 현장 결제 예정)',
    type: '공통',
    date: '2026-07-25',
    receipts: [],
    pending: true, // 사이트에서 "예정 지출"로 표시
  },
  // 진행하며 추가:
  // - 장보기 (혜원 카드로 통합 결제) → 공통
  // - 훈제박스 구매 → 공통
  // - 폭죽 구매 → 공통
  // - 차량1 기름값 + 톨비 → 차량1
  // - 차량2 기름값 + 톨비 → 차량2
  // - 머드축제 입장권 (사전 주말 14,000원) → 공통
  // - 스카이바이크 (4인 30,000원 × 2대 = 60,000원) → 공통
  // - 게국지 식당비 → 공통
];
