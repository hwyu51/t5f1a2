import { useMemo, useState } from 'react';
import Card from '../components/Card';
import ExpenseForm from '../components/ExpenseForm';
import Section from '../components/Section';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useExpenses } from '../hooks/useExpenses';
import { useMembers } from '../hooks/useMembers';
import { logAudit } from '../utils/audit';
import { calculateBalances, calculateTransfers } from '../utils/settlement';
import type { Expense } from '../types';

export default function BudgetPage() {
  const { user } = useCurrentUser();
  const { members } = useMembers();
  const { expenses, add, update, remove } = useExpenses();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);

  const totals = useMemo(() => {
    const settled = expenses.filter((e) => !e.pending);
    const total = settled.reduce((s, e) => s + e.amount, 0);
    const pendingTotal = expenses
      .filter((e) => e.pending)
      .reduce((s, e) => s + e.amount, 0);
    return { total, pendingTotal };
  }, [expenses]);

  const balances = useMemo(
    () => calculateBalances(expenses, members),
    [expenses],
  );
  const transfers = useMemo(() => calculateTransfers(balances), [balances]);

  const memberById = (id: string) => members.find((m) => m.id === id);

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

  return (
    <div className="space-y-4 pb-4">
      <div className="px-4 pt-5">
        <h1 className="text-xl font-black text-ink">정산</h1>
        <p className="mt-1 text-sm text-ink-muted">
          지출 등록 → 자동으로 정산표 만들어
        </p>
      </div>

      {/* 요약 */}
      <Section>
        <Card className="!p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-ink-muted">총 지출 (정산 대상)</span>
            <span className="text-2xl font-black tabular-nums text-orange-600">
              {totals.total.toLocaleString()}원
            </span>
          </div>
          {totals.pendingTotal > 0 && (
            <div className="mt-1 flex items-baseline justify-between text-xs text-ink-muted">
              <span>예정 지출 (제외)</span>
              <span className="tabular-nums">
                {totals.pendingTotal.toLocaleString()}원
              </span>
            </div>
          )}
        </Card>
      </Section>

      {/* 정산표 */}
      {transfers.length > 0 && (
        <Section title="💸 정산">
          <div className="space-y-1.5">
            {transfers.map((t, i) => {
              const from = memberById(t.from);
              const to = memberById(t.to);
              return (
                <Card key={i} className="!p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-ink">
                      {from?.emoji} {from?.name}
                    </span>
                    <span className="text-ink-muted">→</span>
                    <span className="text-sm font-bold text-ink">
                      {to?.emoji} {to?.name}
                    </span>
                    <span className="ml-auto text-base font-black tabular-nums text-orange-600">
                      {t.amount.toLocaleString()}원
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        </Section>
      )}

      {/* 멤버별 잔액 */}
      {balances.length > 0 && (
        <Section title="📊 1인 잔액">
          <Card className="!p-3">
            <ul className="space-y-1.5">
              {balances.map((b) => {
                const m = memberById(b.memberId);
                if (!m) return null;
                const isCreditor = b.net > 0;
                const isDebtor = b.net < 0;
                return (
                  <li
                    key={b.memberId}
                    className="flex items-baseline justify-between text-sm"
                  >
                    <span>
                      {m.emoji} <span className="font-bold">{m.name}</span>
                      <span className="ml-2 text-[11px] text-ink-muted tabular-nums">
                        냄 {Math.round(b.paid).toLocaleString()} · 몫{' '}
                        {Math.round(b.share).toLocaleString()}
                      </span>
                    </span>
                    <span
                      className={`font-bold tabular-nums ${
                        isCreditor
                          ? 'text-green-600'
                          : isDebtor
                            ? 'text-red-500'
                            : 'text-ink-muted'
                      }`}
                    >
                      {isCreditor ? '+' : ''}
                      {b.net.toLocaleString()}
                    </span>
                  </li>
                );
              })}
            </ul>
          </Card>
        </Section>
      )}

      {/* 지출 목록 */}
      <Section title={`📝 지출 내역 (${expenses.length})`}>
        <div className="space-y-1.5">
          {expenses.length === 0 ? (
            <Card className="text-center text-sm text-ink-muted">
              아직 등록된 지출 없음
            </Card>
          ) : (
            expenses.map((e) => {
              const payer = e.payerId ? memberById(e.payerId) : null;
              return (
                <Card key={e.id} className="!p-3">
                  <button
                    type="button"
                    onClick={() => openEdit(e)}
                    className="flex w-full items-start gap-3 text-left"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span className="truncate text-sm font-bold text-ink">
                          {e.memo}
                        </span>
                        {e.pending && (
                          <span className="shrink-0 rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-700">
                            예정
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-ink-muted">
                        {payer ? `${payer.emoji} ${payer.name}` : '낸 사람 미정'}
                        {' · '}
                        {e.splitMode === 'all'
                          ? '전원 분담'
                          : `${e.participantIds?.length ?? 0}명 분담`}
                        {' · '}
                        {e.date.slice(5)}
                      </span>
                    </span>
                    <span className="shrink-0 text-base font-black tabular-nums text-ink">
                      {e.amount.toLocaleString()}원
                    </span>
                  </button>
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

      {/* 플로팅 + 버튼 */}
      <button
        type="button"
        onClick={openAdd}
        className="fixed bottom-24 left-1/2 z-30 -translate-x-1/2 rounded-full bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg active:scale-95"
        style={{ marginLeft: '6rem' }}
      >
        + 지출 추가
      </button>

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
