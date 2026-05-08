import type { MenuSlot } from '../types';
import { useLocalStorage } from './useLocalStorage';

export const ROUNDS = [1, 2, 3, 4] as const;
export type Round = (typeof ROUNDS)[number];

export const ROUND_LABELS: Record<Round, string> = {
  1: '1차 (저녁 바베큐)',
  2: '2차 (노상)',
  3: '3차 (밤)',
  4: '4차',
};

const DEFAULT: MenuSlot[] = ROUNDS.map((round) => ({ round, menuIds: [] }));

export function useSlots() {
  const [slots, setSlots] = useLocalStorage<MenuSlot[]>('menu-slots', DEFAULT);

  const toggle = (round: Round, menuId: string) => {
    setSlots((prev) =>
      prev.map((s) =>
        s.round === round
          ? {
              ...s,
              menuIds: s.menuIds.includes(menuId)
                ? s.menuIds.filter((id) => id !== menuId)
                : [...s.menuIds, menuId],
            }
          : s,
      ),
    );
  };

  const isInSlot = (round: Round, menuId: string) =>
    slots.find((s) => s.round === round)?.menuIds.includes(menuId) ?? false;

  const slotOf = (round: Round) =>
    slots.find((s) => s.round === round) ?? { round, menuIds: [] };

  return { slots, toggle, isInSlot, slotOf };
}
