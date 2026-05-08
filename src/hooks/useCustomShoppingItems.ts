import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  runTransaction,
  setDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import type { Ingredient } from '../types';

const PATH = 'state/customShoppingItems';
const CACHE_KEY = `fs:${PATH}`;

export type CustomShoppingItem = {
  id: string;
  name: string;
  amount: string;
  category: Ingredient['category'];
};

type State = { items: CustomShoppingItem[] };

function readCache(): CustomShoppingItem[] {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return [];
    return (JSON.parse(raw) as State).items ?? [];
  } catch {
    return [];
  }
}

function writeCache(items: CustomShoppingItem[]): void {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify({ items }));
  } catch {
    // ignore
  }
}

export function useCustomShoppingItems() {
  const [items, setItems] = useState<CustomShoppingItem[]>(readCache);

  useEffect(() => {
    return onSnapshot(doc(db, PATH), (snap) => {
      const next = snap.exists() ? ((snap.data() as State).items ?? []) : [];
      setItems(next);
      writeCache(next);
    });
  }, []);

  const add = async (input: Omit<CustomShoppingItem, 'id'>) => {
    const newItem: CustomShoppingItem = {
      ...input,
      id: `cs-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    };
    await setDoc(doc(db, PATH), { items: arrayUnion(newItem) }, { merge: true });
  };

  const remove = async (item: CustomShoppingItem) => {
    await setDoc(doc(db, PATH), { items: arrayRemove(item) }, { merge: true });
  };

  const update = async (
    id: string,
    patch: Partial<Omit<CustomShoppingItem, 'id'>>,
  ) => {
    await runTransaction(db, async (tx) => {
      const ref = doc(db, PATH);
      const snap = await tx.get(ref);
      const current = snap.exists() ? ((snap.data() as State).items ?? []) : [];
      const next = current.map((it) => (it.id === id ? { ...it, ...patch } : it));
      tx.set(ref, { items: next });
    });
  };

  return { items, add, remove, update };
}
