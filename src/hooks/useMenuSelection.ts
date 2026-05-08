import { useFirestoreDoc } from './useFirestoreDoc';

type State = { selectedIds: string[] };

const PATH = 'state/menuSelection';
const DEFAULT: State = { selectedIds: [] };

export function useMenuSelection() {
  const { value, update } = useFirestoreDoc<State>(PATH, DEFAULT);

  const toggle = (menuId: string) => {
    void update((prev) => ({
      selectedIds: prev.selectedIds.includes(menuId)
        ? prev.selectedIds.filter((id) => id !== menuId)
        : [...prev.selectedIds, menuId],
    }));
  };

  const isSelected = (menuId: string) => value.selectedIds.includes(menuId);

  return { selectedIds: value.selectedIds, toggle, isSelected };
}
