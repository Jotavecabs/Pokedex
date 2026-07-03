// Tipos dos dados consumidos da PokeAPI (https://pokeapi.co)

export type PokemonTypeName =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy';

export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface PaginatedResponse<T = NamedAPIResource> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface PokemonTypeSlot {
  slot: number;
  type: NamedAPIResource & { name: PokemonTypeName };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: NamedAPIResource;
}

export interface PokemonAbility {
  is_hidden: boolean;
  slot: number;
  ability: NamedAPIResource;
}

export interface PokemonSprites {
  front_default: string | null;
  other?: {
    'official-artwork'?: {
      front_default: string | null;
    };
    home?: {
      front_default: string | null;
    };
    showdown?: {
      front_default: string | null;
    };
  };
  versions?: {
    'generation-v'?: {
      'black-white'?: {
        animated?: {
          front_default: string | null;
        };
      };
    };
  };
}

export interface Pokemon {
  id: number;
  name: string;
  height: number; // decímetros
  weight: number; // hectogramas
  base_experience: number;
  order: number;
  types: PokemonTypeSlot[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  sprites: PokemonSprites;
  species: NamedAPIResource;
}

export type StatName =
  | 'hp'
  | 'attack'
  | 'defense'
  | 'special-attack'
  | 'special-defense'
  | 'speed';

export interface PokemonSpecies {
  id: number;
  name: string;
  generation: NamedAPIResource;
  evolution_chain: { url: string };
  gender_rate: number; // proporção de fêmeas em oitavos; -1 = sem gênero
  genera: Array<{
    genus: string;
    language: NamedAPIResource;
  }>;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: NamedAPIResource;
    version: NamedAPIResource;
  }>;
}

export interface EvolutionDetail {
  trigger: NamedAPIResource;
  min_level: number | null;
  min_happiness: number | null;
  item: NamedAPIResource | null;
  held_item: NamedAPIResource | null;
  time_of_day: string;
}

export interface EvolutionChainLink {
  species: NamedAPIResource;
  evolution_details: EvolutionDetail[];
  evolves_to: EvolutionChainLink[];
}

export interface EvolutionChain {
  id: number;
  chain: EvolutionChainLink;
}

export interface TypeDamageRelations {
  double_damage_from: NamedAPIResource[];
  half_damage_from: NamedAPIResource[];
  no_damage_from: NamedAPIResource[];
}

// modelo enxuto que a UI consome nos cards
export interface PokemonSummary {
  id: number;
  name: string;
  types: PokemonTypeName[];
  sprite: string;
  height: number;
  weight: number;
}
