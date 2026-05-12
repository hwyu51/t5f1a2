import { useCallback, useMemo } from 'react';
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

  // 본인 변경 시 자동 페이지 리프레시 — 모든 hook이 새 사용자 기준으로 재초기화됨
  const clear = useCallback(() => {
    reset();
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }, [reset]);

  return {
    userId,
    user,
    setUserId: (id: string) => setUserId(id),
    clear,
  };
}
