import { useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useMembers } from './useMembers';

const STORAGE_KEY = 'current-user-id';

export function useCurrentUser() {
  const [userId, setUserId, reset] = useLocalStorage<string | null>(STORAGE_KEY, null);
  const { members } = useMembers();

  const user = useMemo(
    () => (userId ? members.find((m) => m.id === userId) ?? null : null),
    [userId, members],
  );

  return {
    userId,
    user,
    setUserId: (id: string) => setUserId(id),
    clear: reset,
  };
}
