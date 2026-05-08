import { arrayRemove, arrayUnion, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import type { PackingItem } from '../types';

const PATH = 'state/customPackingItems';
const CACHE_KEY = `fs:${PATH}`;

type State = { items: PackingItem[] };

function readCache(): PackingItem[] {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return [];
    return (JSON.parse(raw) as State).items ?? [];
  } catch {
    return [];
  }
}

function writeCache(items: PackingItem[]): void {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify({ items }));
  } catch {
    // ignore
  }
}

export function useCustomPackingItems() {
  const [items, setItems] = useState<PackingItem[]>(readCache);

  useEffect(() => {
    return onSnapshot(doc(db, PATH), (snap) => {
      const next = snap.exists() ? ((snap.data() as State).items ?? []) : [];
      setItems(next);
      writeCache(next);
    });
  }, []);

  const add = async (item: Omit<PackingItem, 'id'>) => {
    const newItem: PackingItem = {
      ...item,
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    };
    await setDoc(
      doc(db, PATH),
      { items: arrayUnion(newItem) },
      { merge: true },
    );
  };

  const remove = async (item: PackingItem) => {
    await setDoc(doc(db, PATH), { items: arrayRemove(item) }, { merge: true });
  };

  const update = async (
    oldItem: PackingItem,
    patch: Partial<Pick<PackingItem, 'name' | 'assigneeId'>>,
  ) => {
    const updated: PackingItem = { ...oldItem, ...patch };
    // assigneeId가 빈 문자열이면 필드 자체 제거 효과 — Firestore arrayUnion은 객체 동등성이라 형태 일치 필요
    await setDoc(doc(db, PATH), { items: arrayRemove(oldItem) }, { merge: true });
    await setDoc(doc(db, PATH), { items: arrayUnion(updated) }, { merge: true });
  };

  return { items, add, remove, update };
}
