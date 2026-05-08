import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useEffect, useMemo, useRef, useState } from 'react';
import { db } from '../lib/firebase';

const cacheKey = (path: string) => `fs:${path}`;

function readCache<T>(path: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(cacheKey(path));
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeCache<T>(path: string, value: T): void {
  try {
    window.localStorage.setItem(cacheKey(path), JSON.stringify(value));
  } catch {
    // ignore (사파리 시크릿 등)
  }
}

/**
 * Firestore 단일 문서 실시간 구독 훅.
 * - LocalStorage 캐시: 첫 진입 시 캐시 값으로 즉시 표시 → Firestore 데이터 도착하면 교체.
 *   새로고침 깜빡임 제거.
 * - 문서가 없으면 defaultValue 사용
 * - update(next)로 setDoc(merge=false) 수행 (문서 통째로 덮어씀)
 *   부분 업데이트는 별도 SDK 호출 권장 (race-safe)
 */
export function useFirestoreDoc<T extends object>(
  path: string,
  defaultValue: T,
): {
  value: T;
  ready: boolean;
  update: (next: T | ((prev: T) => T)) => Promise<void>;
} {
  const ref = useMemo(() => doc(db, path), [path]);
  const [value, setValue] = useState<T>(() => readCache<T>(path, defaultValue));
  const [ready, setReady] = useState<boolean>(false);
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    return onSnapshot(ref, (snap) => {
      const next = snap.exists() ? (snap.data() as T) : defaultValue;
      setValue(next);
      writeCache(path, next);
      setReady(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  const update = async (next: T | ((prev: T) => T)) => {
    const resolved =
      typeof next === 'function'
        ? (next as (prev: T) => T)(valueRef.current)
        : next;
    setValue(resolved);
    writeCache(path, resolved);
    await setDoc(ref, resolved);
  };

  return { value, ready, update };
}
