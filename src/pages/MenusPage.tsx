import { useMemo, useState } from 'react';
import AddMenuForm from '../components/AddMenuForm';
import Card from '../components/Card';
import MenuCard from '../components/MenuCard';
import Section from '../components/Section';
import { MENUS } from '../data/menus';
import { useAdminMode } from '../hooks/useAdminMode';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useCustomMenus } from '../hooks/useCustomMenus';
import { useMenuOverrides } from '../hooks/useMenuOverrides';
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
  const { isAdmin } = useAdminMode();
  const { selectedIds, isSelected, toggle } = useMenuSelection();
  const { menus: customMenus, add, remove, update } = useCustomMenus();
  const { overrides, setOverride } = useMenuOverrides();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Menu | null>(null);

  const allMenus = useMemo(() => {
    const seedMerged = MENUS.filter((m) => !overrides[m.id]?.disabled).map(
      (m) => ({ ...m, ...(overrides[m.id] ?? {}) }),
    );
    return [...seedMerged, ...customMenus];
  }, [customMenus, overrides]);

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

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (menu: Menu) => {
    setEditing(menu);
    setFormOpen(true);
  };

  const handleSubmit = async (input: Omit<Menu, 'id'>) => {
    if (editing) {
      if (isCustom(editing.id)) {
        await update(editing.id, input);
      } else {
        // 시드 메뉴: override에 부분 변경 (이름/카테고리/메모/식재료)
        setOverride(editing.id, input);
      }
      if (user) {
        void logAudit({
          actorId: user.id,
          actorName: user.name,
          action: '메뉴 수정',
          target: `${editing.name} → ${input.name}`,
        });
      }
    } else {
      await add(input);
      if (user) {
        void logAudit({
          actorId: user.id,
          actorName: user.name,
          action: '메뉴 추가',
          target: input.name,
        });
      }
    }
    setEditing(null);
  };

  const handleRemove = async (menu: Menu) => {
    if (isCustom(menu.id)) {
      await remove(menu);
    } else {
      // 시드 메뉴는 override.disabled로 숨김 (코드 데이터는 보존)
      setOverride(menu.id, { disabled: true });
    }
    if (isSelected(menu.id)) {
      void toggle(menu.id);
    }
    if (user) {
      void logAudit({
        actorId: user.id,
        actorName: user.name,
        action: '메뉴 삭제',
        target: menu.name,
      });
    }
  };

  return (
    <div className="space-y-5 pb-4">
      <div className="px-4 pt-5">
        <h1 className="text-xl font-black text-ink">메뉴</h1>
        <p className="mt-1 text-sm text-ink-muted">
          먹을 메뉴를 선택하면 장보기 리스트가 자동으로 만들어져요
        </p>
      </div>

      <Section>
        <Card className="!p-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-ink">선택한 메뉴</span>
              <span className="ml-2 text-base font-black tabular-nums text-orange-600">
                {totalSelected}개
              </span>
            </div>
            <button
              type="button"
              onClick={openAdd}
              className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm active:scale-95"
            >
              + 메뉴 추가
            </button>
          </div>
          {totalSelected === 0 && (
            <p className="mt-1.5 text-[11px] text-ink-muted">
              원하는 메뉴가 없으면 + 버튼으로 추가해 주세요.
            </p>
          )}
        </Card>
      </Section>

      {groups.map(({ category, menus }) => (
        <Section key={category} title={`${CATEGORY_ICON[category]} ${category}`}>
          <div className="space-y-2">
            {menus.map((menu) => (
              <MenuCard
                key={menu.id}
                menu={menu}
                selected={isSelected(menu.id)}
                onToggle={toggle}
                isAdmin={isAdmin}
                canDelete={isCustom(menu.id) || isAdmin}
                onDelete={() => handleRemove(menu)}
                onEdit={() => openEdit(menu)}
              />
            ))}
          </div>
        </Section>
      ))}

      <AddMenuForm
        open={formOpen}
        initial={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
