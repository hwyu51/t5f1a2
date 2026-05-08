import { useFirestoreDoc } from './useFirestoreDoc';

type State = { checks: Record<string, boolean> };

const PATH = 'state/ingredientChecks';
const DEFAULT: State = { checks: {} };

export function useIngredientChecks() {
  const { value, update } = useFirestoreDoc<State>(PATH, DEFAULT);

  const toggle = (key: string) => {
    void update((prev) => ({
      checks: { ...prev.checks, [key]: !prev.checks[key] },
    }));
  };

  const isChecked = (key: string) => Boolean(value.checks[key]);

  return { checks: value.checks, toggle, isChecked };
}
