import { useEffect, useState } from 'react';
import { calculateDDay, type DDay } from '../utils/dday';

export function useDDay(targetIso: string, refreshMs = 1000): DDay {
  const [dday, setDDay] = useState<DDay>(() => calculateDDay(targetIso));

  useEffect(() => {
    const id = setInterval(() => setDDay(calculateDDay(targetIso)), refreshMs);
    return () => clearInterval(id);
  }, [targetIso, refreshMs]);

  return dday;
}
