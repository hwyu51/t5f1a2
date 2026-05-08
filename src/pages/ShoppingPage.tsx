import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Section from '../components/Section';
import { MENUS } from '../data/menus';
import { useIngredientChecks } from '../hooks/useIngredientChecks';
import { useSlots } from '../hooks/useSlots';
import { aggregateIngredients, flatItems } from '../utils/aggregateIngredients';
import type { Ingredient } from '../types';

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
  const { slots } = useSlots();
  const { isChecked, toggle } = useIngredientChecks();
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const groups = useMemo(() => aggregateIngredients(slots, MENUS), [slots]);
  const allItems = useMemo(() => flatItems(groups), [groups]);
  const checkedCount = allItems.filter((i) => isChecked(i.key)).length;
  const total = allItems.length;
  const empty = total === 0;

  return (
    <div className="space-y-4 pb-4">
      <div className="px-4 pt-5">
        <h1 className="text-xl font-black text-ink">장보기</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {empty ? '메뉴 먼저 정해야 리스트가 나와' : `${checkedCount} / ${total} 담음`}
        </p>
      </div>

      {empty ? (
        <Section>
          <Card className="space-y-3 text-center">
            <div className="text-4xl leading-none">🛒</div>
            <div className="text-sm text-ink-muted">
              <span className="font-bold text-ink">메뉴</span>에서 1~4차에 음식 배정하면
              여기 식재료가 자동으로 모임
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
                  return (
                    <Card key={item.key} className="!p-0 overflow-hidden">
                      <div className="flex items-center gap-3 p-3">
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
                              checked ? 'text-ink-muted line-through' : 'text-ink'
                            }`}
                          >
                            {item.name}
                          </span>
                          <span className="shrink-0 text-[11px] tabular-nums text-ink-muted">
                            {item.sources.length}곳에 쓰임 ›
                          </span>
                        </button>
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
