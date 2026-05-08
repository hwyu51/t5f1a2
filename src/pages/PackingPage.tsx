import { useMemo } from 'react';
import Card from '../components/Card';
import Section from '../components/Section';
import { MEMBERS } from '../data/members';
import { PACKING } from '../data/packing';
import { usePackingChecks } from '../hooks/usePackingChecks';
import type { PackingItem } from '../types';

export default function PackingPage() {
  const { isChecked, toggle } = usePackingChecks();

  const groups = useMemo(
    () => ({
      shared: PACKING.filter((p) => p.type === '공용'),
      personal: PACKING.filter((p) => p.type === '개인'),
    }),
    [],
  );

  const total = PACKING.length;
  const checkedCount = PACKING.filter((p) => isChecked(p.id)).length;
  const percent = total === 0 ? 0 : Math.round((checkedCount / total) * 100);

  return (
    <div className="space-y-4 pb-4">
      <div className="px-4 pt-5">
        <h1 className="text-xl font-black text-ink">준비물</h1>
        <p className="mt-1 text-sm text-ink-muted">
          내가 챙긴 것 체크. 본인 브라우저에만 저장돼
        </p>
      </div>

      {/* 진행률 */}
      <Section>
        <Card className="!p-3">
          <div className="mb-1.5 flex items-baseline justify-between text-xs font-medium text-ink-muted">
            <span>내 체크</span>
            <span className="tabular-nums">
              {checkedCount} / {total} · {percent}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-cream-100">
            <div
              className="h-full rounded-full bg-orange-500 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
        </Card>
      </Section>

      <Section title={`👥 공용 (${groups.shared.length})`}>
        <div className="space-y-1.5">
          {groups.shared.map((item) => (
            <PackingRow
              key={item.id}
              item={item}
              checked={isChecked(item.id)}
              onToggle={() => toggle(item.id)}
            />
          ))}
        </div>
      </Section>

      <Section title={`🎒 개인 (${groups.personal.length})`}>
        <div className="space-y-1.5">
          {groups.personal.map((item) => (
            <PackingRow
              key={item.id}
              item={item}
              checked={isChecked(item.id)}
              onToggle={() => toggle(item.id)}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}

function PackingRow({
  item,
  checked,
  onToggle,
}: {
  item: PackingItem;
  checked: boolean;
  onToggle: () => void;
}) {
  const assignee = item.assigneeId
    ? MEMBERS.find((m) => m.id === item.assigneeId)
    : undefined;

  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center gap-3 rounded-xl border border-line bg-card p-3 text-left transition active:scale-[0.99] hover:border-orange-300"
    >
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition ${
          checked
            ? 'border-orange-500 bg-orange-500 text-white'
            : 'border-line bg-card'
        }`}
      >
        {checked && <span className="text-sm leading-none">✓</span>}
      </span>
      <span
        className={`min-w-0 flex-1 text-sm ${
          checked ? 'text-ink-muted line-through' : 'text-ink'
        }`}
      >
        {item.name}
      </span>
      {assignee && (
        <span className="shrink-0 rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-700">
          {assignee.emoji} {assignee.name}
        </span>
      )}
    </button>
  );
}
