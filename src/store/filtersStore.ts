import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PokemonTypeName } from '@/types/pokemon';

export type SortOption =
  | 'number-asc'
  | 'number-desc'
  | 'name-asc'
  | 'name-desc';

export const SORT_LABELS: Record<SortOption, string> = {
  'number-asc': 'Menor número',
  'number-desc': 'Maior número',
  'name-asc': 'A-Z',
  'name-desc': 'Z-A',
};

/** Faixas de altura (em metros) e peso (em kg) usadas nos filtros. */
export type HeightBucket = 'all' | 'short' | 'medium' | 'tall';
export type WeightBucket = 'all' | 'light' | 'medium' | 'heavy';

export const HEIGHT_LABELS: Record<HeightBucket, string> = {
  all: 'Qualquer altura',
  short: 'Baixo (até 1m)',
  medium: 'Médio (1m – 2m)',
  tall: 'Alto (acima de 2m)',
};

export const WEIGHT_LABELS: Record<WeightBucket, string> = {
  all: 'Qualquer peso',
  light: 'Leve (até 25kg)',
  medium: 'Médio (25kg – 100kg)',
  heavy: 'Pesado (acima de 100kg)',
};

interface FiltersState {
  search: string;
  type: PokemonTypeName | null;
  generation: number | null;
  height: HeightBucket;
  weight: WeightBucket;
  sort: SortOption;

  setSearch: (value: string) => void;
  setType: (type: PokemonTypeName | null) => void;
  setGeneration: (gen: number | null) => void;
  setHeight: (bucket: HeightBucket) => void;
  setWeight: (bucket: WeightBucket) => void;
  setSort: (sort: SortOption) => void;
  reset: () => void;
  /** Quantidade de filtros ativos (fora busca e ordenação). */
  activeCount: () => number;
}

const initial = {
  search: '',
  type: null as PokemonTypeName | null,
  generation: null as number | null,
  height: 'all' as HeightBucket,
  weight: 'all' as WeightBucket,
  sort: 'number-asc' as SortOption,
};

/**
 * Filtros e ordenação. As preferências (tipo, geração, altura, peso e
 * ordenação) persistem em localStorage; a busca é reiniciada a cada sessão.
 */
export const useFiltersStore = create<FiltersState>()(
  persist(
    (set, get) => ({
      ...initial,
      setSearch: (search) => set({ search }),
      setType: (type) => set({ type }),
      setGeneration: (generation) => set({ generation }),
      setHeight: (height) => set({ height }),
      setWeight: (weight) => set({ weight }),
      setSort: (sort) => set({ sort }),
      reset: () => set({ ...initial, search: get().search }),
      activeCount: () => {
        const { type, generation, height, weight } = get();
        return (
          (type ? 1 : 0) +
          (generation ? 1 : 0) +
          (height !== 'all' ? 1 : 0) +
          (weight !== 'all' ? 1 : 0)
        );
      },
    }),
    {
      name: 'pokedex:filters',
      // busca não é persistida — só as preferências de filtro/ordenação
      partialize: ({ type, generation, height, weight, sort }) => ({
        type,
        generation,
        height,
        weight,
        sort,
      }),
    },
  ),
);
