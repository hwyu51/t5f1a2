import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import MoreSheet from './MoreSheet';

type Tab = {
  to: string;
  label: string;
  icon: string;
};

const TABS: Tab[] = [
  { to: '/', label: '홈', icon: '🏠' },
  { to: '/schedule', label: '일정', icon: '📅' },
  { to: '/shopping', label: '장보기', icon: '🛒' },
  { to: '/cars', label: '차량', icon: '🚗' },
  { to: '/budget', label: '정산', icon: '💰' },
];

const TAB_ITEM_CLASS =
  'flex min-h-[64px] flex-col items-center justify-center gap-0.5 px-1 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 text-[11px] font-medium transition-colors';

export default function BottomNav() {
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[28rem] -translate-x-1/2 border-t border-line bg-card/95 backdrop-blur">
        <ul className="grid grid-cols-6">
          {TABS.map((tab) => (
            <li key={tab.to}>
              <NavLink
                to={tab.to}
                end={tab.to === '/'}
                className={({ isActive }) =>
                  `${TAB_ITEM_CLASS} ${isActive ? 'text-orange-600' : 'text-ink-muted'}`
                }
              >
                <span className="text-xl leading-none">{tab.icon}</span>
                <span>{tab.label}</span>
              </NavLink>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => setShowMore(true)}
              className={`${TAB_ITEM_CLASS} w-full text-ink-muted hover:text-ink`}
            >
              <span className="text-xl leading-none">☰</span>
              <span>더보기</span>
            </button>
          </li>
        </ul>
      </nav>
      <MoreSheet open={showMore} onClose={() => setShowMore(false)} />
    </>
  );
}
