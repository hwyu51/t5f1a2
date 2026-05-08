import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useEffect, useMemo, useRef, useState } from 'react';
import { db } from '../lib/firebase';

/**
 * Firestore 단일 문서 실시간 구독 훅.
 * - 문서가 없으면 defaultValue 사용
 * - update(next)로 setDoc(merge=false) 수행. 즉 문서 통째로 덮어씀.
 *   부분 업데이트가 필요하면 update에 (prev) => 새 값 형태로 호출.
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
  const [value, setValue] = useState<T>(defaultValue);
  const [ready, setReady] = useState<boolean>(false);
  // 항상 최신 value 참조 (update 함수가 stale closure 안 쓰도록)
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    return onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setValue(snap.data() as T);
      } else {
        setValue(defaultValue);
      }
      setReady(true);
    });
    // defaultValue는 매 렌더 새 객체일 수 있어 의도적으로 deps에서 제외
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  const update = async (next: T | ((prev: T) => T)) => {
    const resolved =
      typeof next === 'function'
        ? (next as (prev: T) => T)(valueRef.current)
        : next;
    setValue(resolved); // 낙관적 업데이트
    await setDoc(ref, resolved);
  };

  return { value, ready, update };
}
