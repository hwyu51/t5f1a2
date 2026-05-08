import { useState } from 'react';
import type { Menu } from '../types';
import { ROUNDS, type Round } from '../hooks/useSlots';

type Props = {
  menu: Menu;
  isInSlot: (round: Round, menuId: string) => boolean;
  onToggle: (round: Round, menuId: string) => void;
};

const CATEGORY_BADGE: Record<Menu['category'], string> = {
  식사: 'bg-orange-100 text-orange-700',
  안주: 'bg-amber-100 text-amber-700',
  간식: 'bg-emerald-100 text-emerald-700',
};

export default function MenuCard({ menu, isInSlot, onToggle }: Props) {
  const [open, setOpen] = useState(false);
  const inAnySlot = ROUNDS.some((r) => isInSlot(r, menu.id));

  return (
    <article
      className={`rounded-2xl border bg-card p-3 transition ${
        inAnySlot ? 'border-orange-300 shadow-sm' : 'border-line'
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
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold text-ink">{menu.name}</span>
          {menu.servings && (
            <span className="mt-0.5 block text-[11px] text-ink-muted">
              {menu.servings}인분
            </span>
          )}
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
        {ROUNDS.map((r) => {
          const on = isInSlot(r, menu.id);
          return (
            <button
              key={r}
              type="button"
              onClick={() => onToggle(r, menu.id)}
              className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition active:scale-95 ${
                on
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'border border-line bg-cream-50 text-ink-muted hover:border-orange-300'
              }`}
            >
              {r}차
            </button>
          );
        })}
      </div>
    </article>
  );
}
