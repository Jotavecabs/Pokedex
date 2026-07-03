import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  ids: number[];
  toggle: (id: number) => void;
  isFavorite: (id: number) => boolean;
  clear: () => void;
}

// favoritos globais, persistidos em localStorage
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((state) => ({
          ids: state.ids.includes(id)
            ? state.ids.filter((favId) => favId !== id)
            : [...state.ids, id],
        })),
      isFavorite: (id) => get().ids.includes(id),
      clear: () => set({ ids: [] }),
    }),
    { name: 'pokedex:favorites' },
  ),
);
