import { useMemo } from 'react';
import { MEMBERS } from '../data/members';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'current-user-id';

export function useCurrentUser() {
  const [userId, setUserId, reset] = useLocalStorage<string | null>(STORAGE_KEY, null);

  const user = useMemo(
    () => (userId ? MEMBERS.find((m) => m.id === userId) ?? null : null),
    [userId],
  );

  return {
    userId,
    user,
    setUserId: (id: string) => setUserId(id),
    clear: reset,
  };
}
