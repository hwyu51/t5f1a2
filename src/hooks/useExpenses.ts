import { useLocalStorage } from './useLocalStorage';
import type { Expense } from '../types';
import { INITIAL_EXPENSES } from '../data/initialExpenses';

const DEFAULT: Expense[] = INITIAL_EXPENSES.map((e, i) => ({
  ...e,
  id: `seed-${i}`,
  createdAt: 0,
}));

export function useExpenses() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', DEFAULT);

  const add = (input: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...input,
      id: `e-${Date.now()}`,
      createdAt: Date.now(),
    };
    setExpenses((prev) => [...prev, newExpense]);
  };

  const update = (id: string, patch: Partial<Expense>) => {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  };

  const remove = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  return { expenses, add, update, remove };
}
