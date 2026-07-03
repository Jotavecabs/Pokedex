import { Link } from 'react-router-dom';
import { usePokemon, useEvolutionChain } from '@/api/queries';
import { Spinner } from '@/components/ui/Spinner';
import { ArrowDownIcon } from '@/components/ui/icons';
import { TypeIcon } from './TypeIcon';
import { capitalize, formatDexNumber } from '@/lib/format';
import { getPrimaryTypeColor } from '@/lib/pokemonTypes';
import { menuSpriteUrl, staticSpriteUrl } from '@/lib/pokeapi';
import { describeEvolution } from '@/lib/evolution';
import type { EvolutionChainLink } from '@/types/pokemon';

const ARROW_COLOR = '#173ea5';

function EvolutionStage({ name }: { name: string }) {
  const { data } = usePokemon(name);
  const types = data?.types.map((t) => t.type.name) ?? [];
  const primary = types[0];
  const color = data ? getPrimaryTypeColor(types) : '#e6e6e6';

  return (
    <Link
      to={data ? `/pokemon/${data.id}` : '#'}
      className="flex h-[76px] w-full max-w-[296px] items-center rounded-full border border-gray-100 transition-shadow hover:shadow-md"
    >
      <span
        className="relative grid h-[74px] w-[95px] shrink-0 place-items-center rounded-full"
        style={{ backgroundColor: color }}
      >
        {primary && (
          <TypeIcon type={primary} className="absolute h-[65px] w-[65px] text-white/40" />
        )}
        {data ? (
          <img
            src={menuSpriteUrl(data.id)}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = staticSpriteUrl(data.id);
            }}
            alt={capitalize(name)}
            className="absolute -bottom-1 left-1/2 w-[104px] max-w-none -translate-x-1/2 mb-2 [image-rendering:pixelated]"
          />
        ) : (
          <Spinner className="h-5 w-5" />
        )}
      </span>

      <span className="ml-3 flex flex-col gap-1">
        <span className="leading-tight">
          <span className="block text-base font-medium text-[#1a1a1a]">
            {capitalize(name)}
          </span>
          <span className="block text-xs text-[#4d4d4d]">
            {data ? formatDexNumber(data.id) : '…'}
          </span>
        </span>
        <span
          className="flex h-[13px] w-[140px] items-center justify-center rounded-full"
          style={{ backgroundColor: color }}
          aria-hidden
        >
          {primary && <TypeIcon type={primary} className="h-[10px] w-[10px] text-white" />}
        </span>
      </span>
    </Link>
  );
}

function EvolutionArrow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 py-1" style={{ color: ARROW_COLOR }}>
      <ArrowDownIcon className="h-8 w-6" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

function EvolutionNode({ node }: { node: EvolutionChainLink }) {
  return (
    <>
      <EvolutionStage name={node.species.name} />
      {node.evolves_to.map((child) => (
        <div key={child.species.name} className="flex w-full flex-col items-center gap-2">
          <EvolutionArrow label={describeEvolution(child.evolution_details)} />
          <EvolutionNode node={child} />
        </div>
      ))}
    </>
  );
}

export function EvolutionChainView({ chainUrl }: { chainUrl: string | undefined }) {
  const { data, isLoading } = useEvolutionChain(chainUrl);

  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <Spinner />
      </div>
    );
  }
  if (!data) return null;

  if (data.chain.evolves_to.length === 0) {
    return (
      <div className="rounded-[15px] border border-gray-100 p-6 text-center text-sm text-gray-400">
        Este Pokémon não evolui.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 rounded-[15px] border border-gray-100 px-4 py-6">
      <EvolutionNode node={data.chain} />
    </div>
  );
}
