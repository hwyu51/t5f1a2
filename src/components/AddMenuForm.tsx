import { useState } from 'react';
import type { Ingredient, Menu } from '../types';

const CATEGORIES: Menu['category'][] = ['식사', '안주', '간식'];
const INGREDIENT_CATEGORIES: Ingredient['category'][] = [
  '정육',
  '채소',
  '과일',
  '소스/양념',
  '주류',
  '음료',
  '잡화',
];

type Props = {
  open: boolean;
  onClose: () => void;
  onAdd: (input: Omit<Menu, 'id'>) => Promise<void>;
};

type DraftIngredient = {
  name: string;
  amount: string;
  category: Ingredient['category'];
};

const EMPTY_ING: DraftIngredient = { name: '', amount: '', category: '정육' };

export default function AddMenuForm({ open, onClose, onAdd }: Props) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Menu['category']>('식사');
  const [notes, setNotes] = useState('');
  const [ingredients, setIngredients] = useState<DraftIngredient[]>([{ ...EMPTY_ING }]);

  const reset = () => {
    setName('');
    setCategory('식사');
    setNotes('');
    setIngredients([{ ...EMPTY_ING }]);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const cleaned = ingredients
      .filter((i) => i.name.trim() && i.amount.trim())
      .map(
        (i): Ingredient => ({
          name: i.name.trim(),
          amount: i.amount.trim(),
          category: i.category,
        }),
      );
    await onAdd({
      name: name.trim(),
      category,
      ...(notes.trim() ? { notes: notes.trim() } : {}),
      ingredients: cleaned,
    });
    reset();
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-[28rem] overflow-y-auto rounded-t-3xl bg-card p-5 pb-[max(env(safe-area-inset-bottom),1.25rem)] shadow-xl sm:rounded-3xl"
      >
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-ink">메뉴 추가</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-ink-muted hover:bg-cream-100"
          >
            닫기
          </button>
        </header>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-[11px] font-bold text-ink-muted">
              메뉴 이름
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={30}
              placeholder="예: 닭발 볶음"
              className="w-full rounded-lg border border-line bg-cream-50 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-bold text-ink-muted">
              종류
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`rounded-lg border-2 py-1.5 text-sm font-bold transition ${
                    category === c
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-line bg-card text-ink-muted'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-bold text-ink-muted">
              메모 (선택)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={80}
              placeholder="예: 양념 매콤하게"
              className="w-full rounded-lg border border-line bg-cream-50 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-[11px] font-bold text-ink-muted">식재료</label>
              <button
                type="button"
                onClick={() =>
                  setIngredients((prev) => [...prev, { ...EMPTY_ING }])
                }
                className="text-[11px] font-bold text-orange-600"
              >
                + 줄 추가
              </button>
            </div>
            <ul className="space-y-1.5">
              {ingredients.map((ing, i) => (
                <li key={i} className="flex gap-1">
                  <input
                    type="text"
                    value={ing.name}
                    onChange={(e) =>
                      setIngredients((prev) => {
                        const next = [...prev];
                        next[i] = { ...next[i], name: e.target.value };
                        return next;
                      })
                    }
                    placeholder="재료"
                    maxLength={20}
                    className="flex-1 rounded-md border border-line bg-cream-50 px-2 py-1.5 text-sm"
                  />
                  <input
                    type="text"
                    value={ing.amount}
                    onChange={(e) =>
                      setIngredients((prev) => {
                        const next = [...prev];
                        next[i] = { ...next[i], amount: e.target.value };
                        return next;
                      })
                    }
                    placeholder="양"
                    maxLength={15}
                    className="w-20 rounded-md border border-line bg-cream-50 px-2 py-1.5 text-sm tabular-nums"
                  />
                  <select
                    value={ing.category}
                    onChange={(e) =>
                      setIngredients((prev) => {
                        const next = [...prev];
                        next[i] = {
                          ...next[i],
                          category: e.target.value as Ingredient['category'],
                        };
                        return next;
                      })
                    }
                    className="w-20 rounded-md border border-line bg-cream-50 px-1.5 py-1.5 text-[11px]"
                  >
                    {INGREDIENT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setIngredients((prev) => prev.filter((_, idx) => idx !== i))
                      }
                      className="shrink-0 rounded-md px-1.5 text-red-500 hover:bg-red-50"
                      aria-label="줄 제거"
                    >
                      ✕
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
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
            className="flex-1 rounded-xl bg-orange-500 py-2.5 text-sm font-bold text-white shadow-sm"
          >
            추가
          </button>
        </div>
      </form>
    </div>
  );
}
