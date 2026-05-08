import { useFirestoreDoc } from './useFirestoreDoc';

type State = { choices: Record<string, string> };

const PATH = 'state/scheduleChoices';
const DEFAULT: State = { choices: {} };

export function useScheduleChoices() {
  const { value, update } = useFirestoreDoc<State>(PATH, DEFAULT);

  const choose = (scheduleId: string, placeId: string) => {
    void update((prev) => ({
      choices: { ...prev.choices, [scheduleId]: placeId },
    }));
  };

  const clearChoice = (scheduleId: string) => {
    void update((prev) => {
      const next = { ...prev.choices };
      delete next[scheduleId];
      return { choices: next };
    });
  };

  return { choices: value.choices, choose, clearChoice };
}
