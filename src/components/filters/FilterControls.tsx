import { useState } from 'react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { ChevronDownIcon } from '@/components/ui/icons';
import { POKEMON_TYPES, POKEMON_TYPE_LIST } from '@/lib/pokemonTypes';
import { cn } from '@/lib/cn';
import {
  SORT_LABELS,
  useFiltersStore,
  type SortOption,
} from '@/store/filtersStore';

type Sheet = 'type' | 'sort' | null;

/** Botão-pill escuro do Figma ("Todos os tipos ⌄" / "Menor número ⌄"). */
function PillButton({
  label,
  onClick,
  active,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-[42px] flex-1 items-center justify-center gap-2 rounded-full bg-gray-800 px-4 text-[15px] font-semibold text-white transition-colors hover:bg-black',
        active && 'ring-2 ring-gray-800/30',
      )}
    >
      <span className="truncate">{label}</span>
      <ChevronDownIcon className="h-4 w-4 shrink-0" strokeWidth={2.5} />
    </button>
  );
}

/** Pill escura de opção dentro dos sheets (Figma). */
function DarkPill({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full bg-gray-800 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-black',
        selected && 'ring-2 ring-gray-800 ring-offset-2',
      )}
    >
      {label}
    </button>
  );
}

/** Os dois filtros da listagem (tipo + ordenação), fiéis ao Figma. */
export function FilterControls() {
  const [sheet, setSheet] = useState<Sheet>(null);
  const close = () => setSheet(null);

  const { type, sort, setType, setSort } = useFiltersStore();

  return (
    <>
      <div className="flex items-center gap-4 sm:max-w-md">
        <PillButton
          label={type ? POKEMON_TYPES[type].label : 'Todos os tipos'}
          active={type !== null}
          onClick={() => setSheet('type')}
        />
        <PillButton label={SORT_LABELS[sort]} onClick={() => setSheet('sort')} />
      </div>

      {/* Sheet: tipo (pills coloridas) */}
      <BottomSheet open={sheet === 'type'} onClose={close} title="Selecione o tipo">
        <div className="flex flex-col gap-2.5">
          <DarkPill
            label="Todos os tipos"
            selected={type === null}
            onClick={() => {
              setType(null);
              close();
            }}
          />
          {POKEMON_TYPE_LIST.map((t) => {
            const meta = POKEMON_TYPES[t];
            return (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setType(t);
                  close();
                }}
                className={cn(
                  'rounded-full py-3 text-center text-sm font-semibold',
                  meta.textOnColor === 'light' ? 'text-white' : 'text-black',
                  type === t && 'ring-2 ring-gray-800 ring-offset-2',
                )}
                style={{ backgroundColor: meta.color }}
              >
                {meta.label}
              </button>
            );
          })}
        </div>
      </BottomSheet>

      {/* Sheet: ordenação (pills escuras) */}
      <BottomSheet open={sheet === 'sort'} onClose={close} title="Selecione a ordem">
        <div className="flex flex-col gap-2.5">
          {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
            <DarkPill
              key={option}
              label={SORT_LABELS[option]}
              selected={sort === option}
              onClick={() => {
                setSort(option);
                close();
              }}
            />
          ))}
        </div>
      </BottomSheet>
    </>
  );
}
