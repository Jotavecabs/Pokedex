import { SearchBar } from '@/components/filters/SearchBar';
import { FilterControls } from '@/components/filters/FilterControls';
import { PokemonCard } from '@/components/pokemon/PokemonCard';
import { Spinner } from '@/components/ui/Spinner';
import { usePokemonList } from '@/hooks/usePokemonList';
import { useFiltersStore } from '@/store/filtersStore';
import { getRegionByGeneration } from '@/lib/regions';

export function HomePage() {
  const { summaries, isLoading, isError, isEmpty, hasMore, loadMore, total } =
    usePokemonList();
  const generation = useFiltersStore((s) => s.generation);
  const setGeneration = useFiltersStore((s) => s.setGeneration);
  const region = generation ? getRegionByGeneration(generation) : undefined;

  return (
    <>
      {/* Busca */}
      <header className="sticky top-0 z-30 border-b border-gray-50 bg-white px-4 py-4">
        <SearchBar />
      </header>

      <section className="px-4 py-4">
        {/* Filtros */}
        <div className="mb-4">
          <FilterControls />
        </div>

        {/* Região ativa */}
        {region && (
          <button
            type="button"
            onClick={() => setGeneration(null)}
            title="Remover filtro de região"
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-gray-800 py-1.5 pl-4 pr-3 text-xs font-semibold text-white hover:bg-black"
          >
            {region.name} — {region.generationId}º Geração
            <span aria-hidden className="text-sm leading-none">×</span>
          </button>
        )}

        {isError && (
          <p className="py-16 text-center text-sm text-rose-500">
            Ops! Não foi possível carregar os Pokémons. Verifique sua conexão e
            tente novamente.
          </p>
        )}

        {isEmpty && !isError && (
          <p className="py-16 text-center text-sm text-gray-400">
            Nenhum Pokémon encontrado com esses filtros.
          </p>
        )}

        {/* Listagem */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {summaries.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>

        {isLoading && (
          <div className="flex justify-center py-8">
            <Spinner className="h-8 w-8" />
          </div>
        )}

        {/* Carregar mais */}
        {!isLoading && hasMore && (
          <div className="flex flex-col items-center gap-2 py-6">
            <button
              type="button"
              onClick={loadMore}
              className="rounded-full bg-gray-800 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-black"
            >
              Carregar mais
            </button>
            <span className="text-xs text-gray-400">
              {summaries.length} de {total}
            </span>
          </div>
        )}
      </section>
    </>
  );
}
