import { useLocalStorage } from './useLocalStorage';

type Checks = Record<string, boolean>;

export function useIngredientChecks() {
  const [checks, setChecks] = useLocalStorage<Checks>('ingredient-checks', {});

  const toggle = (key: string) => {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isChecked = (key: string) => Boolean(checks[key]);

  return { checks, toggle, isChecked };
}
