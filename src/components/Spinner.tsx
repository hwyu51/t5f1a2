type Props = {
  label?: string;
};

export default function Spinner({ label = '불러오는 중...' }: Props) {
  return (
    <div className="flex items-center justify-center gap-2 py-6 text-xs text-ink-muted">
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-line border-t-orange-500" />
      <span>{label}</span>
    </div>
  );
}
