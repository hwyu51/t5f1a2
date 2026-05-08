import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { db } from '../lib/firebase';

export type WithId<T> = T & { id: string };

/**
 * Firestore 컬렉션 실시간 구독 훅.
 * - docs: 문서 배열 (id 포함)
 * - add/update/remove: CRUD
 * - 정렬은 createdAt 오름차순 기본 (옵션으로 끄거나 변경 가능)
 */
export function useFirestoreCollection<T extends DocumentData>(
  path: string,
  options?: { orderField?: string; orderDir?: 'asc' | 'desc' },
): {
  docs: WithId<T>[];
  ready: boolean;
  add: (input: T) => Promise<string>;
  update: (id: string, patch: Partial<T>) => Promise<void>;
  remove: (id: string) => Promise<void>;
} {
  const orderField = options?.orderField ?? 'createdAt';
  const orderDir = options?.orderDir ?? 'asc';

  const colRef = useMemo(() => collection(db, path), [path]);
  const q = useMemo(() => {
    const cs: QueryConstraint[] = [orderBy(orderField, orderDir)];
    return query(colRef, ...cs);
  }, [colRef, orderField, orderDir]);

  const [docs, setDocs] = useState<WithId<T>[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    return onSnapshot(q, (snap) => {
      // d.id가 데이터의 id 필드보다 우선되도록 spread 순서 마지막에 둠
      const next: WithId<T>[] = snap.docs.map(
        (d) => ({ ...d.data(), id: d.id }) as WithId<T>,
      );
      setDocs(next);
      setReady(true);
    });
  }, [q]);

  const add = async (input: T) => {
    const ref = await addDoc(colRef, input);
    return ref.id;
  };

  const update = async (id: string, patch: Partial<T>) => {
    await updateDoc(doc(db, path, id), patch as DocumentData);
  };

  const remove = async (id: string) => {
    await deleteDoc(doc(db, path, id));
  };

  return { docs, ready, add, update, remove };
}
