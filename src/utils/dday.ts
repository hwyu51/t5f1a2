export type DDay = {
  label: string; // "D-78", "D-DAY", "D+1"
  days: number; // 양수=남은 날, 0=당일, 음수=경과
  hours: number;
  minutes: number;
  seconds: number;
  past: boolean;
};

export function calculateDDay(targetIso: string, now: Date = new Date()): DDay {
  const target = new Date(targetIso).getTime();
  const diffMs = target - now.getTime();
  const past = diffMs < 0;
  const absMs = Math.abs(diffMs);

  const days = Math.floor(absMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((absMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((absMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((absMs % (1000 * 60)) / 1000);

  let label: string;
  if (!past && days === 0 && hours >= 0) {
    label = 'D-DAY';
  } else if (past) {
    label = `D+${days}`;
  } else {
    label = `D-${days}`;
  }

  return { label, days, hours, minutes, seconds, past };
}
