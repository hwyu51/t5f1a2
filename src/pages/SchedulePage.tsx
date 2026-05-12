import { useMemo } from 'react';
import Card from '../components/Card';
import ScheduleCard from '../components/ScheduleCard';
import { PLACES } from '../data/places';
import { SCHEDULE } from '../data/schedule';
import { TRIP } from '../data/trip';
import { useScheduleChoices } from '../hooks/useScheduleChoices';
import { openMultiRoute } from '../utils/navigation';

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

  // 1일차 전체 경로: 사용자 선택한 휴게소/마트 → 숙소
  // 미선택 시 추천 후보 (행담도, S-mart)
  const day1Route = useMemo(() => {
    const restId = choices['s03'] ?? 'rest-haengdam';
    const martId = choices['s04'] ?? 'mart-smart';
    const rest = PLACES.find((p) => p.id === restId);
    const mart = PLACES.find((p) => p.id === martId);
    const lodging = PLACES.find((p) => p.id === 'lodging');
    return [rest, mart, lodging]
      .filter((p): p is NonNullable<typeof p> => Boolean(p))
      .map((p) => ({ name: p.name, lat: p.lat, lng: p.lng }));
  }, [choices]);

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

          {/* 1일차 전체 경로 길찾기 카드 */}
          {day === 1 && day1Route.length > 0 && (
            <div className="px-4 pb-2">
              <Card className="!p-3">
                <div className="mb-2 text-[11px] font-bold text-ink-muted">
                  🚗 한 번에 길찾기
                </div>
                <div className="mb-2 text-xs leading-relaxed text-ink">
                  {day1Route.map((wp, i) => (
                    <span key={i}>
                      {i > 0 && (
                        <span className="text-ink-muted"> → </span>
                      )}
                      {wp.name}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => openMultiRoute(day1Route)}
                  className="w-full rounded-lg border border-sky-300 bg-card py-2 text-xs font-bold text-sky-700 hover:bg-sky-50"
                >
                  🗺 티맵으로 전체 경로
                </button>
              </Card>
            </div>
          )}

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
