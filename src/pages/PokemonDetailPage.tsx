import type { ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  useFlavorTextPtBr,
  usePokemon,
  useSpecies,
  useWeaknesses,
} from '@/api/queries';
import { FavoriteButton } from '@/components/pokemon/FavoriteButton';
import { TypeBadge } from '@/components/pokemon/TypeBadge';
import { TypeIcon } from '@/components/pokemon/TypeIcon';
import { StatBar } from '@/components/pokemon/StatBar';
import { EvolutionChainView } from '@/components/pokemon/EvolutionChain';
import {
  ArrowLeftIcon,
  GridIcon,
  PokeballIcon,
  RulerIcon,
  ScaleIcon,
  WeightIcon,
} from '@/components/ui/icons';
import { Spinner } from '@/components/ui/Spinner';
import { useCompareStore } from '@/store/compareStore';
import { getPrimaryTypeColor } from '@/lib/pokemonTypes';
import {
  capitalize,
  formatDexNumber,
  formatHeight,
  formatWeight,
  STAT_LABELS,
} from '@/lib/format';
import { cn } from '@/lib/cn';
import type { PokemonSpecies, StatName } from '@/types/pokemon';

const MALE_COLOR = '#2551c3';
const FEMALE_COLOR = '#ff7596';

// "Fairy Pokémon" → "Fairy"
function getCategory(species: PokemonSpecies | undefined): string | null {
  const genus = species?.genera.find((g) => g.language.name === 'en')?.genus;
  return genus ? genus.replace(/ Pokémon$/i, '') : null;
}

export function PokemonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: pokemon, isLoading, isError } = usePokemon(id ?? '', Boolean(id));
  const { data: species } = useSpecies(id ?? '', Boolean(id));

  const types = pokemon?.types.map((t) => t.type.name) ?? [];
  const { weaknesses } = useWeaknesses(types);
  const flavor = useFlavorTextPtBr(species);

  const toggleCompare = useCompareStore((s) => s.toggle);
  const inCompare = useCompareStore((s) =>
    id ? s.ids.includes(Number(id)) : false,
  );

  if (isLoading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  if (isError || !pokemon) {
    return (
      <div className="grid min-h-[60vh] place-items-center gap-4 px-4 text-center">
        <p className="text-gray-500">Pokémon não encontrado.</p>
        <Link to="/" className="rounded-full bg-gray-800 px-6 py-2 text-sm text-white">
          Voltar à Pokédex
        </Link>
      </div>
    );
  }

  const color = getPrimaryTypeColor(types);
  const category = getCategory(species);
  const femaleRatio = species && species.gender_rate >= 0 ? species.gender_rate / 8 : null;

  // gif animado do Showdown
  const showdownName = pokemon.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const customPixelSprite = `https://play.pokemonshowdown.com/sprites/ani/${showdownName}.gif`;

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="relative h-[307px] overflow-hidden bg-white">
        {/* Círculo com o gradiente do tipo */}
        <svg
          className="pointer-events-none absolute left-1/2 -translate-x-1/2"
          style={{
            bottom: 36,
            width: 'clamp(498px, 138vw, 1100px)',
            height: 'clamp(498px, 138vw, 1100px)',
          }}
          viewBox="0 0 498 498"
          aria-hidden
        >
          <defs>
            <linearGradient
              id="pokemon-header-gradient"
              x1="140.5"
              y1="208"
              x2="370.5"
              y2="498"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={color} />
              <stop offset="1" stopColor={color} stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <circle cx="249" cy="249" r="249" fill="url(#pokemon-header-gradient)" />
        </svg>

        {/* Símbolo do tipo */}
        {types[0] && (
          <TypeIcon
            type={types[0]}
            className="pointer-events-none absolute left-1/2 top-[35px] h-[204px] w-[204px] -translate-x-1/2 text-white/60"
          />
        )}

        {/* Sprite */}
        <img
          src={customPixelSprite}
          alt={capitalize(pokemon.name)}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = pokemon.sprites.front_default ?? '';
          }}
          className="absolute mt-12 left-1/2 top-[60px] h-[190px] w-[190px] -translate-x-1/2 object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)] [image-rendering:pixelated]"
        />

        {/* Ícones: voltar + favoritar */}
        <div className="absolute inset-x-4 top-[19px] flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Voltar"
            className="grid h-[38px] border-black w-[38px] place-items-center rounded-[5px] text-white drop-shadow hover:bg-white/20"
          >
            <ArrowLeftIcon className="h-6 w-6" strokeWidth={2.5} />
          </button>
          <FavoriteButton
            id={pokemon.id}
            variant="bare"
            size={28}
            className="h-[38px] w-[38px]"
          />
        </div>
      </div>

      {/* Dados */}
      <div className="flex flex-col gap-6 px-4 pt-[18px]">
        {/* Nome + número */}
        <header className="leading-tight">
          <h1 className="text-[32px] font-medium text-black">
            {capitalize(pokemon.name)}
          </h1>
          <p className="text-base text-black/70">{formatDexNumber(pokemon.id)}</p>
        </header>

        {/* Tipos */}
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <TypeBadge key={type} type={type} size="md" />
          ))}
        </div>

        {/* Descrição */}
        {flavor && (
          <div className="flex flex-col gap-5">
            <p className="text-sm leading-[1.45] text-black/70">{flavor}</p>
            <hr className="border-black/10" />
          </div>
        )}

        {/* Características */}
        <div className="grid grid-cols-2 gap-5">
          <InfoBox icon={<WeightIcon className="h-4 w-4" />} label="Peso">
            {formatWeight(pokemon.weight)}
          </InfoBox>
          <InfoBox icon={<RulerIcon className="h-4 w-4" />} label="Altura">
            {formatHeight(pokemon.height)}
          </InfoBox>
          <InfoBox icon={<GridIcon className="h-4 w-4" />} label="Categoria">
            {category ?? '—'}
          </InfoBox>
          <InfoBox icon={<PokeballIcon className="h-4 w-4" />} label="Habilidade">
            {pokemon.abilities
              .filter((a) => !a.is_hidden)
              .map((a) => capitalize(a.ability.name))
              .join('\n') || '—'}
          </InfoBox>
        </div>

        {/* Gênero */}
        <section className="flex flex-col items-center gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.6px] text-black/70">
            Gênero
          </p>
          {femaleRatio === null ? (
            <p className="text-sm text-gray-400">Sem gênero</p>
          ) : (
            <div className="flex w-full flex-col gap-1.5">
              <div className="flex h-2 overflow-hidden rounded-full">
                <div
                  style={{
                    width: `${(1 - femaleRatio) * 100}%`,
                    backgroundColor: MALE_COLOR,
                  }}
                />
                <div
                  style={{ width: `${femaleRatio * 100}%`, backgroundColor: FEMALE_COLOR }}
                />
              </div>
              <div className="flex items-center justify-between text-xs font-medium text-black/70">
                <span className="flex items-center gap-1">
                  <span className="text-base leading-none" style={{ color: MALE_COLOR }}>♂</span>
                  {((1 - femaleRatio) * 100).toFixed(0)}%
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-base leading-none" style={{ color: FEMALE_COLOR }}>♀</span>
                  {(femaleRatio * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          )}
        </section>

        {/* Fraquezas */}
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-medium text-black">Fraquezas</h2>
          {weaknesses.length === 0 ? (
            <p className="text-sm text-gray-400">Carregando fraquezas…</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {weaknesses.map((type) => (
                <TypeBadge key={type} type={type} size="md" />
              ))}
            </div>
          )}
        </section>

        {/* Estatísticas base */}
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-medium text-black">Estatísticas</h2>
          <div className="space-y-2.5">
            {pokemon.stats.map((s) => (
              <StatBar
                key={s.stat.name}
                label={STAT_LABELS[s.stat.name as StatName] ?? s.stat.name}
                value={s.base_stat}
                color={color}
              />
            ))}
          </div>
        </section>

        {/* Evoluções */}
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-medium text-black">Evoluções</h2>
          <EvolutionChainView chainUrl={species?.evolution_chain.url} />
        </section>

        {/* Comparar */}
        <button
          type="button"
          onClick={() => toggleCompare(pokemon.id)}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-medium transition-colors',
            inCompare ? 'bg-gray-100 text-gray-600' : 'text-white',
          )}
          style={inCompare ? undefined : { backgroundColor: color }}
        >
          <ScaleIcon className="h-5 w-5" />
          {inCompare ? 'Remover da comparação' : 'Adicionar à comparação'}
        </button>
      </div>
    </div>
  );
}

function InfoBox({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.6px] text-black/60">
        {icon}
        {label}
      </p>
      <div className="grid min-h-[47px] place-items-center whitespace-pre-line rounded-[15px] border border-black/10 p-2 text-center text-lg font-medium text-black/90">
        {children}
      </div>
    </div>
  );
}