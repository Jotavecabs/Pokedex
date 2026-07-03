import { useMemo } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import {
  getEvolutionChain,
  getPokemon,
  getPokemonIndex,
  getPokemonNamesByType,
  getSpecies,
  getTypeDamageRelations,
  extractIdFromUrl,
  toSummary,
} from '@/lib/pokeapi';
import { POKEMON_TYPES } from '@/lib/pokemonTypes';
import type { PokemonSummary, PokemonTypeName } from '@/types/pokemon';

/** Chaves de cache centralizadas — evita strings mágicas espalhadas. */
export const queryKeys = {
  index: ['pokemon-index'] as const,
  pokemon: (idOrName: number | string) => ['pokemon', idOrName] as const,
  species: (idOrName: number | string) => ['species', idOrName] as const,
  evolution: (id: number) => ['evolution', id] as const,
  typeIndex: (type: PokemonTypeName) => ['type-index', type] as const,
};

/** Índice completo da Pokédex (nome+id). Base para busca, ordenação e filtros. */
export function usePokemonIndex() {
  return useQuery({
    queryKey: queryKeys.index,
    queryFn: ({ signal }) => getPokemonIndex(signal),
  });
}

/** Detalhe de um Pokémon (cacheado por id, reusado em toda a app). */
export function usePokemon(idOrName: number | string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.pokemon(idOrName),
    queryFn: ({ signal }) => getPokemon(idOrName, signal),
    enabled: enabled && idOrName !== undefined && idOrName !== '',
  });
}

/** Ids de Pokémon pertencentes a um tipo (para o filtro por tipo). */
export function useTypeIndex(type: PokemonTypeName | null) {
  return useQuery({
    queryKey: type ? queryKeys.typeIndex(type) : ['type-index', 'none'],
    queryFn: ({ signal }) =>
      getPokemonNamesByType(type as PokemonTypeName, signal).then((refs) =>
        refs.map((r) => extractIdFromUrl(r.url)).filter((id) => id > 0),
      ),
    enabled: type !== null,
  });
}

/**
 * Busca os resumos de uma lista de ids. Cada id é uma query independente,
 * então cards já vistos vêm do cache ao paginar / voltar de outra tela.
 */
export function usePokemonSummaries(ids: number[]): {
  summaries: PokemonSummary[];
  isLoading: boolean;
  isError: boolean;
} {
  const results = useQueries({
    queries: ids.map((id) => ({
      queryKey: queryKeys.pokemon(id),
      queryFn: ({ signal }: { signal: AbortSignal }) => getPokemon(id, signal),
    })),
  });

  const summaries = results
    .map((r) => (r.data ? toSummary(r.data) : null))
    .filter((s): s is PokemonSummary => s !== null);

  return {
    summaries,
    isLoading: results.some((r) => r.isLoading),
    isError: results.some((r) => r.isError),
  };
}

/** Espécie (geração, cadeia evolutiva, descrição). */
export function useSpecies(idOrName: number | string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.species(idOrName),
    queryFn: ({ signal }) => getSpecies(idOrName, signal),
    enabled,
  });
}

/**
 * Fraquezas de um Pokémon: multiplica as relações de dano de cada um dos
 * seus tipos (2x, 0.5x, 0x) e devolve os tipos cujo resultado é > 1.
 */
export function useWeaknesses(types: PokemonTypeName[]): {
  weaknesses: PokemonTypeName[];
  isLoading: boolean;
} {
  const results = useQueries({
    queries: types.map((type) => ({
      queryKey: ['type-relations', type] as const,
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        getTypeDamageRelations(type, signal),
      staleTime: Infinity, // relações de tipo nunca mudam
    })),
  });

  const isLoading = results.some((r) => r.isLoading);
  const allLoaded = results.length > 0 && results.every((r) => r.data);

  const weaknesses = useMemo(() => {
    if (!allLoaded) return [];

    const multiplier = new Map<string, number>();
    const apply = (name: string, factor: number) =>
      multiplier.set(name, (multiplier.get(name) ?? 1) * factor);

    for (const { data } of results) {
      if (!data) continue;
      data.double_damage_from.forEach((t) => apply(t.name, 2));
      data.half_damage_from.forEach((t) => apply(t.name, 0.5));
      data.no_damage_from.forEach((t) => apply(t.name, 0));
    }

    return [...multiplier.entries()]
      .filter(([name, value]) => value > 1 && name in POKEMON_TYPES)
      .map(([name]) => name as PokemonTypeName)
      .sort((a, b) =>
        POKEMON_TYPES[a].label.localeCompare(POKEMON_TYPES[b].label, 'pt-BR'),
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allLoaded, types.join(',')]);

  return { weaknesses, isLoading };
}

/** Cadeia evolutiva a partir da URL vinda da espécie. */
export function useEvolutionChain(url: string | undefined) {
  return useQuery({
    queryKey: queryKeys.evolution(url ? extractIdFromUrl(url) : 0),
    queryFn: ({ signal }) => getEvolutionChain(url as string, signal),
    enabled: Boolean(url),
  });
}
