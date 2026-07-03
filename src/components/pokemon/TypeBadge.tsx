import { POKEMON_TYPES } from '@/lib/pokemonTypes';
import { cn } from '@/lib/cn';
import { TypeIcon } from './TypeIcon';
import type { PokemonTypeName } from '@/types/pokemon';

interface TypeBadgeProps {
  type: PokemonTypeName;
  size?: 'sm' | 'md';
}

export function TypeBadge({ type, size = 'sm' }: TypeBadgeProps) {
  const meta = POKEMON_TYPES[type];
  const sm = size === 'sm';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        meta.textOnColor === 'light' ? 'text-white' : 'text-black',
        sm ? 'gap-1.5 py-[3px] pl-[3px] pr-2.5 text-[11px]' : 'gap-2 py-1 pl-1 pr-3 text-sm',
      )}
      style={{ backgroundColor: meta.color }}
    >
      <span
        className={cn(
          'grid shrink-0 place-items-center rounded-full bg-white',
          sm ? 'h-5 w-5' : 'h-6 w-6',
        )}
        style={{ color: meta.color }}
      >
        <TypeIcon type={type} className={sm ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
      </span>
      {meta.label}
    </span>
  );
}
