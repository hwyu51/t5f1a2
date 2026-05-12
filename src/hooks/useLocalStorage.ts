import { useCallback, useEffect, useState } from 'react';

// 같은 페이지 내 useLocalStorage 인스턴스 동기화용 글로벌 listener 맵
// (useLocalStorage 두 곳에서 같은 키 쓰는 경우 한 곳에서 setValue 호출 시 다른 곳도 갱신됨)
type Listener = (value: unknown) => void;
const listenersByKey: Map<string, Set<Listener>> = new Map();

function getListeners(key: string): Set<Listener> {
  let set = listenersByKey.get(key);
  if (!set) {
    set = new Set();
    listenersByKey.set(key, set);
  }
  return set;
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? initialValue : (JSON.parse(raw) as T);
    } catch {
      return initialValue;
    }
  });

  // 다른 인스턴스의 갱신을 구독
  useEffect(() => {
    const listener: Listener = (v) => setValue(v as T);
    const set = getListeners(key);
    set.add(listener);
    return () => {
      set.delete(listener);
    };
  }, [key]);

  // 외부 호출 (write): localStorage + 모든 listener 알림
  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof next === 'function' ? (next as (prev: T) => T)(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // 저장 실패 무시
        }
        // 같은 키의 다른 인스턴스 동기화
        const set = getListeners(key);
        set.forEach((l) => l(resolved));
        return resolved;
      });
    },
    [key],
  );

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
    setValue(initialValue);
    const set = getListeners(key);
    set.forEach((l) => l(initialValue));
  }, [key, initialValue]);

  return [value, update, reset] as const;
}
