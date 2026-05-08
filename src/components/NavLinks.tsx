import { openNav, type NavApp, type NavTarget } from '../utils/navigation';

type Props = {
  target: NavTarget;
  className?: string;
};

const APPS: Array<{
  app: NavApp;
  label: string;
  text: string;
  border: string;
  hover: string;
}> = [
  {
    app: 'kakao',
    label: '카카오',
    text: 'text-yellow-700',
    border: 'border-yellow-300',
    hover: 'hover:bg-yellow-50',
  },
  {
    app: 'tmap',
    label: '티맵',
    text: 'text-sky-700',
    border: 'border-sky-300',
    hover: 'hover:bg-sky-50',
  },
  {
    app: 'naver',
    label: '네이버',
    text: 'text-green-700',
    border: 'border-green-300',
    hover: 'hover:bg-green-50',
  },
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
      {APPS.map(({ app, label, text, border, hover }) => (
        <button
          key={app}
          type="button"
          onClick={() => openNav(app, target)}
          className={`flex-1 rounded-lg border bg-card px-2 py-2 text-xs font-bold transition active:scale-95 ${border} ${text} ${hover}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
