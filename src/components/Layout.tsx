import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import MemberSelectModal from './MemberSelectModal';
import { useCurrentUser } from '../hooks/useCurrentUser';

export default function Layout() {
  const { userId, setUserId } = useCurrentUser();

  return (
    <div className="mx-auto flex min-h-screen max-w-[28rem] flex-col bg-cream-50 shadow-[0_0_24px_rgba(0,0,0,0.04)]">
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
