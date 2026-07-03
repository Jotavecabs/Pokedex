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
import {
  getCachedTranslation,
  setCachedTranslation,
  translateToPtBr,
} from '@/lib/translate';
import type {
  PokemonSpecies,
  PokemonSummary,
  PokemonTypeName,
} from '@/types/pokemon';

export const queryKeys = {
  index: ['pokemon-index'] as const,
  pokemon: (idOrName: number | string) => ['pokemon', idOrName] as const,
  species: (idOrName: number | string) => ['species', idOrName] as const,
  evolution: (id: number) => ['evolution', id] as const,
  typeIndex: (type: PokemonTypeName) => ['type-index', type] as const,
};

export function usePokemonIndex() {
  return useQuery({
    queryKey: queryKeys.index,
    queryFn: ({ signal }) => getPokemonIndex(signal),
  });
}

export function usePokemon(idOrName: number | string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.pokemon(idOrName),
    queryFn: ({ signal }) => getPokemon(idOrName, signal),
    enabled: enabled && idOrName !== undefined && idOrName !== '',
  });
}

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

// cada id vira uma query própria — cards já vistos vêm do cache
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

export function useSpecies(idOrName: number | string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.species(idOrName),
    queryFn: ({ signal }) => getSpecies(idOrName, signal),
    enabled,
  });
}

// fraquezas: multiplica as relações de dano de cada tipo (2x, 0.5x, 0x)
export function useWeaknesses(types: PokemonTypeName[]): {
  weaknesses: PokemonTypeName[];
  isLoading: boolean;
} {
  const results = useQueries({
    queries: types.map((type) => ({
      queryKey: ['type-relations', type] as const,
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        getTypeDamageRelations(type, signal),
      staleTime: Infinity,
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

function cleanFlavorText(raw: string): string {
  return raw.replace(/[\f\n\r]+/g, ' ').replace(/POK[ée]MON/g, 'Pokémon').trim();
}

// descrição em pt-BR: usa pt se existir na API, senão traduz o inglês
// (cache em localStorage) e mantém o inglês enquanto isso
export function useFlavorTextPtBr(species: PokemonSpecies | undefined): string | null {
  const ptEntry = species?.flavor_text_entries.find((e) =>
    e.language.name.startsWith('pt'),
  );
  const enEntry = species?.flavor_text_entries.find(
    (e) => e.language.name === 'en',
  );
  const english = enEntry ? cleanFlavorText(enEntry.flavor_text) : null;

  const translation = useQuery({
    queryKey: ['flavor-pt', species?.id],
    queryFn: async ({ signal }) => {
      const cached = getCachedTranslation(species!.id);
      if (cached) return cached;
      const translated = await translateToPtBr(english!, signal);
      setCachedTranslation(species!.id, translated);
      return translated;
    },
    enabled: Boolean(species && english && !ptEntry),
    staleTime: Infinity,
    retry: 1,
  });

  if (!species) return null;
  if (ptEntry) return cleanFlavorText(ptEntry.flavor_text);
  return translation.data ?? english;
}

export function useEvolutionChain(url: string | undefined) {
  return useQuery({
    queryKey: queryKeys.evolution(url ? extractIdFromUrl(url) : 0),
    queryFn: ({ signal }) => getEvolutionChain(url as string, signal),
    enabled: Boolean(url),
  });
}
