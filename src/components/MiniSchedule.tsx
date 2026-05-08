import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SCHEDULE } from '../data/schedule';

const DAYS = [
  { day: 1, label: '1일차' },
  { day: 2, label: '2일차' },
] as const;

export default function MiniSchedule() {
  const [activeDay, setActiveDay] = useState<1 | 2>(1);

  const items = useMemo(
    () => SCHEDULE.filter((s) => s.day === activeDay),
    [activeDay],
  );

  return (
    <div className="rounded-2xl border border-line bg-card p-4">
      <header className="mb-3 flex items-center justify-between">
        <div className="flex gap-1 rounded-lg bg-cream-100 p-0.5">
          {DAYS.map(({ day, label }) => (
            <button
              key={day}
              type="button"
              onClick={() => setActiveDay(day as 1 | 2)}
              className={`rounded-md px-3 py-1 text-xs font-bold transition ${
                activeDay === day
                  ? 'bg-card text-orange-600 shadow-sm'
                  : 'text-ink-muted'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <Link
          to="/schedule"
          className="text-xs font-medium text-orange-600 hover:underline"
        >
          전체 보기 ›
        </Link>
      </header>

      <ul className="space-y-2.5">
        {items.map((item) => {
          const isWarn = item.title.includes('⚠️') || item.note?.includes('⚠️');
          return (
            <li key={item.id} className="flex gap-3">
              <span
                className={`w-12 shrink-0 text-xs font-bold tabular-nums ${
                  isWarn ? 'text-warn-ink' : 'text-orange-600'
                }`}
              >
                {item.time}
              </span>
              <span
                className={`min-w-0 flex-1 text-sm leading-snug ${
                  isWarn ? 'text-warn-ink' : 'text-ink'
                }`}
              >
                {item.title}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
