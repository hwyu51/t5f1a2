import { useMemo } from 'react';
import Card from '../components/Card';
import MenuCard from '../components/MenuCard';
import Section from '../components/Section';
import { MENUS } from '../data/menus';
import { useMenuSelection } from '../hooks/useMenuSelection';
import type { Menu } from '../types';

const CATEGORY_ORDER: Menu['category'][] = ['식사', '안주', '간식'];

const CATEGORY_ICON: Record<Menu['category'], string> = {
  식사: '🍖',
  안주: '🍻',
  간식: '🍪',
};

export default function MenusPage() {
  const { selectedIds, isSelected, toggle } = useMenuSelection();

  const groups = useMemo(
    () =>
      CATEGORY_ORDER.map((category) => ({
        category,
        menus: MENUS.filter((m) => m.category === category),
      })).filter((g) => g.menus.length > 0),
    [],
  );

  const totalSelected = selectedIds.length;

  return (
    <div className="space-y-5 pb-4">
      <div className="px-4 pt-5">
        <h1 className="text-xl font-black text-ink">메뉴</h1>
        <p className="mt-1 text-sm text-ink-muted">
          이번에 먹을 메뉴 골라. 장보기 리스트가 자동으로 만들어져
        </p>
      </div>

      {/* 현황 — 단순 한 줄 */}
      <Section>
        <Card className="!p-3">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-bold text-ink">먹는다 정한 메뉴</span>
            <span className="text-base font-black tabular-nums text-orange-600">
              {totalSelected}개
            </span>
          </div>
          {totalSelected === 0 && (
            <p className="mt-1 text-[11px] text-ink-muted">
              메뉴 카드 누르면 식재료 보임. 아래 버튼으로 정함.
            </p>
          )}
        </Card>
      </Section>

      {/* 메뉴 라이브러리 */}
      {groups.map(({ category, menus }) => (
        <Section key={category} title={`${CATEGORY_ICON[category]} ${category}`}>
          <div className="space-y-2">
            {menus.map((menu) => (
              <MenuCard
                key={menu.id}
                menu={menu}
                selected={isSelected(menu.id)}
                onToggle={toggle}
              />
            ))}
          </div>
        </Section>
      ))}
    </div>
  );
}
