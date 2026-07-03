import type {
  EvolutionChain,
  NamedAPIResource,
  PaginatedResponse,
  Pokemon,
  PokemonSpecies,
  PokemonSummary,
  PokemonTypeName,
  TypeDamageRelations,
} from '@/types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';
const SPRITES_CDN =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

const artwork = (id: number) =>
  `${SPRITES_CDN}/other/official-artwork/${id}.png`;

export class PokeApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'PokeApiError';
    this.status = status;
  }
}

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new PokeApiError(`Falha ao buscar "${url}" (${res.status})`, res.status);
  }
  return res.json() as Promise<T>;
}

export function extractIdFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? Number(match[1]) : 0;
}

// GIF animado por id: gen V para os antigos, Showdown para os demais
export function animatedSpriteUrl(id: number): string {
  return id <= 649
    ? `${SPRITES_CDN}/versions/generation-v/black-white/animated/${id}.gif`
    : `${SPRITES_CDN}/other/showdown/${id}.gif`;
}

// sprite 2D estático usado nos cards
export function staticSpriteUrl(id: number): string {
  return `${SPRITES_CDN}/${id}.png`;
}

// ícone de menu (pixel art antigo) — não cobre a geração IX
export function menuSpriteUrl(id: number): string {
  return `${SPRITES_CDN}/versions/generation-viii/icons/${id}.png`;
}

export function getAnimatedSprite(pokemon: Pokemon): string {
  return (
    pokemon.sprites.versions?.['generation-v']?.['black-white']?.animated
      ?.front_default ??
    pokemon.sprites.other?.showdown?.front_default ??
    pokemon.sprites.front_default ??
    artwork(pokemon.id)
  );
}

export function toSummary(pokemon: Pokemon): PokemonSummary {
  return {
    id: pokemon.id,
    name: pokemon.name,
    types: pokemon.types.map((t) => t.type.name),
    sprite: pokemon.sprites.front_default ?? artwork(pokemon.id),
    height: pokemon.height,
    weight: pokemon.weight,
  };
}

export function getPokemonPage(
  limit: number,
  offset: number,
  signal?: AbortSignal,
): Promise<PaginatedResponse> {
  return request(`/pokemon?limit=${limit}&offset=${offset}`, signal);
}

export function getPokemon(
  idOrName: number | string,
  signal?: AbortSignal,
): Promise<Pokemon> {
  return request(`/pokemon/${idOrName}`, signal);
}

export async function getPokemonSummaries(
  idsOrNames: Array<number | string>,
  signal?: AbortSignal,
): Promise<PokemonSummary[]> {
  const results = await Promise.all(
    idsOrNames.map((id) => getPokemon(id, signal).then(toSummary)),
  );
  return results.sort((a, b) => a.id - b.id);
}

export function getSpecies(
  idOrName: number | string,
  signal?: AbortSignal,
): Promise<PokemonSpecies> {
  return request(`/pokemon-species/${idOrName}`, signal);
}

export function getEvolutionChain(
  urlOrId: string | number,
  signal?: AbortSignal,
): Promise<EvolutionChain> {
  return request(
    typeof urlOrId === 'number' ? `/evolution-chain/${urlOrId}` : urlOrId,
    signal,
  );
}

export async function getTypeDamageRelations(
  type: PokemonTypeName,
  signal?: AbortSignal,
): Promise<TypeDamageRelations> {
  const data = await request<{ damage_relations: TypeDamageRelations }>(
    `/type/${type}`,
    signal,
  );
  return data.damage_relations;
}

export async function getPokemonNamesByType(
  type: PokemonTypeName,
  signal?: AbortSignal,
): Promise<NamedAPIResource[]> {
  const data = await request<{
    pokemon: Array<{ pokemon: NamedAPIResource }>;
  }>(`/type/${type}`, signal);
  return data.pokemon.map((p) => p.pokemon);
}

export async function getPokemonIndex(
  signal?: AbortSignal,
): Promise<Array<{ id: number; name: string }>> {
  const data = await getPokemonPage(20000, 0, signal);
  return data.results
    .map((r) => ({ id: extractIdFromUrl(r.url), name: r.name }))
    .filter((p) => p.id > 0);
}
