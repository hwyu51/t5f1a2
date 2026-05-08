import { useState } from 'react';
import type { Menu } from '../types';

type Props = {
  menu: Menu;
  selected: boolean;
  onToggle: (menuId: string) => void;
};

const CATEGORY_BADGE: Record<Menu['category'], string> = {
  식사: 'bg-orange-100 text-orange-700',
  안주: 'bg-amber-100 text-amber-700',
  간식: 'bg-emerald-100 text-emerald-700',
};

export default function MenuCard({ menu, selected, onToggle }: Props) {
  const [open, setOpen] = useState(false);

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

      <button
        type="button"
        onClick={() => onToggle(menu.id)}
        className={`mt-3 w-full rounded-lg py-2 text-xs font-bold transition active:scale-[0.98] ${
          selected
            ? 'bg-orange-500 text-white shadow-sm'
            : 'border border-line bg-cream-50 text-ink-muted hover:border-orange-300'
        }`}
      >
        {selected ? '✓ 먹는다 (취소)' : '+ 이번에 먹기'}
      </button>
    </article>
  );
}
