import { useEffect, useState } from 'react';
import { MEMBERS } from '../data/members';
import { TRIP } from '../data/trip';
import type { Expense } from '../types';

type Props = {
  open: boolean;
  initial?: Expense | null;
  onClose: () => void;
  onSubmit: (input: Omit<Expense, 'id' | 'createdAt'>) => void;
};

const CONFIRMED = MEMBERS.filter((m) => m.confirmed);

export default function ExpenseForm({ open, initial, onClose, onSubmit }: Props) {
  const [payerId, setPayerId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [memo, setMemo] = useState<string>('');
  const [splitMode, setSplitMode] = useState<'all' | 'subset'>('all');
  const [participantIds, setParticipantIds] = useState<string[]>([]);
  const [date, setDate] = useState<string>(TRIP.startDate);
  const [pending, setPending] = useState<boolean>(false);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setPayerId(initial.payerId);
      setAmount(initial.amount.toString());
      setMemo(initial.memo);
      setSplitMode(initial.splitMode);
      setParticipantIds(initial.participantIds ?? []);
      setDate(initial.date);
      setPending(Boolean(initial.pending));
    } else {
      setPayerId('');
      setAmount('');
      setMemo('');
      setSplitMode('all');
      setParticipantIds([]);
      setDate(TRIP.startDate);
      setPending(false);
    }
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const toggleParticipant = (id: string) => {
    setParticipantIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!Number.isFinite(numAmount) || numAmount <= 0) return;
    if (!memo.trim()) return;

    onSubmit({
      payerId,
      amount: numAmount,
      memo: memo.trim(),
      splitMode,
      participantIds: splitMode === 'subset' ? participantIds : undefined,
      date,
      pending,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-[28rem] overflow-y-auto rounded-t-3xl bg-card p-5 pb-[max(env(safe-area-inset-bottom),1.25rem)] shadow-xl sm:rounded-3xl"
      >
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-ink">
            {initial ? '지출 수정' : '지출 추가'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-ink-muted hover:bg-cream-100"
          >
            닫기
          </button>
        </header>

        <div className="space-y-3">
          <Field label="낸 사람">
            <select
              value={payerId}
              onChange={(e) => setPayerId(e.target.value)}
              className="w-full rounded-lg border border-line bg-cream-50 px-3 py-2 text-sm"
            >
              <option value="">아직 안 정함 (예정)</option>
              {CONFIRMED.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.emoji} {m.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="금액 (원)">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="numeric"
              required
              min="0"
              className="w-full rounded-lg border border-line bg-cream-50 px-3 py-2 text-sm tabular-nums"
              placeholder="40000"
            />
          </Field>

          <Field label="메모">
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              required
              maxLength={50}
              className="w-full rounded-lg border border-line bg-cream-50 px-3 py-2 text-sm"
              placeholder="예: 마트 장보기"
            />
          </Field>

          <Field label="누가 분담">
            <div className="grid grid-cols-2 gap-2">
              <label
                className={`flex cursor-pointer items-center gap-2 rounded-lg border-2 p-2.5 transition ${
                  splitMode === 'all'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-line bg-card'
                }`}
              >
                <input
                  type="radio"
                  checked={splitMode === 'all'}
                  onChange={() => setSplitMode('all')}
                  className="sr-only"
                />
                <span className="text-sm font-bold">전원 N분의1</span>
              </label>
              <label
                className={`flex cursor-pointer items-center gap-2 rounded-lg border-2 p-2.5 transition ${
                  splitMode === 'subset'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-line bg-card'
                }`}
              >
                <input
                  type="radio"
                  checked={splitMode === 'subset'}
                  onChange={() => setSplitMode('subset')}
                  className="sr-only"
                />
                <span className="text-sm font-bold">참여자만</span>
              </label>
            </div>
          </Field>

          {splitMode === 'subset' && (
            <Field label={`참여자 (${participantIds.length}명)`}>
              <ul className="grid grid-cols-4 gap-1.5">
                {CONFIRMED.map((m) => {
                  const on = participantIds.includes(m.id);
                  return (
                    <li key={m.id}>
                      <button
                        type="button"
                        onClick={() => toggleParticipant(m.id)}
                        className={`flex w-full flex-col items-center gap-0.5 rounded-lg border-2 p-1.5 transition ${
                          on
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-line bg-cream-50'
                        }`}
                      >
                        <span className="text-lg leading-none">{m.emoji}</span>
                        <span className="text-[10px] font-bold">{m.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Field>
          )}

          <Field label="날짜">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={TRIP.startDate}
              max={TRIP.endDate}
              className="w-full rounded-lg border border-line bg-cream-50 px-3 py-2 text-sm tabular-nums"
            />
          </Field>

          <label className="flex items-center gap-2 text-xs text-ink-muted">
            <input
              type="checkbox"
              checked={pending}
              onChange={(e) => setPending(e.target.checked)}
              className="h-4 w-4 accent-orange-500"
            />
            예정 지출 (정산 대상에서 제외)
          </label>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-line bg-cream-50 py-2.5 text-sm font-bold text-ink-muted"
          >
            취소
          </button>
          <button
            type="submit"
            className="flex-1 rounded-xl bg-orange-500 py-2.5 text-sm font-bold text-white shadow-sm active:scale-[0.98]"
          >
            {initial ? '수정' : '추가'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-[11px] font-bold text-ink-muted">{label}</label>
      {children}
    </div>
  );
}
