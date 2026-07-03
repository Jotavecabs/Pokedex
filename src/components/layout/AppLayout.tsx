import { Outlet } from 'react-router-dom';
import { Hotbar } from './Hotbar';

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex-1 pb-24">
        <div className="mx-auto w-full max-w-6xl">
          <Outlet />
        </div>
      </main>
      <Hotbar />
    </div>
  );
}
