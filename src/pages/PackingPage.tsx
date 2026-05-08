import { useMemo, useState } from 'react';
import Card from '../components/Card';
import Section from '../components/Section';
import { PACKING } from '../data/packing';
import { useAdminMode } from '../hooks/useAdminMode';
import { useCustomPackingItems } from '../hooks/useCustomPackingItems';
import { useMembers } from '../hooks/useMembers';
import { usePackingChecks } from '../hooks/usePackingChecks';
import type { Member, PackingItem } from '../types';

export default function PackingPage() {
  const { members } = useMembers();
  const { isChecked, toggle } = usePackingChecks();
  const { items: customItems, add, remove } = useCustomPackingItems();
  const { isAdmin } = useAdminMode();

  const all = useMemo(() => [...PACKING, ...customItems], [customItems]);

  const groups = useMemo(
    () => ({
      shared: all.filter((p) => p.type === '공용'),
      personal: all.filter((p) => p.type === '개인'),
    }),
    [all],
  );

  const isCustom = (id: string) => customItems.some((c) => c.id === id);

  const total = all.length;
  const checkedCount = all.filter((p) => isChecked(p.id)).length;
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
              members={members}
              canDelete={isAdmin && isCustom(item.id)}
              onDelete={() => remove(item)}
            />
          ))}
        </div>
        {isAdmin && (
          <AddItemForm type="공용" members={members} onAdd={add} />
        )}
      </Section>

      <Section title={`🎒 개인 (${groups.personal.length})`}>
        <div className="space-y-1.5">
          {groups.personal.map((item) => (
            <PackingRow
              key={item.id}
              item={item}
              checked={isChecked(item.id)}
              onToggle={() => toggle(item.id)}
              members={members}
              canDelete={isAdmin && isCustom(item.id)}
              onDelete={() => remove(item)}
            />
          ))}
        </div>
        {isAdmin && (
          <AddItemForm type="개인" members={members} onAdd={add} />
        )}
      </Section>
    </div>
  );
}

function PackingRow({
  item,
  checked,
  onToggle,
  members,
  canDelete,
  onDelete,
}: {
  item: PackingItem;
  checked: boolean;
  onToggle: () => void;
  members: Member[];
  canDelete?: boolean;
  onDelete?: () => void;
}) {
  const assignee = item.assigneeId
    ? members.find((m) => m.id === item.assigneeId)
    : undefined;

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={onToggle}
        className="flex flex-1 items-center gap-3 rounded-xl border border-line bg-card p-3 text-left transition active:scale-[0.99] hover:border-orange-300"
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
      {canDelete && (
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`'${item.name}' 지울까?`)) onDelete?.();
          }}
          className="shrink-0 rounded-md px-2 py-2 text-xs text-red-500 hover:bg-red-50"
          aria-label="삭제"
        >
          ✕
        </button>
      )}
    </div>
  );
}

function AddItemForm({
  type,
  members,
  onAdd,
}: {
  type: PackingItem['type'];
  members: Member[];
  onAdd: (item: Omit<PackingItem, 'id'>) => Promise<void>;
}) {
  const [name, setName] = useState('');
  const [assigneeId, setAssigneeId] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await onAdd({
      name: name.trim(),
      type,
      ...(assigneeId ? { assigneeId } : {}),
    });
    setName('');
    setAssigneeId('');
  };

  return (
    <form
      onSubmit={submit}
      className="mt-2 flex items-center gap-1.5 rounded-xl border border-dashed border-orange-300 bg-orange-50/40 p-2"
    >
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={`+ ${type} 항목 추가`}
        maxLength={30}
        className="flex-1 rounded-md border border-line bg-card px-2 py-1.5 text-sm"
      />
      {type === '공용' && (
        <select
          value={assigneeId}
          onChange={(e) => setAssigneeId(e.target.value)}
          className="rounded-md border border-line bg-card px-1.5 py-1.5 text-xs"
        >
          <option value="">담당 X</option>
          {members
            .filter((m) => m.confirmed)
            .map((m) => (
              <option key={m.id} value={m.id}>
                {m.emoji} {m.name}
              </option>
            ))}
        </select>
      )}
      <button
        type="submit"
        disabled={!name.trim()}
        className="shrink-0 rounded-md bg-orange-500 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-40"
      >
        추가
      </button>
    </form>
  );
}
