import { useMemo } from 'react';
import ScheduleCard from '../components/ScheduleCard';
import { SCHEDULE } from '../data/schedule';
import { TRIP } from '../data/trip';
import { useScheduleChoices } from '../hooks/useScheduleChoices';

const DAYS = [
  { day: 1 as const, label: '1일차', date: TRIP.startDate },
  { day: 2 as const, label: '2일차', date: TRIP.endDate },
];

export default function SchedulePage() {
  const { choices, choose, clearChoice } = useScheduleChoices();

  const grouped = useMemo(
    () =>
      DAYS.map(({ day, label, date }) => ({
        day,
        label,
        date,
        items: SCHEDULE.filter((s) => s.day === day),
      })),
    [],
  );

  return (
    <div className="space-y-4 pb-4">
      <div className="px-4 pt-5">
        <h1 className="text-xl font-black text-ink">일정</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {TRIP.startDate} ~ {TRIP.endDate} · {TRIP.destination}
        </p>
      </div>

      {grouped.map(({ day, label, date, items }) => (
        <section key={day} className="space-y-1">
          <div className="sticky top-0 z-10 bg-cream-50/95 px-4 py-2 backdrop-blur">
            <h2 className="text-sm font-bold text-ink">
              {label}
              <span className="ml-1.5 text-xs font-medium text-ink-muted">
                {date.slice(5).replace('-', '/')}
              </span>
            </h2>
          </div>
          <div className="px-4 pb-2">
            {items.map((item, idx) => (
              <ScheduleCard
                key={item.id}
                item={item}
                chosenPlaceId={choices[item.id]}
                onChoose={(placeId) => choose(item.id, placeId)}
                onClear={() => clearChoice(item.id)}
                isLast={idx === items.length - 1}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
