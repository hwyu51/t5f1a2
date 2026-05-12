import { openNav, type NavTarget } from '../utils/navigation';

type Props = {
  target: NavTarget;
  className?: string;
};

export default function NavLinks({ target, className = '' }: Props) {
  const disabled = !target.lat && !target.lng && !target.address;

  if (disabled) {
    return (
      <div className={`text-xs italic text-ink-muted ${className}`}>
        위치 아직 안 정함
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => openNav('tmap', target)}
      className={`rounded-lg border border-sky-300 bg-card px-3 py-2 text-xs font-bold text-sky-700 transition active:scale-95 hover:bg-sky-50 ${className}`}
    >
      🗺 티맵으로 길찾기
    </button>
  );
}
