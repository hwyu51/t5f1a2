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
import type { Menu } from '../types';

const PATH = 'state/customMenus';
const CACHE_KEY = `fs:${PATH}`;

type State = { menus: Menu[] };

function readCache(): Menu[] {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return [];
    return (JSON.parse(raw) as State).menus ?? [];
  } catch {
    return [];
  }
}

function writeCache(menus: Menu[]): void {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify({ menus }));
  } catch {
    // ignore
  }
}

export function useCustomMenus() {
  const [menus, setMenus] = useState<Menu[]>(readCache);

  useEffect(() => {
    return onSnapshot(doc(db, PATH), (snap) => {
      const next = snap.exists() ? ((snap.data() as State).menus ?? []) : [];
      setMenus(next);
      writeCache(next);
    });
  }, []);

  const add = async (input: Omit<Menu, 'id'>) => {
    const newMenu: Menu = {
      ...input,
      id: `cm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    };
    await setDoc(doc(db, PATH), { menus: arrayUnion(newMenu) }, { merge: true });
  };

  const remove = async (menu: Menu) => {
    await setDoc(doc(db, PATH), { menus: arrayRemove(menu) }, { merge: true });
  };

  // 트랜잭션으로 atomic 수정 — id로 매칭, 동시 변경 race 방지
  const update = async (
    id: string,
    patch: Partial<Omit<Menu, 'id'>>,
  ) => {
    await runTransaction(db, async (tx) => {
      const ref = doc(db, PATH);
      const snap = await tx.get(ref);
      const current = snap.exists() ? ((snap.data() as State).menus ?? []) : [];
      const next = current.map((m) => (m.id === id ? { ...m, ...patch } : m));
      tx.set(ref, { menus: next });
    });
  };

  return { menus, add, remove, update };
}
