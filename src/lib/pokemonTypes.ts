import type { PokemonTypeName } from '@/types/pokemon';

/**
 * Metadados de cada tipo: rótulo em português e cor exata do Figma
 * (variáveis "Elementos/*"). Fonte única de verdade para badges,
 * fundo dos cards e o modal de filtro.
 */
export interface PokemonTypeMeta {
  /** Nome exibido na UI (pt-BR). */
  label: string;
  /** Cor sólida do tipo (badge, quadrado do sprite, pill do filtro). */
  color: string;
  /** Se o texto sobre a cor sólida deve ser claro ou escuro. */
  textOnColor: 'light' | 'dark';
}

export const POKEMON_TYPES: Record<PokemonTypeName, PokemonTypeMeta> = {
  normal: { label: 'Normal', color: '#919AA2', textOnColor: 'dark' },
  fire: { label: 'Fogo', color: '#FF9D55', textOnColor: 'dark' },
  water: { label: 'Água', color: '#5090D6', textOnColor: 'light' },
  electric: { label: 'Elétrico', color: '#F4D23C', textOnColor: 'dark' },
  grass: { label: 'Grama', color: '#63BC5A', textOnColor: 'dark' },
  ice: { label: 'Gelo', color: '#73CEC0', textOnColor: 'dark' },
  fighting: { label: 'Lutador', color: '#CE416B', textOnColor: 'light' },
  poison: { label: 'Venenoso', color: '#B567CE', textOnColor: 'light' },
  ground: { label: 'Terrestre', color: '#D97845', textOnColor: 'light' },
  flying: { label: 'Voador', color: '#89AAE3', textOnColor: 'dark' },
  psychic: { label: 'Psíquico', color: '#FA7179', textOnColor: 'dark' },
  bug: { label: 'Inseto', color: '#91C12F', textOnColor: 'dark' },
  rock: { label: 'Pedra', color: '#C5B78C', textOnColor: 'dark' },
  ghost: { label: 'Fantasma', color: '#5269AD', textOnColor: 'light' },
  dragon: { label: 'Dragão', color: '#0B6DC3', textOnColor: 'light' },
  dark: { label: 'Noturno', color: '#5A5465', textOnColor: 'light' },
  steel: { label: 'Metal', color: '#5A8EA2', textOnColor: 'light' },
  fairy: { label: 'Fada', color: '#EC8FE6', textOnColor: 'dark' },
};

/** Lista ordenada de tipos (para o filtro), em ordem alfabética pt-BR. */
export const POKEMON_TYPE_LIST = (
  Object.keys(POKEMON_TYPES) as PokemonTypeName[]
).sort((a, b) => POKEMON_TYPES[a].label.localeCompare(POKEMON_TYPES[b].label, 'pt-BR'));

/** Cor do tipo primário (usada no quadrado do sprite e fundo do card). */
export function getPrimaryTypeColor(types: PokemonTypeName[]): string {
  const first = types[0];
  return first ? POKEMON_TYPES[first].color : '#919AA2';
}
