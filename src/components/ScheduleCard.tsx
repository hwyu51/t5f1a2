import { useMemo } from 'react';
import { PLACES } from '../data/places';
import type { ScheduleItem } from '../types';
import PlaceMini from './PlaceMini';

type Props = {
  item: ScheduleItem;
  chosenPlaceId?: string;
  onChoose?: (placeId: string) => void;
  onClear?: () => void;
};

export default function ScheduleCard({ item, chosenPlaceId, onChoose, onClear }: Props) {
  const isWarn = useMemo(
    () => item.title.includes('⚠️') || item.note?.includes('⚠️'),
    [item.title, item.note],
  );

  const place = item.placeId ? PLACES.find((p) => p.id === item.placeId) : undefined;
  const options = item.placeOptions
    ? item.placeOptions
        .map((id) => PLACES.find((p) => p.id === id))
        .filter((p): p is NonNullable<typeof p> => Boolean(p))
    : [];

  return (
    <article
      className={`flex gap-3 rounded-2xl border p-4 ${
        isWarn ? 'border-warn-border bg-warn-bg' : 'border-line bg-card'
      }`}
    >
      <div className="flex w-12 shrink-0 flex-col items-center pt-0.5">
        <div className="text-xs font-bold tabular-nums text-orange-600">
          {item.time}
        </div>
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        <h3 className={`text-sm font-bold ${isWarn ? 'text-warn-ink' : 'text-ink'}`}>
          {item.title}
        </h3>

        {item.note && (
          <p
            className={`whitespace-pre-line text-xs ${
              isWarn ? 'text-warn-ink/80' : 'text-ink-muted'
            }`}
          >
            {item.note}
          </p>
        )}

        {place && <PlaceMini place={place} />}

        {options.length > 0 && (
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-ink-muted">
              후보 {options.length}곳 — 하나 선택하면 이걸로 강조됩니다
            </div>
            {options.map((p) => (
              <PlaceMini
                key={p.id}
                place={p}
                selected={chosenPlaceId === p.id}
                onSelect={onChoose ? () => onChoose(p.id) : undefined}
                onClear={onClear}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
