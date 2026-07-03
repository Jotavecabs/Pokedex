import { useFiltersStore } from '@/store/filtersStore';
import { SearchIcon } from '@/components/ui/icons';

/** Barra de busca por nome — pill com borda cinza, igual ao Figma. */
export function SearchBar() {
  const search = useFiltersStore((s) => s.search);
  const setSearch = useFiltersStore((s) => s.setSearch);

  return (
    <div className="flex h-12 w-full items-center gap-2 rounded-[30px] border-[1.5px] border-gray-200 px-4 focus-within:border-gray-800">
      <SearchIcon className="h-5 w-5 shrink-0 text-gray-400" />
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Procurar Pokémon..."
        aria-label="Procurar Pokémon"
        className="w-full bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
      />
    </div>
  );
}
