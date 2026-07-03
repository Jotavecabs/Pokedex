import type { PokemonTypeName } from '@/types/pokemon';

export interface PokemonTypeMeta {
  label: string;
  color: string;
  textOnColor: 'light' | 'dark';
}

// nomes em pt-BR e cores exatas do design
export const POKEMON_TYPES: Record<PokemonTypeName, PokemonTypeMeta> = {
  normal: { label: 'Normal', color: '#919AA2', textOnColor: 'dark' },
  fire: { label: 'Fogo', color: '#FF9D55', textOnColor: 'dark' },
  water: { label: 'Água', color: '#5090D6', textOnColor: 'dark' },
  electric: { label: 'Elétrico', color: '#F4D23C', textOnColor: 'dark' },
  grass: { label: 'Grama', color: '#63BC5A', textOnColor: 'dark' },
  ice: { label: 'Gelo', color: '#73CEC0', textOnColor: 'dark' },
  fighting: { label: 'Lutador', color: '#CE416B', textOnColor: 'dark' },
  poison: { label: 'Venenoso', color: '#B567CE', textOnColor: 'dark' },
  ground: { label: 'Terrestre', color: '#D97845', textOnColor: 'dark' },
  flying: { label: 'Voador', color: '#89AAE3', textOnColor: 'dark' },
  psychic: { label: 'Psíquico', color: '#FA7179', textOnColor: 'dark' },
  bug: { label: 'Inseto', color: '#91C12F', textOnColor: 'dark' },
  rock: { label: 'Pedra', color: '#C5B78C', textOnColor: 'dark' },
  ghost: { label: 'Fantasma', color: '#5269AD', textOnColor: 'dark' },
  dragon: { label: 'Dragão', color: '#0B6DC3', textOnColor: 'dark' },
  dark: { label: 'Noturno', color: '#5A5465', textOnColor: 'dark' },
  steel: { label: 'Metal', color: '#5A8EA2', textOnColor: 'dark' },
  fairy: { label: 'Fada', color: '#EC8FE6', textOnColor: 'dark' },
};

export const POKEMON_TYPE_LIST = (
  Object.keys(POKEMON_TYPES) as PokemonTypeName[]
).sort((a, b) => POKEMON_TYPES[a].label.localeCompare(POKEMON_TYPES[b].label, 'pt-BR'));

export function getPrimaryTypeColor(types: PokemonTypeName[]): string {
  const first = types[0];
  return first ? POKEMON_TYPES[first].color : '#919AA2';
}
