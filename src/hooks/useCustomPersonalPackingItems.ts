import { useCallback, useEffect, useState } from 'react';
import { useCurrentUser } from './useCurrentUser';
import type { PackingItem } from '../types';

// 본인별 LocalStorage 키. user 바뀌면 다른 사람의 항목으로 자동 교체.
const keyFor = (userId: string | null) =>
  userId ? `packing-personal:${userId}` : 'packing-personal:anon';

export function useCustomPersonalPackingItems() {
  const { userId } = useCurrentUser();
  const storageKey = keyFor(userId);

  const [items, setItems] = useState<PackingItem[]>(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      return raw ? (JSON.parse(raw) as PackingItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      setItems(raw ? (JSON.parse(raw) as PackingItem[]) : []);
    } catch {
      setItems([]);
    }
  }, [storageKey]);

  const persist = (next: PackingItem[]) => {
    setItems(next);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const add = useCallback(
    (input: Omit<PackingItem, 'id'>) => {
      const newItem: PackingItem = {
        ...input,
        type: '개인',
        id: `cp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      };
      persist([...items, newItem]);
    },
    [items, storageKey], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const remove = useCallback(
    (item: PackingItem) => {
      persist(items.filter((it) => it.id !== item.id));
    },
    [items, storageKey], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const update = useCallback(
    (id: string, patch: Partial<Pick<PackingItem, 'name'>>) => {
      persist(
        items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
      );
    },
    [items, storageKey], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return { items, add, remove, update };
}
