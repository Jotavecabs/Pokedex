import { Outlet } from 'react-router-dom';
import { Hotbar } from './Hotbar';

/** Shell da aplicação: conteúdo centralizado + barra inferior fixa. */
export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex-1 pb-24">
        <div className="mx-auto w-full max-w-5xl">
          <Outlet />
        </div>
      </main>
      <Hotbar />
    </div>
  );
}
