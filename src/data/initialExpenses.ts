import type { Expense } from '../types';

// 참고용 시드. Firestore 'expenses' 컬렉션이 비어있으면 사용자가 직접 등록.
// 자동 입력은 안 함 (멤버 동시 접속 시 중복 위험).
export const INITIAL_EXPENSES: Omit<Expense, 'id' | 'createdAt'>[] = [
  {
    payerId: 'hyewon',
    amount: 400000,
    memo: '대천 해녀펜션 2층 독채 (1박)',
    splitMode: 'all',
    date: '2026-07-25',
  },
  {
    payerId: '', // 현장 결제할 사람 (도착 후 등록)
    amount: 40000,
    memo: '펜션 그릴+숯 대여 (4인 2만원 × 2 = 4만원, 현장 결제 예정)',
    splitMode: 'all',
    date: '2026-07-25',
    pending: true,
  },
  // 진행하면서 추가:
  // - 렌트카 (전원) — splitMode 'all'
  // - 기름값/톨비 — splitMode 'all'
  // - 장보기 — splitMode 'all'
  // - 훈제박스/폭죽 — splitMode 'all'
  // - 머드축제 입장권 — splitMode 'subset' (참여자만)
  // - 스카이바이크 — splitMode 'subset' (탈 사람만)
  // - 게국지 식당 — splitMode 'subset' (먹은 사람만 / 또는 'all')
];
