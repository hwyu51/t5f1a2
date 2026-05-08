import type { Expense } from '../types';

/**
 * 시드 지출. 첫 진입 시 Firestore에 자동 등록 (한 번만, 'state/seedExpensesInit' 플래그).
 * 사용자가 삭제하면 다시 등장 X.
 * 고정 ID로 setDoc해서 멤버 동시 진입에도 멱등.
 */
export const SEED_EXPENSES: Expense[] = [
  {
    id: 'seed-lodging',
    payerId: 'hyewon',
    amount: 400000,
    memo: '대천 해녀펜션 2층 독채 (1박)',
    splitMode: 'all',
    date: '2026-07-25',
    createdAt: 1700000000000,
  },
  {
    id: 'seed-grill',
    payerId: '',
    amount: 40000,
    memo: '펜션 그릴+숯 대여 (4인 2만원 × 2 = 4만원, 현장 결제 예정)',
    splitMode: 'all',
    date: '2026-07-25',
    createdAt: 1700000001000,
    pending: true,
  },
];
