import { useLocalStorage } from './useLocalStorage';

export function usePackingChecks() {
  const [checks, setChecks] = useLocalStorage<Record<string, boolean>>(
    'packing-checks',
    {},
  );

  const toggle = (itemId: string) => {
    setChecks((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const isChecked = (itemId: string) => Boolean(checks[itemId]);

  return { checks, toggle, isChecked };
}
