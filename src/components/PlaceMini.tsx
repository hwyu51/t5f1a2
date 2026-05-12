import type { Place } from '../types';
import NavLinks from './NavLinks';

type Props = {
  place: Place;
  selected?: boolean;
  onSelect?: () => void;
  onClear?: () => void;
};

export default function PlaceMini({ place, selected, onSelect, onClear }: Props) {
  return (
    <div
      className={`rounded-xl border-2 p-3 transition ${
        selected
          ? 'border-orange-500 bg-orange-50'
          : 'border-line bg-card hover:border-orange-300'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-ink">{place.name}</span>
            {selected && (
              <span className="rounded-full bg-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                선택
              </span>
            )}
          </div>
          {place.address && (
            <div className="mt-0.5 text-[11px] text-ink-muted">{place.address}</div>
          )}
          {place.note && (
            <div className="mt-1.5 whitespace-pre-line text-xs text-ink/80">
              {place.note}
            </div>
          )}
        </div>
      </div>

      <div className="mt-2.5 flex items-center gap-2">
        <NavLinks target={place} className="flex-1" />
        {onSelect && !selected && (
          <button
            type="button"
            onClick={onSelect}
            className="shrink-0 rounded-lg border border-orange-500 px-3 py-2 text-xs font-bold text-orange-600 hover:bg-orange-50"
          >
            선택
          </button>
        )}
        {onClear && selected && (
          <button
            type="button"
            onClick={onClear}
            className="shrink-0 rounded-lg border border-line px-3 py-2 text-xs text-ink-muted hover:bg-cream-100"
          >
            해제
          </button>
        )}
      </div>
    </div>
  );
}
