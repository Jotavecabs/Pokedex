import { Link } from 'react-router-dom';
import { TypeBadge } from './TypeBadge';
import { TypeIcon } from './TypeIcon';
import { FavoriteButton } from './FavoriteButton';
import { getPrimaryTypeColor } from '@/lib/pokemonTypes';
import { formatDexNumber, capitalize } from '@/lib/format';
import { tint } from '@/lib/cn';
import type { PokemonSummary } from '@/types/pokemon';

interface PokemonCardProps {
  pokemon: PokemonSummary;
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const primaryType = pokemon.types[0];
  const color = getPrimaryTypeColor(pokemon.types);

  return (
    <Link
      to={`/pokemon/${pokemon.id}`}
      className="group relative flex h-[102px] overflow-hidden rounded-[15px] transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-800"
      style={{ backgroundColor: tint(color) }}
    >
      {/* Infos */}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 pl-4 pr-2">
        <div className="leading-tight">
          <p className="text-xs font-semibold text-gray-800">
            {formatDexNumber(pokemon.id)}
          </p>
          <p className="truncate text-[21px] font-semibold text-black">
            {capitalize(pokemon.name)}
          </p>
        </div>
        <div className="flex flex-wrap gap-1">
          {pokemon.types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </div>
      </div>

      {/* Sprite sobre a cor do tipo */}
      <div
        className="relative grid w-[126px] shrink-0 place-items-center overflow-hidden rounded-[15px]"
        style={{ backgroundColor: color }}
      >
        {primaryType && (
          <TypeIcon
            type={primaryType}
            whiteGradient
            className="absolute h-[94px] w-[94px]"
          />
        )}
        <img
          src={pokemon.sprite}
          alt={capitalize(pokemon.name)}
          loading="lazy"
          className="relative h-[94px] w-[94px] object-contain [image-rendering:pixelated] transition-transform duration-200 group-hover:scale-110"
        />
      </div>

      <FavoriteButton
        id={pokemon.id}
        variant="ghost"
        size={16}
        className="absolute right-2 top-2 h-8 w-8"
      />
    </Link>
  );
}
