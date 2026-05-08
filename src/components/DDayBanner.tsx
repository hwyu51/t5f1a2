import { useDDay } from '../hooks/useDDay';

type Props = {
  targetIso: string;
};

export default function DDayBanner({ targetIso }: Props) {
  const dday = useDDay(targetIso);

  return (
    <div className="rounded-3xl bg-gradient-to-br from-orange-500 to-orange-700 p-6 text-center text-white shadow-lg">
      <div className="text-xs font-semibold uppercase tracking-widest opacity-80">
        T5F1A2 · 대천 1박2일
      </div>
      <div className="mt-1 text-5xl font-black tracking-tight">{dday.label}</div>

      {!dday.past && (
        <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
          <TimeCell value={dday.hours} unit="시간" />
          <TimeCell value={dday.minutes} unit="분" />
          <TimeCell value={dday.seconds} unit="초" />
        </div>
      )}

      <div className="mt-3 text-sm opacity-90">2026.07.25(토) 09:30 출발</div>
    </div>
  );
}

function TimeCell({ value, unit }: { value: number; unit: string }) {
  return (
    <div className="rounded-xl bg-white/15 py-2">
      <div className="text-xl font-bold tabular-nums">
        {value.toString().padStart(2, '0')}
      </div>
      <div className="text-[10px] opacity-80">{unit}</div>
    </div>
  );
}
