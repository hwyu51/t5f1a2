import type { Expense, Member } from '../types';

export type Balance = {
  memberId: string;
  paid: number; // 낸 금액 합
  share: number; // 분담해야 할 금액 합
  net: number; // paid - share. 양수=받을 돈, 음수=낼 돈
};

export type Transfer = {
  from: string; // 보낼 사람 ID
  to: string; // 받을 사람 ID
  amount: number;
};

export type GroupedTransfer = {
  toId: string;
  fromList: Array<{ fromId: string; amount: number }>;
  total: number;
};

/**
 * 같은 받는 사람끼리 묶음. 카드 N개 → 받는 사람 M개로 압축.
 */
export function groupTransfersByTo(transfers: Transfer[]): GroupedTransfer[] {
  const map = new Map<string, GroupedTransfer>();
  for (const t of transfers) {
    const g = map.get(t.to) ?? { toId: t.to, fromList: [], total: 0 };
    g.fromList.push({ fromId: t.from, amount: t.amount });
    g.total += t.amount;
    map.set(t.to, g);
  }
  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}

/**
 * 멤버별 잔액 계산.
 * - pending=true 지출은 제외
 * - splitMode='all'이면 전체 멤버 N분의1 (단, 미확정 멤버 제외 옵션은 false: 시드는 confirmed만 자동)
 * - splitMode='subset'이면 participantIds만
 */
export function calculateBalances(expenses: Expense[], members: Member[]): Balance[] {
  const confirmed = members.filter((m) => m.confirmed);
  const balanceMap = new Map<string, Balance>();
  for (const m of members) {
    balanceMap.set(m.id, { memberId: m.id, paid: 0, share: 0, net: 0 });
  }

  for (const exp of expenses) {
    if (exp.pending) continue;
    if (exp.amount <= 0) continue;

    // 지급자
    if (exp.payerId) {
      const payerBal = balanceMap.get(exp.payerId);
      if (payerBal) payerBal.paid += exp.amount;
    }

    // 분담 대상
    let participants: string[];
    if (exp.splitMode === 'subset') {
      participants = exp.participantIds ?? [];
    } else {
      participants = confirmed.map((m) => m.id);
    }
    if (participants.length === 0) continue;

    const perPerson = exp.amount / participants.length;
    for (const pid of participants) {
      const bal = balanceMap.get(pid);
      if (bal) bal.share += perPerson;
    }
  }

  for (const b of balanceMap.values()) {
    b.net = Math.round(b.paid - b.share);
  }

  return Array.from(balanceMap.values()).filter(
    (b) => b.paid > 0 || b.share > 0,
  );
}

/**
 * 잔액 → 최소 송금 횟수로 정산하는 transfer 목록.
 * Greedy: 최댓값(받을 사람) ↔ 최솟값(낼 사람) 매칭.
 */
export function calculateTransfers(balances: Balance[]): Transfer[] {
  const debtors = balances
    .filter((b) => b.net < 0)
    .map((b) => ({ id: b.memberId, amount: -b.net }))
    .sort((a, b) => b.amount - a.amount);
  const creditors = balances
    .filter((b) => b.net > 0)
    .map((b) => ({ id: b.memberId, amount: b.net }))
    .sort((a, b) => b.amount - a.amount);

  const transfers: Transfer[] = [];
  let i = 0;
  let j = 0;
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = Math.min(debtor.amount, creditor.amount);
    if (amount > 0) {
      transfers.push({ from: debtor.id, to: creditor.id, amount });
    }
    debtor.amount -= amount;
    creditor.amount -= amount;
    if (debtor.amount === 0) i++;
    if (creditor.amount === 0) j++;
  }

  return transfers;
}
