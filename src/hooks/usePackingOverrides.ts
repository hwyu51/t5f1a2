import { useFirestoreDoc } from './useFirestoreDoc';
import type { PackingItem } from '../types';

const PATH = 'state/packingOverrides';

type Override = Partial<Pick<PackingItem, 'name' | 'assigneeId'>>;
type State = { overrides: Record<string, Override> };

const DEFAULT: State = { overrides: {} };

/**
 * 시드 PACKING 항목의 부분 수정 오버라이드.
 * 이름/담당자 변경 가능. 시드 자체는 코드에 그대로 보존.
 */
export function usePackingOverrides() {
  const { value, update } = useFirestoreDoc<State>(PATH, DEFAULT);

  const setOverride = (itemId: string, patch: Override) => {
    void update((prev) => ({
      overrides: {
        ...(prev.overrides ?? {}),
        [itemId]: { ...(prev.overrides?.[itemId] ?? {}), ...patch },
      },
    }));
  };

  return { overrides: value.overrides ?? {}, setOverride };
}
