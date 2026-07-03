import { Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { HomePage } from '@/pages/HomePage';
import { PokemonDetailPage } from '@/pages/PokemonDetailPage';
import { FavoritesPage } from '@/pages/FavoritesPage';
import { ComparePage } from '@/pages/ComparePage';
import { RegionsPage } from '@/pages/RegionsPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
        <Route path="/regioes" element={<RegionsPage />} />
        <Route path="/favoritos" element={<FavoritesPage />} />
        <Route path="/comparar" element={<ComparePage />} />
        <Route
          path="*"
          element={
            <p className="px-4 py-20 text-center text-gray-400">
              Página não encontrada.
            </p>
          }
        />
      </Route>
    </Routes>
  );
}
