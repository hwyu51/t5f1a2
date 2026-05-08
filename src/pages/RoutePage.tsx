import { useMemo } from 'react';
import PlaceMini from '../components/PlaceMini';
import { PLACES } from '../data/places';
import type { Place } from '../types';

const TYPE_ORDER: Place['type'][] = [
  '집합',
  '경유',
  '마트',
  '숙소',
  '관광',
  '식당',
  '기타',
  '병원',
];

const TYPE_META: Record<Place['type'], { icon: string; label: string }> = {
  집합: { icon: '🚩', label: '집합지' },
  경유: { icon: '⛽', label: '휴게소' },
  마트: { icon: '🛒', label: '마트' },
  숙소: { icon: '🏠', label: '숙소' },
  관광: { icon: '🎡', label: '관광/축제' },
  식당: { icon: '🍽', label: '식당' },
  기타: { icon: '📍', label: '기타' },
  병원: { icon: '🏥', label: '병원' },
};

export default function RoutePage() {
  const grouped = useMemo(() => {
    return TYPE_ORDER.map((type) => ({
      type,
      places: PLACES.filter((p) => p.type === type),
    })).filter((g) => g.places.length > 0);
  }, []);

  return (
    <div className="space-y-5 pb-4">
      <div className="px-4 pt-5">
        <h1 className="text-xl font-black text-ink">경로</h1>
        <p className="mt-1 text-sm text-ink-muted">
          모든 지점에서 카카오/티맵/네이버로 바로 길찾기
        </p>
      </div>

      {grouped.map(({ type, places }) => {
        const meta = TYPE_META[type];
        return (
          <section key={type} className="space-y-2 px-4">
            <h2 className="text-sm font-bold text-ink">
              {meta.icon} {meta.label}
              <span className="ml-1.5 text-xs font-medium text-ink-muted">
                {places.length}곳
              </span>
            </h2>
            <div className="space-y-2">
              {places.map((p) => (
                <PlaceMini key={p.id} place={p} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
