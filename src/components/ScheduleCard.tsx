import { useMemo, useState } from 'react';
import { PLACES } from '../data/places';
import type { Place, ScheduleItem } from '../types';
import PlaceMini from './PlaceMini';

const CATEGORY_LABELS: Partial<Record<Place['type'], { icon: string; label: string }>> = {
  경유: { icon: '⛽', label: '휴게소' },
  마트: { icon: '🛒', label: '마트' },
  식당: { icon: '🍽', label: '식당' },
};

type Props = {
  item: ScheduleItem;
  chosenPlaceId?: string;
  onChoose?: (placeId: string) => void;
  onClear?: () => void;
  isLast?: boolean;
};

export default function ScheduleCard({
  item,
  chosenPlaceId,
  onChoose,
  onClear,
  isLast,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const isWarn = useMemo(
    () => item.title.includes('⚠️') || item.note?.includes('⚠️'),
    [item.title, item.note],
  );

  const place = item.placeId ? PLACES.find((p) => p.id === item.placeId) : undefined;
  const options = useMemo(
    () =>
      item.placeOptions
        ? item.placeOptions
            .map((id) => PLACES.find((p) => p.id === id))
            .filter((p): p is Place => Boolean(p))
        : [],
    [item.placeOptions],
  );

  const chosenPlace = chosenPlaceId
    ? options.find((p) => p.id === chosenPlaceId)
    : undefined;

  const categoryMeta = options.length > 0 ? CATEGORY_LABELS[options[0].type] : undefined;

  const handleSelect = (placeId: string) => {
    onChoose?.(placeId);
    setExpanded(false);
  };

  const handleClear = () => {
    onClear?.();
    setExpanded(true);
  };

  return (
    <article className="flex gap-3">
      {/* 좌측 타임라인 */}
      <div className="flex w-12 shrink-0 flex-col items-center pt-1">
        <div
          className={`text-xs font-bold tabular-nums ${
            isWarn ? 'text-warn-ink' : 'text-orange-600'
          }`}
        >
          {item.time}
        </div>
        <div
          className={`mt-1.5 h-2.5 w-2.5 rounded-full ring-2 ring-cream-50 ${
            isWarn ? 'bg-warn-border' : 'bg-orange-500'
          }`}
        />
        {!isLast && <div className="mt-1 w-px flex-1 bg-line" />}
      </div>

      {/* 우측 본문 */}
      <div
        className={`mb-3 min-w-0 flex-1 rounded-xl border p-3 ${
          isWarn ? 'border-warn-border bg-warn-bg' : 'border-line bg-card'
        }`}
      >
        <h3
          className={`text-sm font-bold leading-snug ${
            isWarn ? 'text-warn-ink' : 'text-ink'
          }`}
        >
          {item.title}
        </h3>

        {item.note && (
          <p
            className={`mt-1 whitespace-pre-line text-xs leading-relaxed ${
              isWarn ? 'text-warn-ink/80' : 'text-ink-muted'
            }`}
          >
            {item.note}
          </p>
        )}

        {place && (
          <div className="mt-2.5">
            <PlaceMini place={place} />
          </div>
        )}

        {chosenPlace && (
          <div className="mt-2.5">
            <PlaceMini place={chosenPlace} selected onClear={handleClear} />
          </div>
        )}

        {!chosenPlace && options.length > 0 && categoryMeta && !expanded && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="mt-2.5 flex w-full items-center justify-between rounded-xl border border-dashed border-line bg-cream-50/60 px-3 py-3 text-left transition hover:border-orange-400"
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">{categoryMeta.icon}</span>
              <span className="text-sm font-medium text-ink">
                {categoryMeta.label}
              </span>
            </span>
            <span className="text-[11px] font-medium text-ink-muted">
              {options.length}곳 중 선택 ›
            </span>
          </button>
        )}

        {!chosenPlace && options.length > 0 && expanded && (
          <div className="mt-2.5 space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold text-ink-muted">
                {categoryMeta?.label} 후보 {options.length}곳
              </span>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="text-[11px] text-ink-muted hover:text-ink"
              >
                닫기
              </button>
            </div>
            {options.map((p) => (
              <PlaceMini key={p.id} place={p} onSelect={() => handleSelect(p.id)} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
