import { useMemo, useState } from 'react';
import AddMenuForm from '../components/AddMenuForm';
import Card from '../components/Card';
import MenuCard from '../components/MenuCard';
import Section from '../components/Section';
import { MENUS } from '../data/menus';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useCustomMenus } from '../hooks/useCustomMenus';
import { useMenuSelection } from '../hooks/useMenuSelection';
import { logAudit } from '../utils/audit';
import type { Menu } from '../types';

const CATEGORY_ORDER: Menu['category'][] = ['식사', '안주', '간식'];

const CATEGORY_ICON: Record<Menu['category'], string> = {
  식사: '🍖',
  안주: '🍻',
  간식: '🍪',
};

export default function MenusPage() {
  const { user } = useCurrentUser();
  const { selectedIds, isSelected, toggle } = useMenuSelection();
  const { menus: customMenus, add, remove } = useCustomMenus();
  const [formOpen, setFormOpen] = useState(false);

  const handleAdd = async (input: Omit<Menu, 'id'>) => {
    await add(input);
    if (user) {
      void logAudit({
        actorId: user.id,
        actorName: user.name,
        action: '메뉴 추가',
        target: input.name,
      });
    }
  };

  const handleRemove = async (menu: Menu) => {
    await remove(menu);
    if (user) {
      void logAudit({
        actorId: user.id,
        actorName: user.name,
        action: '메뉴 삭제',
        target: menu.name,
      });
    }
  };

  const allMenus = useMemo(() => [...MENUS, ...customMenus], [customMenus]);

  const groups = useMemo(
    () =>
      CATEGORY_ORDER.map((category) => ({
        category,
        menus: allMenus.filter((m) => m.category === category),
      })).filter((g) => g.menus.length > 0),
    [allMenus],
  );

  const isCustom = (id: string) => customMenus.some((c) => c.id === id);
  const totalSelected = selectedIds.length;

  return (
    <div className="space-y-5 pb-4">
      <div className="px-4 pt-5">
        <h1 className="text-xl font-black text-ink">메뉴</h1>
        <p className="mt-1 text-sm text-ink-muted">
          이번에 먹을 메뉴 골라. 장보기 리스트가 자동으로 만들어져
        </p>
      </div>

      {/* 현황 + 추가 */}
      <Section>
        <Card className="!p-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-ink">먹는다 정한 메뉴</span>
              <span className="ml-2 text-base font-black tabular-nums text-orange-600">
                {totalSelected}개
              </span>
            </div>
            <button
              type="button"
              onClick={() => setFormOpen(true)}
              className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm active:scale-95"
            >
              + 메뉴 추가
            </button>
          </div>
          {totalSelected === 0 && (
            <p className="mt-1.5 text-[11px] text-ink-muted">
              먹고 싶은 메뉴 없으면 위 + 버튼으로 추가해.
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
                canDelete={isCustom(menu.id)}
                onDelete={() => handleRemove(menu)}
              />
            ))}
          </div>
        </Section>
      ))}

      <AddMenuForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onAdd={handleAdd}
      />
    </div>
  );
}
