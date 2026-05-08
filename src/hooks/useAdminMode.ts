import { useEffect, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';

const ADMIN_PASSWORD = '0501';
const TTL_MS = 24 * 60 * 60 * 1000; // 24시간

export function useAdminMode() {
  const [until, setUntil] = useLocalStorage<number>('admin-mode-until', 0);
  const [now, setNow] = useState<number>(() => Date.now());

  // 1분마다 만료 체크 트리거
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const isAdmin = until > now;

  const enable = (password: string): boolean => {
    if (password !== ADMIN_PASSWORD) return false;
    setUntil(Date.now() + TTL_MS);
    setNow(Date.now());
    return true;
  };

  const disable = () => {
    setUntil(0);
    setNow(Date.now());
  };

  return { isAdmin, enable, disable, expiresAt: until };
}
