import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import MemberSelectModal from './MemberSelectModal';
import ScrollToTop from './ScrollToTop';
import { useAdminMode } from '../hooks/useAdminMode';
import { useCurrentUser } from '../hooks/useCurrentUser';

export default function Layout() {
  const { userId, setUserId } = useCurrentUser();
  const { isAdmin } = useAdminMode();

  return (
    <div className="mx-auto flex min-h-screen max-w-[28rem] flex-col bg-cream-50 shadow-[0_0_24px_rgba(0,0,0,0.04)]">
      <ScrollToTop />
      {isAdmin && (
        <div className="sticky top-0 z-30 bg-orange-500 px-4 py-1 text-center text-[11px] font-bold text-white">
          🔧 관리자 모드 ON
        </div>
      )}
      <main className="flex-1 pb-20">
        <Outlet />
      </main>
      <BottomNav />
      <MemberSelectModal
        open={!userId}
        onSelect={(m) => setUserId(m.id)}
        closable={false}
      />
    </div>
  );
}
