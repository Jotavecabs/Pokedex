import { useEffect, useMemo, useState } from 'react';
import { useFiltersStore } from '@/store/filtersStore';
import type { HeightBucket, WeightBucket } from '@/store/filtersStore';
import { usePokemonIndex, usePokemonSummaries, useTypeIndex } from '@/api/queries';
import { isInGeneration } from '@/lib/generations';
import { useDebounce } from './useDebounce';
import type { PokemonSummary } from '@/types/pokemon';

/** Quantos cards carregar por vez ("Carregar mais"). */
export const PAGE_SIZE = 24;

function matchesHeight(summary: PokemonSummary, bucket: HeightBucket): boolean {
  const meters = summary.height / 10;
  switch (bucket) {
    case 'short':
      return meters <= 1;
    case 'medium':
      return meters > 1 && meters <= 2;
    case 'tall':
      return meters > 2;
    default:
      return true;
  }
}

function matchesWeight(summary: PokemonSummary, bucket: WeightBucket): boolean {
  const kg = summary.weight / 10;
  switch (bucket) {
    case 'light':
      return kg <= 25;
    case 'medium':
      return kg > 25 && kg <= 100;
    case 'heavy':
      return kg > 100;
    default:
      return true;
  }
}

export interface UsePokemonListResult {
  summaries: PokemonSummary[];
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  hasMore: boolean;
  loadMore: () => void;
  total: number;
}

/**
 * Orquestra listagem + busca + filtros (tipo, geração, altura, peso) +
 * ordenação + "carregar mais". Os filtros baratos (nome, tipo, geração,
 * ordenação) reduzem a lista de ids ANTES de buscar detalhes; altura e peso,
 * que dependem do detalhe, são aplicados sobre os já carregados.
 */
export function usePokemonList(): UsePokemonListResult {
  const { search, type, generation, height, weight, sort } = useFiltersStore();
  const debouncedSearch = useDebounce(search.trim().toLowerCase(), 300);

  const indexQuery = usePokemonIndex();
  const typeQuery = useTypeIndex(type);

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Lista de ids candidatos após filtros "baratos" + ordenação.
  const candidateIds = useMemo(() => {
    const index = indexQuery.data ?? [];
    const nameById = new Map(index.map((p) => [p.id, p.name]));

    // Base: todos os ids, ou só os do tipo selecionado.
    let ids =
      type && typeQuery.data ? typeQuery.data.slice() : index.map((p) => p.id);

    if (generation) ids = ids.filter((id) => isInGeneration(id, generation));

    if (debouncedSearch) {
      ids = ids.filter((id) => {
        const name = nameById.get(id) ?? '';
        return name.includes(debouncedSearch) || String(id) === debouncedSearch;
      });
    }

    ids.sort((a, b) => {
      switch (sort) {
        case 'number-desc':
          return b - a;
        case 'name-asc':
          return (nameById.get(a) ?? '').localeCompare(nameById.get(b) ?? '');
        case 'name-desc':
          return (nameById.get(b) ?? '').localeCompare(nameById.get(a) ?? '');
        default:
          return a - b;
      }
    });

    return ids;
  }, [indexQuery.data, typeQuery.data, type, generation, debouncedSearch, sort]);

  // Reinicia a paginação sempre que os filtros mudam.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [candidateIds]);

  const visibleIds = useMemo(
    () => candidateIds.slice(0, visibleCount),
    [candidateIds, visibleCount],
  );

  const { summaries, isLoading, isError } = usePokemonSummaries(visibleIds);

  // Altura/peso dependem do detalhe → filtramos os já carregados.
  const filtered = useMemo(
    () =>
      summaries.filter(
        (s) => matchesHeight(s, height) && matchesWeight(s, weight),
      ),
    [summaries, height, weight],
  );

  const baseLoading =
    indexQuery.isLoading || (type !== null && typeQuery.isLoading);

  return {
    summaries: filtered,
    isLoading: baseLoading || (visibleIds.length > 0 && isLoading),
    isError: indexQuery.isError || typeQuery.isError || isError,
    isEmpty: !baseLoading && candidateIds.length === 0,
    hasMore: visibleCount < candidateIds.length,
    loadMore: () => setVisibleCount((c) => c + PAGE_SIZE),
    total: candidateIds.length,
  };
}
