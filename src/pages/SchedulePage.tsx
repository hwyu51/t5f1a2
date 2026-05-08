import { useMemo, useState } from 'react';
import ScheduleCard from '../components/ScheduleCard';
import { SCHEDULE } from '../data/schedule';
import { TRIP } from '../data/trip';
import { useScheduleChoices } from '../hooks/useScheduleChoices';

const DAYS = [
  { day: 1, label: '1일차', date: TRIP.startDate },
  { day: 2, label: '2일차', date: TRIP.endDate },
] as const;

export default function SchedulePage() {
  const [activeDay, setActiveDay] = useState<1 | 2>(1);
  const { choices, choose, clearChoice } = useScheduleChoices();

  const items = useMemo(
    () => SCHEDULE.filter((s) => s.day === activeDay),
    [activeDay],
  );

  return (
    <div className="space-y-4">
      <div className="px-4 pt-5">
        <h1 className="text-xl font-black text-ink">일정</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {TRIP.startDate} ~ {TRIP.endDate} · {TRIP.destination}
        </p>
      </div>

      <div className="sticky top-0 z-10 bg-cream-50/95 px-4 pb-2 pt-1 backdrop-blur">
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-cream-100 p-1">
          {DAYS.map(({ day, label, date }) => (
            <button
              key={day}
              type="button"
              onClick={() => setActiveDay(day as 1 | 2)}
              className={`rounded-lg py-2 text-sm font-bold transition ${
                activeDay === day
                  ? 'bg-card text-orange-600 shadow-sm'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {label}
              <span className="ml-1 text-[10px] font-medium opacity-70">{date.slice(5)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 px-4">
        {items.map((item) => (
          <ScheduleCard
            key={item.id}
            item={item}
            chosenPlaceId={choices[item.id]}
            onChoose={(placeId) => choose(item.id, placeId)}
            onClear={() => clearChoice(item.id)}
          />
        ))}
      </div>
    </div>
  );
}
