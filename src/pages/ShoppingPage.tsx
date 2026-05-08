import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Section from '../components/Section';
import { MENUS } from '../data/menus';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useCustomMenus } from '../hooks/useCustomMenus';
import {
  useCustomShoppingItems,
  type CustomShoppingItem,
} from '../hooks/useCustomShoppingItems';
import { useIngredientChecks } from '../hooks/useIngredientChecks';
import { useMenuSelection } from '../hooks/useMenuSelection';
import {
  aggregateIngredients,
  type AggregatedGroup,
  type AggregatedIngredient,
} from '../utils/aggregateIngredients';
import { logAudit } from '../utils/audit';
import type { Ingredient } from '../types';

const CATEGORY_ORDER: Ingredient['category'][] = [
  '정육',
  '채소',
  '과일',
  '소스/양념',
  '주류',
  '음료',
  '잡화',
];

const CATEGORY_ICON: Record<Ingredient['category'], string> = {
  정육: '🥩',
  채소: '🥬',
  과일: '🍎',
  '소스/양념': '🧂',
  주류: '🍺',
  음료: '🥤',
  잡화: '🧴',
};

export default function ShoppingPage() {
  const { user } = useCurrentUser();
  const { selectedIds } = useMenuSelection();
  const { menus: customMenus } = useCustomMenus();
  const {
    items: customShopping,
    add: addCustomShopping,
    remove: removeCustomShopping,
  } = useCustomShoppingItems();
  const { isChecked, toggle } = useIngredientChecks();
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  // 메뉴 식재료 + 직접 추가 항목 합쳐 카테고리별 정렬
  const groups = useMemo<AggregatedGroup[]>(() => {
    const allMenus = [...MENUS, ...customMenus];
    const fromMenus = aggregateIngredients(selectedIds, allMenus);

    if (customShopping.length === 0) return fromMenus;

    // 직접 추가 항목을 AggregatedIngredient 형태로 변환 후 합치기
    const map = new Map<Ingredient['category'], AggregatedIngredient[]>();
    for (const g of fromMenus) {
      map.set(g.category, [...g.items]);
    }

    for (const c of customShopping) {
      const ing: AggregatedIngredient = {
        key: `custom:${c.id}`,
        name: c.name,
        category: c.category,
        sources: [{ menuName: '직접 추가', amount: c.amount }],
      };
      const arr = map.get(c.category) ?? [];
      arr.push(ing);
      map.set(c.category, arr);
    }

    for (const arr of map.values()) {
      arr.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
    }

    return CATEGORY_ORDER.flatMap((category) => {
      const items = map.get(category);
      return items && items.length > 0 ? [{ category, items }] : [];
    });
  }, [selectedIds, customMenus, customShopping]);

  const allItems = groups.flatMap((g) => g.items);
  const checkedCount = allItems.filter((i) => isChecked(i.key)).length;
  const total = allItems.length;
  const empty = total === 0;
  const customById = new Map(customShopping.map((c) => [`custom:${c.id}`, c]));

  const handleAdd = async (input: Omit<CustomShoppingItem, 'id'>) => {
    await addCustomShopping(input);
    if (user) {
      void logAudit({
        actorId: user.id,
        actorName: user.name,
        action: '장보기 추가',
        target: input.name,
      });
    }
  };

  const handleRemove = async (item: CustomShoppingItem) => {
    await removeCustomShopping(item);
    if (user) {
      void logAudit({
        actorId: user.id,
        actorName: user.name,
        action: '장보기 삭제',
        target: item.name,
      });
    }
  };

  return (
    <div className="space-y-4 pb-4">
      <div className="px-4 pt-5">
        <h1 className="text-xl font-black text-ink">장보기</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {empty
            ? '메뉴 정하거나 직접 추가하면 리스트가 만들어져'
            : `${checkedCount} / ${total} 담음`}
        </p>
      </div>

      {/* 직접 추가 폼 */}
      <Section>
        <AddForm onAdd={handleAdd} />
      </Section>

      {empty ? (
        <Section>
          <Card className="space-y-3 text-center">
            <div className="text-4xl leading-none">🛒</div>
            <div className="text-sm text-ink-muted">
              <span className="font-bold text-ink">메뉴</span>에서 먹을 거 정하거나 위
              폼으로 직접 추가
            </div>
            <Link
              to="/menus"
              className="mx-auto inline-block rounded-xl bg-orange-500 px-5 py-2 text-sm font-bold text-white shadow-sm active:scale-95"
            >
              메뉴 정하러 가기
            </Link>
          </Card>
        </Section>
      ) : (
        <>
          {/* 진행률 바 */}
          <Section>
            <Card className="!p-3">
              <div className="mb-1.5 flex items-baseline justify-between text-xs font-medium text-ink-muted">
                <span>진행률</span>
                <span className="tabular-nums">
                  {Math.round((checkedCount / total) * 100)}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-cream-100">
                <div
                  className="h-full rounded-full bg-orange-500 transition-all"
                  style={{ width: `${(checkedCount / total) * 100}%` }}
                />
              </div>
            </Card>
          </Section>

          {groups.map(({ category, items }) => (
            <Section
              key={category}
              title={`${CATEGORY_ICON[category]} ${category} (${items.length})`}
            >
              <div className="space-y-1.5">
                {items.map((item) => {
                  const checked = isChecked(item.key);
                  const isExpanded = expandedKey === item.key;
                  const customItem = customById.get(item.key);
                  return (
                    <Card key={item.key} className="!p-0 overflow-hidden">
                      <div className="flex items-center gap-2 p-3">
                        <button
                          type="button"
                          onClick={() => toggle(item.key)}
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition ${
                            checked
                              ? 'border-orange-500 bg-orange-500 text-white'
                              : 'border-line bg-card'
                          }`}
                          aria-label={checked ? '체크 해제' : '체크'}
                        >
                          {checked && <span className="text-sm">✓</span>}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedKey(isExpanded ? null : item.key)
                          }
                          className="flex min-w-0 flex-1 items-baseline justify-between gap-2 text-left"
                        >
                          <span
                            className={`text-sm font-medium ${
                              checked
                                ? 'text-ink-muted line-through'
                                : 'text-ink'
                            }`}
                          >
                            {item.name}
                          </span>
                          <span className="shrink-0 text-[11px] tabular-nums text-ink-muted">
                            {item.sources.length}곳에 쓰임 ›
                          </span>
                        </button>
                        {customItem && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`'${customItem.name}' 지울까?`)) {
                                void handleRemove(customItem);
                              }
                            }}
                            className="shrink-0 rounded-md px-1.5 text-xs text-red-500 hover:bg-red-50"
                            aria-label="삭제"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      {isExpanded && (
                        <ul className="space-y-0.5 border-t border-line bg-cream-50/60 px-3 py-2 text-[11px]">
                          {item.sources.map((src, i) => (
                            <li
                              key={i}
                              className="flex items-baseline justify-between gap-2"
                            >
                              <span className="min-w-0 truncate text-ink-muted">
                                · {src.menuName}
                                {src.optional && ' (선택)'}
                              </span>
                              <span className="shrink-0 font-medium tabular-nums text-ink">
                                {src.amount}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </Card>
                  );
                })}
              </div>
            </Section>
          ))}
        </>
      )}
    </div>
  );
}

function AddForm({
  onAdd,
}: {
  onAdd: (input: Omit<CustomShoppingItem, 'id'>) => Promise<void>;
}) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Ingredient['category']>('잡화');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await onAdd({
      name: name.trim(),
      amount: amount.trim() || '1',
      category,
    });
    setName('');
    setAmount('');
  };

  return (
    <form
      onSubmit={submit}
      className="flex flex-wrap items-center gap-1.5 rounded-xl border border-dashed border-orange-300 bg-orange-50/40 p-2"
    >
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="+ 직접 추가"
        maxLength={20}
        className="min-w-0 flex-1 rounded-md border border-line bg-card px-2 py-1.5 text-sm"
      />
      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="양"
        maxLength={10}
        className="w-16 rounded-md border border-line bg-card px-2 py-1.5 text-sm tabular-nums"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as Ingredient['category'])}
        className="rounded-md border border-line bg-card px-1.5 py-1.5 text-xs"
      >
        {CATEGORY_ORDER.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
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
