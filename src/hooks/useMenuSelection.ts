import { useLocalStorage } from './useLocalStorage';

export function useMenuSelection() {
  const [selectedIds, setSelected] = useLocalStorage<string[]>(
    'menu-selection',
    [],
  );

  const toggle = (menuId: string) => {
    setSelected((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId],
    );
  };

  const isSelected = (menuId: string) => selectedIds.includes(menuId);

  return { selectedIds, toggle, isSelected };
}
