import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import Card from '../components/Card';
import ExpenseForm from '../components/ExpenseForm';
import Section from '../components/Section';
import Spinner from '../components/Spinner';
import { SEED_EXPENSES } from '../data/initialExpenses';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useExpenses } from '../hooks/useExpenses';
import { useMembers } from '../hooks/useMembers';
import { db } from '../lib/firebase';
import { logAudit } from '../utils/audit';
import {
  calculateBalances,
  calculateTransfers,
  groupTransfersByTo,
} from '../utils/settlement';
import type { Expense, Member } from '../types';

type Tab = 'mine' | 'all';

export default function BudgetPage() {
  const { user } = useCurrentUser();
  const { members } = useMembers();
  const { expenses, ready, add, update, remove } = useExpenses();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [tab, setTab] = useState<Tab>('mine');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // 첫 진입 시 시드 지출 한 번만 등록 (멱등 플래그)
  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    (async () => {
      const flagRef = doc(db, 'state', 'seedExpensesInit');
      const flagSnap = await getDoc(flagRef);
      if (cancelled || flagSnap.exists()) return;
      for (const seed of SEED_EXPENSES) {
        const { id, ...rest } = seed;
        await setDoc(doc(db, 'expenses', id), rest);
      }
      await setDoc(flagRef, { initializedAt: Date.now() });
    })();
    return () => {
      cancelled = true;
    };
  }, [ready]);

  // 총 지출에 예정 포함, 그 중 예정 별도 안내
  const totals = useMemo(() => {
    const total = expenses.reduce((s, e) => s + e.amount, 0);
    const pendingTotal = expenses
      .filter((e) => e.pending)
      .reduce((s, e) => s + e.amount, 0);
    return { total, pendingTotal };
  }, [expenses]);

  const balances = useMemo(
    () => calculateBalances(expenses, members),
    [expenses, members],
  );
  const transfers = useMemo(
    () => calculateTransfers(expenses, members),
    [expenses, members],
  );
  const grouped = useMemo(() => groupTransfersByTo(transfers), [transfers]);

  const myTransfers = useMemo(() => {
    if (!user) return { send: [], receive: [] };
    return {
      send: transfers.filter((t) => t.from === user.id),
      receive: transfers.filter((t) => t.to === user.id),
    };
  }, [transfers, user]);

  const memberById = (id: string): Member | undefined =>
    members.find((m) => m.id === id);

  const handleSubmit = async (input: Omit<Expense, 'id' | 'createdAt'>) => {
    if (editing) {
      await update(editing.id, input);
      if (user) {
        void logAudit({
          actorId: user.id,
          actorName: user.name,
          action: '지출 수정',
          target: `${input.memo} (${input.amount.toLocaleString()}원)`,
        });
      }
    } else {
      await add(input);
      if (user) {
        void logAudit({
          actorId: user.id,
          actorName: user.name,
          action: '지출 추가',
          target: `${input.memo} (${input.amount.toLocaleString()}원)`,
        });
      }
    }
    setEditing(null);
  };

  const handleRemove = async (e: Expense) => {
    await remove(e.id);
    if (user) {
      void logAudit({
        actorId: user.id,
        actorName: user.name,
        action: '지출 삭제',
        target: `${e.memo} (${e.amount.toLocaleString()}원)`,
      });
    }
  };

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (exp: Expense) => {
    setEditing(exp);
    setFormOpen(true);
  };

  const myBalance = user ? balances.find((b) => b.memberId === user.id) : null;

  return (
    <div className="space-y-4 pb-4">
      <div className="px-4 pt-5">
        <h1 className="text-xl font-black text-ink">정산</h1>
        <p className="mt-1 text-sm text-ink-muted">
          지출을 등록하면 정산표가 자동으로 만들어져요
        </p>
      </div>

      {/* 요약 */}
      <Section>
        <Card className="!p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-ink-muted">총 지출</span>
            <span className="text-2xl font-black tabular-nums text-orange-600">
              {totals.total.toLocaleString()}원
            </span>
          </div>
          {totals.pendingTotal > 0 && (
            <div className="mt-1 flex items-baseline justify-between text-xs text-ink-muted">
              <span>이 중 예정</span>
              <span className="tabular-nums">
                {totals.pendingTotal.toLocaleString()}원
              </span>
            </div>
          )}
          {myBalance && (
            <div className="mt-3 flex items-baseline justify-between border-t border-line pt-3 text-sm">
              <span className="text-ink-muted">
                내 잔액 ({user?.name})
                <span className="ml-1.5 text-[11px] text-ink-muted">
                  결제 {Math.round(myBalance.paid).toLocaleString()} · 분담{' '}
                  {Math.round(myBalance.share).toLocaleString()}
                </span>
              </span>
              <span
                className={`font-bold tabular-nums ${
                  myBalance.net > 0
                    ? 'text-green-600'
                    : myBalance.net < 0
                      ? 'text-red-500'
                      : 'text-ink-muted'
                }`}
              >
                {myBalance.net > 0 ? '+' : ''}
                {myBalance.net.toLocaleString()}원
              </span>
            </div>
          )}
        </Card>
      </Section>

      {/* 정산표 — 탭 */}
      {transfers.length > 0 && (
        <Section title="💸 정산">
          <div className="mb-2 grid grid-cols-2 gap-1 rounded-lg bg-cream-100 p-0.5">
            <button
              type="button"
              onClick={() => setTab('mine')}
              className={`rounded-md py-1.5 text-xs font-bold transition ${
                tab === 'mine'
                  ? 'bg-card text-orange-600 shadow-sm'
                  : 'text-ink-muted'
              }`}
            >
              내 정산
            </button>
            <button
              type="button"
              onClick={() => setTab('all')}
              className={`rounded-md py-1.5 text-xs font-bold transition ${
                tab === 'all'
                  ? 'bg-card text-orange-600 shadow-sm'
                  : 'text-ink-muted'
              }`}
            >
              전체
            </button>
          </div>

          {tab === 'mine' ? (
            <MyTransfers
              myTransfers={myTransfers}
              userMember={user ? memberById(user.id) : undefined}
              memberById={memberById}
            />
          ) : (
            <AllTransfers grouped={grouped} memberById={memberById} />
          )}
        </Section>
      )}

      {/* 지출 목록 */}
      <Section title={`📝 지출 내역 (${expenses.length})`}>
        <div className="space-y-1.5">
          {!ready ? (
            <Card className="!p-0">
              <Spinner label="지출 불러오는 중..." />
            </Card>
          ) : expenses.length === 0 ? (
            <Card className="text-center text-sm text-ink-muted">
              아직 등록된 지출 없음
            </Card>
          ) : (
            expenses.map((e) => {
              const payer = e.payerId ? memberById(e.payerId) : null;
              const isExpanded = expandedIds.has(e.id);
              const participants = e.participantIds
                ?.map(memberById)
                .filter((m): m is Member => Boolean(m));
              const splitCount =
                e.splitMode === 'all'
                  ? members.filter((m) => m.confirmed).length
                  : e.participantIds?.length ?? 0;
              const perPerson = splitCount > 0 ? Math.round(e.amount / splitCount) : 0;
              return (
                <Card key={e.id} className="!p-3">
                  <button
                    type="button"
                    onClick={() => toggleExpanded(e.id)}
                    className="flex w-full items-start gap-3 text-left"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span
                          className={`text-sm font-bold text-ink ${
                            isExpanded ? '' : 'truncate'
                          }`}
                        >
                          {e.memo}
                        </span>
                        {e.pending && (
                          <span className="shrink-0 rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-700">
                            예정
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-ink-muted">
                        {payer ? `${payer.emoji} ${payer.name}` : '결제자 미정'}
                        {' · '}
                        {e.splitMode === 'all'
                          ? `전원 분담 (${splitCount}명)`
                          : `${e.participantIds?.length ?? 0}명 분담`}
                        {' · '}
                        {e.date.slice(5)}
                      </span>
                    </span>
                    <span className="shrink-0 text-base font-black tabular-nums text-ink">
                      {e.amount.toLocaleString()}원
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="mt-2 space-y-1.5 border-t border-line pt-2 text-[11px] text-ink-muted">
                      <div className="flex items-baseline justify-between">
                        <span>1인당</span>
                        <span className="tabular-nums">
                          {perPerson.toLocaleString()}원
                        </span>
                      </div>
                      {e.splitMode === 'subset' && participants && (
                        <div>
                          <span>참여자 ({participants.length}): </span>
                          <span className="text-ink">
                            {participants
                              .map((m) => `${m.emoji} ${m.name}`)
                              .join(', ')}
                          </span>
                        </div>
                      )}
                      {e.note && (
                        <div className="rounded-md bg-cream-100 px-2 py-1.5">
                          <div className="text-[10px] font-bold text-ink-muted">
                            메모
                          </div>
                          <p className="mt-0.5 whitespace-pre-line text-xs text-ink">
                            {e.note}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-2 flex justify-end gap-2 border-t border-line pt-2">
                    <button
                      type="button"
                      onClick={() => openEdit(e)}
                      className="rounded-md px-2 py-1 text-[11px] text-ink-muted hover:bg-cream-100"
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`'${e.memo}' 지출을 지울까?`)) {
                          void handleRemove(e);
                        }
                      }}
                      className="rounded-md px-2 py-1 text-[11px] text-red-500 hover:bg-red-50"
                    >
                      삭제
                    </button>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </Section>

      {/* 지출 추가 — 인라인 (겹침 방지) */}
      <Section>
        <button
          type="button"
          onClick={openAdd}
          className="w-full rounded-2xl bg-orange-500 py-3 text-sm font-bold text-white shadow-md active:scale-[0.98]"
        >
          + 지출 추가
        </button>
      </Section>

      <ExpenseForm
        open={formOpen}
        initial={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

function MyTransfers({
  myTransfers,
  userMember,
  memberById,
}: {
  myTransfers: { send: { from: string; to: string; amount: number }[]; receive: { from: string; to: string; amount: number }[] };
  userMember?: Member;
  memberById: (id: string) => Member | undefined;
}) {
  if (!userMember) {
    return (
      <p className="rounded-xl border border-dashed border-line bg-cream-50/60 px-3 py-4 text-center text-xs text-ink-muted">
        본인을 먼저 선택해 주세요
      </p>
    );
  }

  if (myTransfers.send.length === 0 && myTransfers.receive.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-line bg-cream-50/60 px-3 py-4 text-center text-xs text-ink-muted">
        보내거나 받을 금액이 없어요 ✨
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {myTransfers.send.length > 0 && (
        <div className="space-y-1">
          <div className="px-1 text-[11px] font-bold text-red-500">
            🔻 보낼 금액 ({myTransfers.send.length})
          </div>
          {myTransfers.send.map((t, i) => {
            const to = memberById(t.to);
            return (
              <Card key={`s-${i}`} className="!p-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {to?.emoji} <span className="font-bold">{to?.name}</span>에게
                  </span>
                  <span className="ml-auto text-base font-black tabular-nums text-red-500">
                    -{t.amount.toLocaleString()}원
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {myTransfers.receive.length > 0 && (
        <div className="space-y-1">
          <div className="px-1 text-[11px] font-bold text-green-600">
            🔺 받을 금액 ({myTransfers.receive.length})
          </div>
          {myTransfers.receive.map((t, i) => {
            const from = memberById(t.from);
            return (
              <Card key={`r-${i}`} className="!p-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {from?.emoji} <span className="font-bold">{from?.name}</span>에게서
                  </span>
                  <span className="ml-auto text-base font-black tabular-nums text-green-600">
                    +{t.amount.toLocaleString()}원
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AllTransfers({
  grouped,
  memberById,
}: {
  grouped: ReturnType<typeof groupTransfersByTo>;
  memberById: (id: string) => Member | undefined;
}) {
  return (
    <div className="space-y-1.5">
      {grouped.map((g) => {
        const to = memberById(g.toId);
        return (
          <Card key={g.toId} className="!p-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm">
                <span className="font-bold text-ink">
                  {to?.emoji} {to?.name}
                </span>
                <span className="ml-1 text-[11px] text-ink-muted">
                  {g.fromList.length}명에게서
                </span>
              </span>
              <span className="text-base font-black tabular-nums text-orange-600">
                {g.total.toLocaleString()}원
              </span>
            </div>
            <ul className="mt-2 space-y-0.5 border-t border-line pt-2 text-[11px] text-ink-muted">
              {g.fromList.map((f, i) => {
                const from = memberById(f.fromId);
                return (
                  <li key={i} className="flex items-baseline justify-between">
                    <span>
                      {from?.emoji} {from?.name}
                    </span>
                    <span className="tabular-nums">
                      {f.amount.toLocaleString()}원
                    </span>
                  </li>
                );
              })}
            </ul>
          </Card>
        );
      })}
    </div>
  );
}
