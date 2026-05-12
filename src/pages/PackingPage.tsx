import { useMemo, useState } from 'react';
import Card from '../components/Card';
import Section from '../components/Section';
import { PACKING } from '../data/packing';
import { useAdminMode } from '../hooks/useAdminMode';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useCustomPackingItems } from '../hooks/useCustomPackingItems';
import { useCustomPersonalPackingItems } from '../hooks/useCustomPersonalPackingItems';
import { useMembers } from '../hooks/useMembers';
import { usePackingChecks } from '../hooks/usePackingChecks';
import { usePackingChecksShared } from '../hooks/usePackingChecksShared';
import { usePackingOverrides } from '../hooks/usePackingOverrides';
import { logAudit } from '../utils/audit';
import type { Member, PackingItem } from '../types';

type EditPatch = Partial<Pick<PackingItem, 'name' | 'assigneeId'>>;

export default function PackingPage() {
  const { user } = useCurrentUser();
  const { members } = useMembers();
  // 공용 항목: 모두 공유되는 체크 (Firestore)
  // 개인 항목: 본인별 체크 (LocalStorage)
  const sharedChecks = usePackingChecksShared();
  const personalChecks = usePackingChecks();

  const isChecked = (id: string, isPersonalItem: boolean) =>
    isPersonalItem ? personalChecks.isChecked(id) : sharedChecks.isChecked(id);
  const toggleCheck = (id: string, isPersonalItem: boolean) => {
    if (isPersonalItem) personalChecks.toggle(id);
    else void sharedChecks.toggle(id);
  };
  const {
    items: customSharedItems,
    add: addCustomShared,
    remove: removeCustomShared,
    update: updateCustomShared,
  } = useCustomPackingItems(); // 공용 — Firestore, 모두 공유
  const {
    items: customPersonalItems,
    add: addCustomPersonal,
    remove: removeCustomPersonal,
    update: updateCustomPersonal,
  } = useCustomPersonalPackingItems(); // 개인 — 본인 LocalStorage
  const { overrides, setOverride } = usePackingOverrides();
  const { isAdmin } = useAdminMode();

  // 시드 + override 병합 + 사용자 공용 + 사용자 개인
  const all = useMemo(() => {
    const seedMerged = PACKING.map((p) => ({ ...p, ...(overrides[p.id] ?? {}) }));
    return [...seedMerged, ...customSharedItems, ...customPersonalItems];
  }, [customSharedItems, customPersonalItems, overrides]);

  const groups = useMemo(
    () => ({
      shared: all.filter((p) => p.type === '공용'),
      personal: all.filter((p) => p.type === '개인'),
    }),
    [all],
  );

  const isCustomShared = (id: string) =>
    customSharedItems.some((c) => c.id === id);
  const isCustomPersonal = (id: string) =>
    customPersonalItems.some((c) => c.id === id);
  const isCustom = (id: string) => isCustomShared(id) || isCustomPersonal(id);

  const total = all.length;
  const checkedCount = all.filter((p) =>
    isChecked(p.id, p.type === '개인'),
  ).length;
  const percent = total === 0 ? 0 : Math.round((checkedCount / total) * 100);

  const handleAdd = async (input: Omit<PackingItem, 'id'>) => {
    if (input.type === '공용') {
      await addCustomShared(input);
      if (user) {
        void logAudit({
          actorId: user.id,
          actorName: user.name,
          action: '준비물 추가 (공용)',
          target: input.name,
        });
      }
    } else {
      // 개인 — 본인 LocalStorage. audit 안 함 (개인이라)
      addCustomPersonal(input);
    }
  };

  const handleRemove = async (item: PackingItem) => {
    if (isCustomShared(item.id)) {
      await removeCustomShared(item);
      if (user) {
        void logAudit({
          actorId: user.id,
          actorName: user.name,
          action: '준비물 삭제 (공용)',
          target: item.name,
        });
      }
    } else if (isCustomPersonal(item.id)) {
      removeCustomPersonal(item);
    }
  };

  const handleEdit = async (item: PackingItem, patch: EditPatch) => {
    if (isCustomShared(item.id)) {
      await updateCustomShared(item.id, patch);
    } else if (isCustomPersonal(item.id)) {
      updateCustomPersonal(item.id, { name: patch.name });
    } else {
      // 시드 항목: override (모두 공유)
      setOverride(item.id, patch);
    }
    if (user) {
      const fields = Object.keys(patch).join('/');
      void logAudit({
        actorId: user.id,
        actorName: user.name,
        action: '준비물 수정',
        target: `${item.name} (${fields})`,
      });
    }
  };

  return (
    <div className="space-y-4 pb-4">
      <div className="px-4 pt-5">
        <h1 className="text-xl font-black text-ink">준비물</h1>
        <p className="mt-1 text-sm text-ink-muted">
          공용은 모두 공유돼요. 개인 항목 체크와 본인 추가는 본인만 보입니다.
        </p>
      </div>

      <Section>
        <Card className="!p-3">
          <div className="mb-1.5 flex items-baseline justify-between text-xs font-medium text-ink-muted">
            <span>체크 현황</span>
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
              checked={isChecked(item.id, false)}
              onToggle={() => toggleCheck(item.id, false)}
              members={members}
              isAdmin={isAdmin}
              canDelete={isAdmin && isCustom(item.id)}
              onDelete={() => handleRemove(item)}
              onEdit={(patch) => handleEdit(item, patch)}
            />
          ))}
        </div>
        <AddItemForm type="공용" members={members} onAdd={handleAdd} />
      </Section>

      <Section title={`🎒 개인 (${groups.personal.length})`}>
        <div className="space-y-1.5">
          {groups.personal.map((item) => (
            <PackingRow
              key={item.id}
              item={item}
              checked={isChecked(item.id, true)}
              onToggle={() => toggleCheck(item.id, true)}
              members={members}
              isAdmin={isAdmin}
              // 개인 항목은 본인이 추가한 것만 본인이 삭제 가능
              canDelete={isCustomPersonal(item.id)}
              onDelete={() => handleRemove(item)}
              onEdit={(patch) => handleEdit(item, patch)}
            />
          ))}
        </div>
        <AddItemForm type="개인" members={members} onAdd={handleAdd} />
      </Section>
    </div>
  );
}

function PackingRow({
  item,
  checked,
  onToggle,
  members,
  isAdmin,
  canDelete,
  onDelete,
  onEdit,
}: {
  item: PackingItem;
  checked: boolean;
  onToggle: () => void;
  members: Member[];
  isAdmin: boolean;
  canDelete?: boolean;
  onDelete?: () => void;
  onEdit: (patch: EditPatch) => void;
}) {
  const [editing, setEditing] = useState(false);
  const assignee = item.assigneeId
    ? members.find((m) => m.id === item.assigneeId)
    : undefined;

  if (editing) {
    return (
      <EditRow
        item={item}
        members={members}
        onSave={(patch) => {
          onEdit(patch);
          setEditing(false);
        }}
        onCancel={() => setEditing(false)}
      />
    );
  }

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
      {isAdmin && (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="shrink-0 rounded-md px-2 py-2 text-xs text-ink-muted hover:bg-cream-100"
          aria-label="수정"
        >
          ✏️
        </button>
      )}
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

function EditRow({
  item,
  members,
  onSave,
  onCancel,
}: {
  item: PackingItem;
  members: Member[];
  onSave: (patch: EditPatch) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(item.name);
  const [assigneeId, setAssigneeId] = useState(item.assigneeId ?? '');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const patch: EditPatch = { name: name.trim() };
    if (item.type === '공용') {
      patch.assigneeId = assigneeId || undefined;
    }
    onSave(patch);
  };

  return (
    <form
      onSubmit={submit}
      className="space-y-1.5 rounded-xl border-2 border-orange-400 bg-orange-50/50 p-2"
    >
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={30}
        className="w-full rounded-md border border-line bg-card px-2 py-1.5 text-sm"
      />
      <div className="flex gap-1.5">
        {item.type === '공용' && (
          <select
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            className="min-w-0 flex-1 rounded-md border border-line bg-card px-1.5 py-1.5 text-xs"
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
          type="button"
          onClick={onCancel}
          className="shrink-0 rounded-md border border-line bg-card px-3 py-1.5 text-xs text-ink-muted"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={!name.trim()}
          className="shrink-0 rounded-md bg-orange-500 px-4 py-1.5 text-xs font-bold text-white disabled:opacity-40"
        >
          저장
        </button>
      </div>
    </form>
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
      className="mt-2 space-y-1.5 rounded-xl border border-dashed border-orange-300 bg-orange-50/40 p-2"
    >
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={`${type} 항목 추가`}
        maxLength={30}
        className="w-full rounded-md border border-line bg-card px-2 py-1.5 text-sm"
      />
      <div className="flex gap-1.5">
        {type === '공용' && (
          <select
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            className="min-w-0 flex-1 rounded-md border border-line bg-card px-1.5 py-1.5 text-xs"
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
          className="shrink-0 rounded-md bg-orange-500 px-4 py-1.5 text-xs font-bold text-white disabled:opacity-40"
        >
          추가
        </button>
      </div>
    </form>
  );
}
