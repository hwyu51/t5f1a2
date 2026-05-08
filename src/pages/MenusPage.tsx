import { useMemo } from 'react';
import Card from '../components/Card';
import MenuCard from '../components/MenuCard';
import Section from '../components/Section';
import { MENUS } from '../data/menus';
import { ROUNDS, ROUND_LABELS, useSlots } from '../hooks/useSlots';
import type { Menu } from '../types';

const CATEGORY_ORDER: Menu['category'][] = ['식사', '안주', '간식'];

export default function MenusPage() {
  const { slots, toggle, isInSlot, slotOf } = useSlots();

  const menusByCategory = useMemo(() => {
    return CATEGORY_ORDER.map((category) => ({
      category,
      menus: MENUS.filter((m) => m.category === category),
    })).filter((g) => g.menus.length > 0);
  }, []);

  return (
    <div className="space-y-5 pb-4">
      <div className="px-4 pt-5">
        <h1 className="text-xl font-black text-ink">메뉴</h1>
        <p className="mt-1 text-sm text-ink-muted">
          1~4차에 메뉴 배정하면 장보기 리스트가 자동으로 만들어져
        </p>
      </div>

      {/* 슬롯 현황 */}
      <Section title="🍻 N차 현황">
        <div className="space-y-2">
          {ROUNDS.map((r) => {
            const slot = slotOf(r);
            const menus = slot.menuIds
              .map((id) => MENUS.find((m) => m.id === id))
              .filter((m): m is Menu => Boolean(m));
            return (
              <Card key={r} className="!p-3">
                <div className="flex items-baseline justify-between">
                  <div className="text-sm font-bold text-ink">{ROUND_LABELS[r]}</div>
                  <div className="text-[11px] font-medium text-ink-muted">
                    {menus.length}개
                  </div>
                </div>
                {menus.length > 0 ? (
                  <ul className="mt-1.5 flex flex-wrap gap-1.5">
                    {menus.map((m) => (
                      <li
                        key={m.id}
                        className="rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-medium text-orange-700"
                      >
                        {m.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="mt-1 text-[11px] italic text-ink-muted">아직 비어있음</div>
                )}
              </Card>
            );
          })}
        </div>
      </Section>

      {/* 메뉴 라이브러리 */}
      {menusByCategory.map(({ category, menus }) => (
        <Section key={category} title={`${categoryIcon(category)} ${category}`}>
          <div className="space-y-2">
            {menus.map((menu) => (
              <MenuCard
                key={menu.id}
                menu={menu}
                isInSlot={isInSlot}
                onToggle={toggle}
              />
            ))}
          </div>
        </Section>
      ))}

      {/* 안내 */}
      <Section>
        <Card className="!p-3 text-[11px] text-ink-muted">
          <span className="font-bold text-ink">팁:</span> 메뉴 카드 누르면 식재료 보임.
          아래 1~4차 버튼으로 슬롯에 추가/제거. 결정한 메뉴들은{' '}
          <span className="font-bold">장보기</span>에서 식재료가 자동 합쳐져.
          {slots.every((s) => s.menuIds.length === 0) && (
            <span className="mt-1 block">아직 메뉴 안 정해짐 — 일단 둘러봐</span>
          )}
        </Card>
      </Section>
    </div>
  );
}

function categoryIcon(c: Menu['category']): string {
  return c === '식사' ? '🍖' : c === '안주' ? '🍻' : '🍪';
}
