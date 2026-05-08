import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'schedule-choices';

type Choices = Record<string, string>; // scheduleItemId -> placeId

export function useScheduleChoices() {
  const [choices, setChoices] = useLocalStorage<Choices>(STORAGE_KEY, {});

  const choose = (scheduleId: string, placeId: string) => {
    setChoices((prev) => ({ ...prev, [scheduleId]: placeId }));
  };

  const clearChoice = (scheduleId: string) => {
    setChoices((prev) => {
      const next = { ...prev };
      delete next[scheduleId];
      return next;
    });
  };

  return { choices, choose, clearChoice };
}
