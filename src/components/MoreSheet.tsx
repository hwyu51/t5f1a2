import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdminMode } from '../hooks/useAdminMode';

type Item = {
  to: string;
  label: string;
  icon: string;
  desc: string;
};

const ITEMS: Item[] = [
  { to: '/menus', label: '메뉴', icon: '🍖', desc: '바베큐/안주 정하기' },
  { to: '/shopping', label: '장보기', icon: '🛒', desc: '메뉴 → 식재료 자동 집계' },
  { to: '/budget', label: '정산', icon: '💰', desc: '지출/N분의1' },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function MoreSheet({ open, onClose }: Props) {
  const { isAdmin, enable, disable } = useAdminMode();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const handleAdminToggle = () => {
    if (isAdmin) {
      disable();
      return;
    }
    const pwd = window.prompt('관리자 비번?');
    if (pwd === null) return;
    if (!enable(pwd)) {
      window.alert('비번 틀림');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[28rem] rounded-t-3xl bg-card p-5 pb-[max(env(safe-area-inset-bottom),1.25rem)] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-ink">더보기</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-ink-muted hover:bg-cream-100"
          >
            닫기
          </button>
        </header>

        <ul className="space-y-2">
          {ITEMS.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                onClick={onClose}
                className="flex items-center gap-3 rounded-2xl border border-line bg-cream-50/60 p-3 transition active:scale-[0.98] hover:border-orange-400"
              >
                <span className="text-2xl leading-none">{item.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-ink">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-ink-muted">
                    {item.desc}
                  </span>
                </span>
                <span className="text-ink-muted">›</span>
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={handleAdminToggle}
          className={`mt-4 w-full rounded-xl px-3 py-2.5 text-xs font-bold transition active:scale-[0.98] ${
            isAdmin
              ? 'border border-orange-500 bg-orange-50 text-orange-700'
              : 'border border-line bg-cream-50 text-ink-muted hover:border-ink-muted'
          }`}
        >
          {isAdmin ? '🔧 관리자 모드 ON · 끄기' : '🔧 관리자 모드'}
        </button>
      </div>
    </div>
  );
}
