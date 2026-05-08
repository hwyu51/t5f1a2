import type { Expense } from '../types';
import { useFirestoreCollection } from './useFirestoreCollection';

type ExpenseDoc = Omit<Expense, 'id'>;

export function useExpenses() {
  const { docs, add, update, remove } = useFirestoreCollection<ExpenseDoc>(
    'expenses',
    { orderField: 'createdAt', orderDir: 'asc' },
  );

  const expenses: Expense[] = docs;

  const addExpense = (input: Omit<Expense, 'id' | 'createdAt'>) => {
    return add({ ...input, createdAt: Date.now() });
  };

  const updateExpense = (id: string, patch: Partial<Expense>) => {
    return update(id, patch as Partial<ExpenseDoc>);
  };

  const removeExpense = (id: string) => remove(id);

  return {
    expenses,
    add: addExpense,
    update: updateExpense,
    remove: removeExpense,
  };
}
