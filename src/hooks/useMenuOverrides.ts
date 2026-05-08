import { useFirestoreDoc } from './useFirestoreDoc';
import type { Menu } from '../types';

const PATH = 'state/menuOverrides';

export type MenuOverride = Partial<Pick<Menu, 'name' | 'category' | 'notes'>>;
type State = { overrides: Record<string, MenuOverride> };

const DEFAULT: State = { overrides: {} };

/**
 * 시드 MENUS의 부분 수정 오버라이드 (이름/카테고리/메모).
 * 식재료 자체 수정은 시드 신뢰 + 별도 항목으로 추가하는 흐름이라 미포함.
 */
export function useMenuOverrides() {
  const { value, update } = useFirestoreDoc<State>(PATH, DEFAULT);

  const setOverride = (menuId: string, patch: MenuOverride) => {
    void update((prev) => ({
      overrides: {
        ...(prev.overrides ?? {}),
        [menuId]: { ...(prev.overrides?.[menuId] ?? {}), ...patch },
      },
    }));
  };

  return { overrides: value.overrides ?? {}, setOverride };
}
