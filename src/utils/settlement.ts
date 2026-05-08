import type { Expense, Member } from '../types';

export type Balance = {
  memberId: string;
  paid: number;
  share: number;
  net: number;
};

export type Transfer = {
  from: string;
  to: string;
  amount: number;
};

export type GroupedTransfer = {
  toId: string;
  fromList: Array<{ fromId: string; amount: number }>;
  total: number;
};

/** 멤버별 잔액 (1인 잔액 표시용) */
export function calculateBalances(expenses: Expense[], members: Member[]): Balance[] {
  const confirmed = members.filter((m) => m.confirmed);
  const balanceMap = new Map<string, Balance>();
  for (const m of members) {
    balanceMap.set(m.id, { memberId: m.id, paid: 0, share: 0, net: 0 });
  }

  for (const exp of expenses) {
    if (exp.amount <= 0) continue;
    if (!exp.payerId) continue;
    // pending도 정산 포함 (결제자 정해진 예정 지출은 미리 분담)

    const payerBal = balanceMap.get(exp.payerId);
    if (payerBal) payerBal.paid += exp.amount;

    const participants =
      exp.splitMode === 'subset'
        ? exp.participantIds ?? []
        : confirmed.map((m) => m.id);
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
 * 결제자별 송금 계산.
 * - 각 expense에서 (참여자 - 결제자)가 결제자에게 1/N씩 보냄
 * - 같은 (from, to) 쌍은 합산
 * - 양방향(A→B, B→A)이 둘 다 있으면 차액만 한 방향으로
 *
 * 송금 횟수 최소(greedy)보다 약간 많지만 사용자 직관에 부합:
 * 한 사람이 결제한 건은 분담자들이 그 결제자에게 송금.
 */
export function calculateTransfers(
  expenses: Expense[],
  members: Member[],
): Transfer[] {
  const confirmed = members.filter((m) => m.confirmed);
  const pairs = new Map<string, number>(); // `from|to` → amount

  for (const exp of expenses) {
    if (!exp.payerId || exp.amount <= 0) continue;
    // pending도 포함 — 결제자 정해진 예정 지출은 정산
    const participants =
      exp.splitMode === 'subset'
        ? exp.participantIds ?? []
        : confirmed.map((m) => m.id);
    if (participants.length === 0) continue;

    const perPerson = exp.amount / participants.length;
    for (const pid of participants) {
      if (pid === exp.payerId) continue; // 결제자 본인은 제외
      const key = `${pid}|${exp.payerId}`;
      pairs.set(key, (pairs.get(key) ?? 0) + perPerson);
    }
  }

  // 양방향 상쇄
  const transfers: Transfer[] = [];
  const seen = new Set<string>();
  for (const [key, amount] of pairs) {
    if (seen.has(key)) continue;
    const [from, to] = key.split('|');
    if (!from || !to) continue;
    const reverseKey = `${to}|${from}`;
    const reverse = pairs.get(reverseKey) ?? 0;
    seen.add(key);
    seen.add(reverseKey);

    const net = amount - reverse;
    const rounded = Math.round(Math.abs(net));
    if (rounded === 0) continue;
    if (net > 0) {
      transfers.push({ from, to, amount: rounded });
    } else {
      transfers.push({ from: to, to: from, amount: rounded });
    }
  }

  return transfers;
}

/** 같은 받는 사람끼리 묶음 */
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
