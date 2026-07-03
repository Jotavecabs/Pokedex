import { useMemo, useState } from 'react';
import { useCompareStore, MAX_COMPARE } from '@/store/compareStore';
import { usePokemon, usePokemonIndex } from '@/api/queries';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { StatBar } from '@/components/pokemon/StatBar';
import { TypeBadge } from '@/components/pokemon/TypeBadge';
import { SearchIcon, ScaleIcon } from '@/components/ui/icons';
import { getPrimaryTypeColor } from '@/lib/pokemonTypes';
import {
  capitalize,
  formatDexNumber,
  formatHeight,
  formatWeight,
  STAT_LABELS,
} from '@/lib/format';
import { tint } from '@/lib/cn';
import type { Pokemon, StatName } from '@/types/pokemon';

const STAT_ORDER: StatName[] = [
  'hp',
  'attack',
  'defense',
  'special-attack',
  'special-defense',
  'speed',
];

export function ComparePage() {
  const ids = useCompareStore((s) => s.ids);
  const clear = useCompareStore((s) => s.clear);
  const [pickerOpen, setPickerOpen] = useState(false);

  const slots = Array.from({ length: MAX_COMPARE }, (_, i) => ids[i] ?? null);

  return (
    <div className="px-4 py-5">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Comparar</h1>
        {ids.length > 0 && (
          <button
            type="button"
            onClick={clear}
            className="text-sm text-gray-400 hover:text-rose-500"
          >
            Limpar
          </button>
        )}
      </header>

      {/* Slots */}
      <div className="grid grid-cols-2 gap-3">
        {slots.map((id, i) =>
          id ? (
            <CompareSlot key={id} id={id} />
          ) : (
            <button
              key={`empty-${i}`}
              type="button"
              onClick={() => setPickerOpen(true)}
              className="flex h-40 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-500"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gray-50 text-2xl">
                +
              </span>
              <span className="text-xs font-medium">Escolher Pokémon</span>
            </button>
          ),
        )}
      </div>

      {ids.length < 2 && (
        <p className="mt-4 flex items-center justify-center gap-2 text-center text-sm text-gray-400">
          <ScaleIcon className="h-4 w-4" />
          Selecione 2 Pokémons para comparar as estatísticas.
        </p>
      )}

      {ids.length === 2 && <Comparison ids={[ids[0], ids[1]]} />}

      <PokemonPicker open={pickerOpen} onClose={() => setPickerOpen(false)} />
    </div>
  );
}

function CompareSlot({ id }: { id: number }) {
  const { data } = usePokemon(id);
  const remove = useCompareStore((s) => s.remove);
  if (!data) {
    return <div className="h-40 animate-pulse rounded-2xl bg-gray-50" />;
  }
  const color = getPrimaryTypeColor(data.types.map((t) => t.type.name));
  const sprite = data.sprites.front_default ?? '';
  return (
    <div
      className="relative flex h-40 flex-col items-center justify-center rounded-2xl p-2"
      style={{ backgroundColor: tint(color, 16) }}
    >
      <button
        type="button"
        onClick={() => remove(id)}
        aria-label="Remover"
        className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-white/80 text-gray-500"
      >
        ×
      </button>
      <img
        src={sprite}
        alt={capitalize(data.name)}
        className="h-20 w-20 object-contain [image-rendering:pixelated]"
      />
      <p className="text-xs text-gray-500">{formatDexNumber(data.id)}</p>
      <p className="text-sm font-semibold text-gray-800">{capitalize(data.name)}</p>
    </div>
  );
}

// destaca o maior valor de cada estatística
function Comparison({ ids }: { ids: [number, number] }) {
  const a = usePokemon(ids[0]);
  const b = usePokemon(ids[1]);
  if (!a.data || !b.data) return null;

  const statOf = (p: Pokemon, name: StatName) =>
    p.stats.find((s) => s.stat.name === name)?.base_stat ?? 0;

  const totalA = a.data.stats.reduce((sum, s) => sum + s.base_stat, 0);
  const totalB = b.data.stats.reduce((sum, s) => sum + s.base_stat, 0);
  const colorA = getPrimaryTypeColor(a.data.types.map((t) => t.type.name));
  const colorB = getPrimaryTypeColor(b.data.types.map((t) => t.type.name));

  return (
    <div className="mt-6 space-y-5">
      <div className="grid grid-cols-2 gap-3 text-center text-xs text-gray-400">
        <div className="flex flex-wrap justify-center gap-1">
          {a.data.types.map((t) => (
            <TypeBadge key={t.type.name} type={t.type.name} />
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-1">
          {b.data.types.map((t) => (
            <TypeBadge key={t.type.name} type={t.type.name} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-center text-sm">
        <MeasureRow
          label="Altura"
          left={formatHeight(a.data.height)}
          right={formatHeight(b.data.height)}
        />
        <MeasureRow
          label="Peso"
          left={formatWeight(a.data.weight)}
          right={formatWeight(b.data.weight)}
        />
      </div>

      <section>
        <h2 className="mb-3 text-base font-semibold text-gray-800">Estatísticas</h2>
        <div className="space-y-4">
          {STAT_ORDER.map((name) => {
            const va = statOf(a.data!, name);
            const vb = statOf(b.data!, name);
            return (
              <div key={name} className="space-y-1">
                <p className="text-center text-xs font-medium text-gray-500">
                  {STAT_LABELS[name]}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div dir="rtl">
                    <StatBar label="" value={va} color={colorA} highlight={va >= vb} />
                  </div>
                  <StatBar label="" value={vb} color={colorB} highlight={vb >= va} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-center">
          <Total value={totalA} highlight={totalA >= totalB} />
          <Total value={totalB} highlight={totalB >= totalA} />
        </div>
      </section>
    </div>
  );
}

function MeasureRow({ label, left, right }: { label: string; left: string; right: string }) {
  return (
    <>
      <div className="rounded-xl bg-gray-50 py-2">
        <p className="font-semibold text-gray-800">{left}</p>
        <p className="text-xs text-gray-400">{label}</p>
      </div>
      <div className="rounded-xl bg-gray-50 py-2">
        <p className="font-semibold text-gray-800">{right}</p>
        <p className="text-xs text-gray-400">{label}</p>
      </div>
    </>
  );
}

function Total({ value, highlight }: { value: number; highlight: boolean }) {
  return (
    <div className={highlight ? 'font-bold text-gray-800' : 'text-gray-400'}>
      <p className="text-lg tabular-nums">{value}</p>
      <p className="text-xs">Total</p>
    </div>
  );
}

function PokemonPicker({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [term, setTerm] = useState('');
  const { data: index = [] } = usePokemonIndex();
  const toggle = useCompareStore((s) => s.toggle);
  const selected = useCompareStore((s) => s.ids);

  const results = useMemo(() => {
    const q = term.trim().toLowerCase();
    const base = q
      ? index.filter((p) => p.name.includes(q) || String(p.id) === q)
      : index;
    return base.slice(0, 40);
  }, [index, term]);

  return (
    <BottomSheet open={open} onClose={onClose} title="Escolher Pokémon">
      <div className="mb-3 flex h-11 items-center gap-2 rounded-full border-[1.5px] border-gray-200 px-4">
        <SearchIcon className="h-5 w-5 text-gray-400" />
        <input
          autoFocus
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Buscar por nome ou número..."
          className="w-full bg-transparent text-sm focus:outline-none"
        />
      </div>
      <ul className="flex flex-col gap-1">
        {results.map((p) => {
          const isSelected = selected.includes(p.id);
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => {
                  toggle(p.id);
                  onClose();
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-gray-50"
              >
                <span className="text-gray-800">{capitalize(p.name)}</span>
                <span className="text-xs text-gray-400">
                  {isSelected ? 'Selecionado' : formatDexNumber(p.id)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </BottomSheet>
  );
}
