import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';

const PATH = 'state/menuSelection';
const CACHE_KEY = `fs:${PATH}`;

type State = { selectedIds: string[] };

function readCache(): string[] {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as State;
    return parsed.selectedIds ?? [];
  } catch {
    return [];
  }
}

function writeCache(ids: string[]): void {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify({ selectedIds: ids }));
  } catch {
    // ignore
  }
}

export function useMenuSelection() {
  const [selectedIds, setSelectedIds] = useState<string[]>(readCache);

  useEffect(() => {
    return onSnapshot(doc(db, PATH), (snap) => {
      const ids = snap.exists()
        ? ((snap.data() as State).selectedIds ?? [])
        : [];
      setSelectedIds(ids);
      writeCache(ids);
    });
  }, []);

  // arrayUnion/arrayRemove로 race-safe 부분 업데이트
  const toggle = async (menuId: string) => {
    const isOn = selectedIds.includes(menuId);
    await setDoc(
      doc(db, PATH),
      { selectedIds: isOn ? arrayRemove(menuId) : arrayUnion(menuId) },
      { merge: true },
    );
  };

  const isSelected = (menuId: string) => selectedIds.includes(menuId);

  return { selectedIds, toggle, isSelected };
}
