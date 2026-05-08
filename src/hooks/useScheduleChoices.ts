import { deleteField, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';

const PATH = 'state/scheduleChoices';
const CACHE_KEY = `fs:${PATH}`;

type State = { choices: Record<string, string> };

function readCache(): Record<string, string> {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as State;
    return parsed.choices ?? {};
  } catch {
    return {};
  }
}

function writeCache(choices: Record<string, string>): void {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify({ choices }));
  } catch {
    // ignore
  }
}

export function useScheduleChoices() {
  const [choices, setChoices] = useState<Record<string, string>>(readCache);

  useEffect(() => {
    return onSnapshot(doc(db, PATH), (snap) => {
      const next = snap.exists() ? ((snap.data() as State).choices ?? {}) : {};
      setChoices(next);
      writeCache(next);
    });
  }, []);

  const choose = async (scheduleId: string, placeId: string) => {
    await setDoc(
      doc(db, PATH),
      { choices: { [scheduleId]: placeId } },
      { merge: true },
    );
  };

  const clearChoice = async (scheduleId: string) => {
    // 문서가 아직 없으면 updateDoc 실패 — 빈 상태에선 어차피 지울 게 없으니 noop
    if (!choices[scheduleId]) return;
    await updateDoc(doc(db, PATH), {
      [`choices.${scheduleId}`]: deleteField(),
    });
  };

  return { choices, choose, clearChoice };
}
