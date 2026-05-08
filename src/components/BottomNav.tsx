import { NavLink } from 'react-router-dom';

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

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[28rem] -translate-x-1/2 border-t border-line bg-card/95 backdrop-blur">
      <ul className="grid grid-cols-5">
        {TABS.map((tab) => (
          <li key={tab.to}>
            <NavLink
              to={tab.to}
              end={tab.to === '/'}
              className={({ isActive }) =>
                `flex min-h-[64px] flex-col items-center justify-center gap-0.5 px-1 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 text-[11px] font-medium transition-colors ${
                  isActive ? 'text-orange-600' : 'text-ink-muted'
                }`
              }
            >
              <span className="text-xl leading-none">{tab.icon}</span>
              <span>{tab.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
