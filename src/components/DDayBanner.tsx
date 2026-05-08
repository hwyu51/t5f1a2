import { useDDay } from '../hooks/useDDay';

type Props = {
  targetIso: string;
};

export default function DDayBanner({ targetIso }: Props) {
  const dday = useDDay(targetIso);

  return (
    <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 p-4 text-white shadow-md">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] font-medium opacity-80">대천 1박2일까지</div>
          <div className="mt-0.5 text-3xl font-black tracking-tight">{dday.label}</div>
        </div>
        {!dday.past && (
          <div className="shrink-0 text-right text-xs tabular-nums opacity-90">
            {dday.days}일 {dday.hours}시간 {dday.minutes}분
          </div>
        )}
      </div>
    </div>
  );
}
