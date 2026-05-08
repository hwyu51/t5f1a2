import { openNav, type NavApp, type NavTarget } from '../utils/navigation';

type Props = {
  target: NavTarget;
  className?: string;
};

const APPS: Array<{ app: NavApp; label: string; bg: string }> = [
  { app: 'kakao', label: '카카오', bg: 'bg-yellow-300 hover:bg-yellow-400' },
  { app: 'tmap', label: '티맵', bg: 'bg-sky-500 hover:bg-sky-600 text-white' },
  { app: 'naver', label: '네이버', bg: 'bg-green-500 hover:bg-green-600 text-white' },
];

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
    <div className={`flex gap-1.5 ${className}`}>
      {APPS.map(({ app, label, bg }) => (
        <button
          key={app}
          type="button"
          onClick={() => openNav(app, target)}
          className={`flex-1 rounded-lg px-2 py-2 text-xs font-bold text-ink transition active:scale-95 ${bg}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
