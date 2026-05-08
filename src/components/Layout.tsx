import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <div className="mx-auto flex min-h-screen max-w-[28rem] flex-col bg-cream-50 shadow-[0_0_24px_rgba(0,0,0,0.04)]">
      <main className="flex-1 pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
