import { useCallback, useEffect, useState } from 'react';
import { useCurrentUser } from './useCurrentUser';

// 본인별 LocalStorage 키. user 바뀌면 다른 체크 상태로 자동 교체.
const keyFor = (userId: string | null) =>
  userId ? `packing-checks:${userId}` : 'packing-checks:anon';

export function usePackingChecks() {
  const { userId } = useCurrentUser();
  const storageKey = keyFor(userId);

  const [checks, setChecks] = useState<Record<string, boolean>>(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
    } catch {
      return {};
    }
  });

  // user 변경 시 새 키에서 재로드
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      setChecks(raw ? (JSON.parse(raw) as Record<string, boolean>) : {});
    } catch {
      setChecks({});
    }
  }, [storageKey]);

  const toggle = useCallback(
    (itemId: string) => {
      setChecks((prev) => {
        const next = { ...prev, [itemId]: !prev[itemId] };
        try {
          window.localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [storageKey],
  );

  const isChecked = (itemId: string) => Boolean(checks[itemId]);

  return { checks, toggle, isChecked };
}
