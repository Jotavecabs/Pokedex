/**
 * Tipagem forte dos dados consumidos da PokeAPI (https://pokeapi.co).
 * Modelamos apenas os campos que a aplicação usa — evitando `any` e
 * mantendo os contratos explícitos.
 */

/** Os 18 tipos elementais existentes. Usado como união literal, não `string`. */
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

/** Referência genérica `{ name, url }` que a PokeAPI usa em toda parte. */
export interface NamedAPIResource {
  name: string;
  url: string;
}

/** Resposta paginada padrão da PokeAPI. */
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
    /** GIF animado estilo Pokémon Showdown. */
    showdown?: {
      front_default: string | null;
    };
  };
  versions?: {
    'generation-v'?: {
      'black-white'?: {
        /** GIFs 2D animados em pixel art (apenas ids ≤ 649). */
        animated?: {
          front_default: string | null;
        };
      };
    };
  };
}

/** Detalhe completo de um Pokémon (endpoint /pokemon/{id}). */
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

/** Nomes canônicos das 6 estatísticas base. */
export type StatName =
  | 'hp'
  | 'attack'
  | 'defense'
  | 'special-attack'
  | 'special-defense'
  | 'speed';

/** Espécie (endpoint /pokemon-species/{id}) — usada para geração e evolução. */
export interface PokemonSpecies {
  id: number;
  name: string;
  generation: NamedAPIResource;
  evolution_chain: { url: string };
  /** Proporção de fêmeas em oitavos (0–8); -1 = sem gênero. */
  gender_rate: number;
  /** Categoria ("Fairy Pokémon", "Seed Pokémon"…) por idioma. */
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

/** Condições de uma evolução (nível, item, felicidade, troca…). */
export interface EvolutionDetail {
  trigger: NamedAPIResource;
  min_level: number | null;
  min_happiness: number | null;
  item: NamedAPIResource | null;
  held_item: NamedAPIResource | null;
  time_of_day: string;
}

/** Nó recursivo da cadeia evolutiva (endpoint /evolution-chain/{id}). */
export interface EvolutionChainLink {
  species: NamedAPIResource;
  evolution_details: EvolutionDetail[];
  evolves_to: EvolutionChainLink[];
}

/** Relações de dano de um tipo (endpoint /type/{name}) — base das fraquezas. */
export interface TypeDamageRelations {
  double_damage_from: NamedAPIResource[];
  half_damage_from: NamedAPIResource[];
  no_damage_from: NamedAPIResource[];
}

export interface EvolutionChain {
  id: number;
  chain: EvolutionChainLink;
}

/**
 * Modelo "achatado" que a UI consome — derivado do `Pokemon` cru.
 * Mantém só o essencial para os cards e listagens.
 */
export interface PokemonSummary {
  id: number;
  name: string;
  types: PokemonTypeName[];
  sprite: string;
  height: number;
  weight: number;
}
