import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';

const PATH = 'state/packingChecksShared';
const CACHE_KEY = `fs:${PATH}`;

type State = { checks: Record<string, boolean> };

function readCache(): Record<string, boolean> {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return {};
    return (JSON.parse(raw) as State).checks ?? {};
  } catch {
    return {};
  }
}

function writeCache(checks: Record<string, boolean>): void {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify({ checks }));
  } catch {
    // ignore
  }
}

/**
 * 공용 준비물 체크 — Firestore. 모든 멤버에게 동일하게 보임.
 */
export function usePackingChecksShared() {
  const [checks, setChecks] = useState<Record<string, boolean>>(readCache);

  useEffect(() => {
    return onSnapshot(doc(db, PATH), (snap) => {
      const next = snap.exists() ? ((snap.data() as State).checks ?? {}) : {};
      setChecks(next);
      writeCache(next);
    });
  }, []);

  const toggle = async (itemId: string) => {
    const next = !checks[itemId];
    await setDoc(doc(db, PATH), { checks: { [itemId]: next } }, { merge: true });
  };

  const isChecked = (itemId: string) => Boolean(checks[itemId]);

  return { checks, toggle, isChecked };
}
