import { deleteField, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';

const PATH = 'state/ingredientChecks';
const CACHE_KEY = `fs:${PATH}`;

type State = { checks: Record<string, boolean> };

function readCache(): Record<string, boolean> {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as State;
    return parsed.checks ?? {};
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

export function useIngredientChecks() {
  const [checks, setChecks] = useState<Record<string, boolean>>(readCache);

  useEffect(() => {
    return onSnapshot(doc(db, PATH), (snap) => {
      const next = snap.exists() ? ((snap.data() as State).checks ?? {}) : {};
      setChecks(next);
      writeCache(next);
    });
  }, []);

  const toggle = async (key: string) => {
    const next = !checks[key];
    await setDoc(doc(db, PATH), { checks: { [key]: next } }, { merge: true });
  };

  const isChecked = (key: string) => Boolean(checks[key]);

  // 특정 키 자체를 제거 (장보기 항목 삭제 시 cleanup)
  const removeKey = async (key: string) => {
    if (!(key in checks)) return;
    await updateDoc(doc(db, PATH), { [`checks.${key}`]: deleteField() });
  };

  return { checks, toggle, isChecked, removeKey };
}
