import { useState } from 'react';
import type { Menu } from '../types';

const CATEGORIES: Menu['category'][] = ['식사', '안주', '간식'];

const CATEGORY_BADGE: Record<Menu['category'], string> = {
  식사: 'bg-orange-100 text-orange-700',
  안주: 'bg-amber-100 text-amber-700',
  간식: 'bg-emerald-100 text-emerald-700',
};

export type MenuEditPatch = Partial<Pick<Menu, 'name' | 'category' | 'notes'>>;

type Props = {
  menu: Menu;
  selected: boolean;
  onToggle: (menuId: string) => void;
  isAdmin?: boolean;
  canDelete?: boolean;
  onDelete?: () => void;
  onEdit?: (patch: MenuEditPatch) => void;
};

export default function MenuCard({
  menu,
  selected,
  onToggle,
  isAdmin,
  canDelete,
  onDelete,
  onEdit,
}: Props) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  if (editing && onEdit) {
    return (
      <EditMenuCard
        menu={menu}
        onSave={(patch) => {
          onEdit(patch);
          setEditing(false);
        }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <article
      className={`rounded-2xl border bg-card p-3 transition ${
        selected ? 'border-orange-400 shadow-sm' : 'border-line'
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start gap-3 text-left"
      >
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
            CATEGORY_BADGE[menu.category]
          }`}
        >
          {menu.category}
        </span>
        <span className="min-w-0 flex-1 text-sm font-bold text-ink">
          {menu.name}
        </span>
        <span className="shrink-0 text-ink-muted">{open ? '▾' : '▸'}</span>
      </button>

      {open && (
        <div className="mt-3 space-y-2 border-t border-line pt-3">
          {menu.notes && (
            <p className="text-xs leading-relaxed text-ink-muted">{menu.notes}</p>
          )}
          <ul className="space-y-1">
            {menu.ingredients.map((ing, i) => (
              <li key={i} className="flex items-baseline justify-between gap-3 text-xs">
                <span className="text-ink">
                  {ing.name}
                  {ing.optional && (
                    <span className="ml-1 text-[10px] text-ink-muted">(선택)</span>
                  )}
                </span>
                <span className="shrink-0 text-ink-muted tabular-nums">
                  {ing.amount}
                </span>
              </li>
            ))}
          </ul>
          {menu.ingredients.some((i) => i.note) && (
            <ul className="space-y-0.5 text-[10px] text-ink-muted">
              {menu.ingredients
                .filter((i) => i.note)
                .map((i, idx) => (
                  <li key={idx}>· {i.name}: {i.note}</li>
                ))}
            </ul>
          )}
        </div>
      )}

      <div className="mt-3 flex gap-1.5">
        <button
          type="button"
          onClick={() => onToggle(menu.id)}
          className={`flex-1 rounded-lg py-2 text-xs font-bold transition active:scale-[0.98] ${
            selected
              ? 'bg-orange-500 text-white shadow-sm'
              : 'border border-line bg-cream-50 text-ink-muted hover:border-orange-300'
          }`}
        >
          {selected ? '✓ 먹는다 (취소)' : '+ 이번에 먹기'}
        </button>
        {isAdmin && onEdit && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="shrink-0 rounded-lg border border-line px-3 py-2 text-xs text-ink-muted hover:bg-cream-100"
            aria-label="메뉴 수정"
          >
            ✏️
          </button>
        )}
        {canDelete && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`'${menu.name}' 메뉴를 지울까?`)) onDelete?.();
            }}
            className="shrink-0 rounded-lg border border-line px-3 py-2 text-xs text-red-500 hover:bg-red-50"
            aria-label="메뉴 삭제"
          >
            ✕
          </button>
        )}
      </div>
    </article>
  );
}

function EditMenuCard({
  menu,
  onSave,
  onCancel,
}: {
  menu: Menu;
  onSave: (patch: MenuEditPatch) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(menu.name);
  const [category, setCategory] = useState<Menu['category']>(menu.category);
  const [notes, setNotes] = useState(menu.notes ?? '');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      category,
      ...(notes.trim() ? { notes: notes.trim() } : { notes: '' }),
    });
  };

  return (
    <form
      onSubmit={submit}
      className="space-y-2 rounded-2xl border-2 border-orange-400 bg-orange-50/50 p-3"
    >
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={30}
        className="w-full rounded-md border border-line bg-card px-2 py-1.5 text-sm font-bold"
      />
      <div className="flex gap-1">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`flex-1 rounded-md border-2 py-1 text-xs font-bold transition ${
              category === c
                ? 'border-orange-500 bg-orange-100 text-orange-700'
                : 'border-line bg-card text-ink-muted'
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <input
        type="text"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="메모 (선택)"
        maxLength={80}
        className="w-full rounded-md border border-line bg-card px-2 py-1.5 text-xs"
      />
      <div className="flex gap-1.5">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-md border border-line bg-card py-1.5 text-xs text-ink-muted"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={!name.trim()}
          className="flex-1 rounded-md bg-orange-500 py-1.5 text-xs font-bold text-white disabled:opacity-40"
        >
          저장
        </button>
      </div>
    </form>
  );
}
