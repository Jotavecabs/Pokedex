import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const MAX_COMPARE = 2;

interface CompareState {
  ids: number[];
  toggle: (id: number) => void;
  remove: (id: number) => void;
  isSelected: (id: number) => boolean;
  isFull: () => boolean;
  clear: () => void;
}

// seleção para a comparação (até 2 Pokémons)
export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((state) => {
          if (state.ids.includes(id)) {
            return { ids: state.ids.filter((x) => x !== id) };
          }
          if (state.ids.length >= MAX_COMPARE) {
            // substitui o mais antigo
            return { ids: [state.ids[1], id] };
          }
          return { ids: [...state.ids, id] };
        }),
      remove: (id) => set((state) => ({ ids: state.ids.filter((x) => x !== id) })),
      isSelected: (id) => get().ids.includes(id),
      isFull: () => get().ids.length >= MAX_COMPARE,
      clear: () => set({ ids: [] }),
    }),
    { name: 'pokedex:compare' },
  ),
);
