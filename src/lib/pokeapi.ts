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

/** Sprite oficial (artwork) em alta, com fallback para o sprite padrão. */
const artwork = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

/** Erro tipado para falhas de rede/HTTP da PokeAPI. */
export class PokeApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'PokeApiError';
    this.status = status;
  }
}

/** Wrapper de fetch com genérico e checagem de status. */
async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new PokeApiError(
      `Falha ao buscar "${url}" (${res.status})`,
      res.status,
    );
  }
  return res.json() as Promise<T>;
}

/** Extrai o id numérico de uma URL da PokeAPI (…/pokemon/25/ → 25). */
export function extractIdFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? Number(match[1]) : 0;
}

const SPRITES_CDN =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

/**
 * URL do GIF 2D animado por id, sem precisar buscar o Pokémon:
 * geração V (pixel art) para ids antigos, Showdown para os demais.
 */
export function animatedSpriteUrl(id: number): string {
  return id <= 649
    ? `${SPRITES_CDN}/versions/generation-v/black-white/animated/${id}.gif`
    : `${SPRITES_CDN}/other/showdown/${id}.gif`;
}

/** Sprite 2D pixelado estático (96x96) — usado nos cards da listagem. */
export function staticSpriteUrl(id: number): string {
  return `${SPRITES_CDN}/${id}.png`;
}

/**
 * Ícone de menu (pixel art de baixa resolução) — usado nos iniciais
 * da tela de Regiões. Não cobre a geração IX (usar staticSpriteUrl
 * como fallback via onError).
 */
export function menuSpriteUrl(id: number): string {
  return `${SPRITES_CDN}/versions/generation-viii/icons/${id}.png`;
}

/**
 * Melhor sprite 2D animado disponível: GIF da geração V (pixel art) →
 * GIF do Showdown → sprite estático → artwork. Sempre retorna algo exibível.
 */
export function getAnimatedSprite(pokemon: Pokemon): string {
  return (
    pokemon.sprites.versions?.['generation-v']?.['black-white']?.animated
      ?.front_default ??
    pokemon.sprites.other?.showdown?.front_default ??
    pokemon.sprites.front_default ??
    artwork(pokemon.id)
  );
}

/** Converte o Pokémon cru no modelo enxuto usado nos cards. */
export function toSummary(pokemon: Pokemon): PokemonSummary {
  return {
    id: pokemon.id,
    name: pokemon.name,
    types: pokemon.types.map((t) => t.type.name),
    // sprite 2D pixelado estático — o GIF animado fica só na página de detalhes
    sprite: pokemon.sprites.front_default ?? artwork(pokemon.id),
    height: pokemon.height,
    weight: pokemon.weight,
  };
}

/** Página da Pokédex (lista de referências {name,url}). */
export function getPokemonPage(
  limit: number,
  offset: number,
  signal?: AbortSignal,
): Promise<PaginatedResponse> {
  return request(`/pokemon?limit=${limit}&offset=${offset}`, signal);
}

/** Detalhe completo de um Pokémon por id ou nome. */
export function getPokemon(
  idOrName: number | string,
  signal?: AbortSignal,
): Promise<Pokemon> {
  return request(`/pokemon/${idOrName}`, signal);
}

/** Busca vários Pokémons em paralelo e devolve os resumos já ordenados por id. */
export async function getPokemonSummaries(
  idsOrNames: Array<number | string>,
  signal?: AbortSignal,
): Promise<PokemonSummary[]> {
  const results = await Promise.all(
    idsOrNames.map((id) => getPokemon(id, signal).then(toSummary)),
  );
  return results.sort((a, b) => a.id - b.id);
}

/** Espécie: fonte de geração e da URL da cadeia evolutiva. */
export function getSpecies(
  idOrName: number | string,
  signal?: AbortSignal,
): Promise<PokemonSpecies> {
  return request(`/pokemon-species/${idOrName}`, signal);
}

/** Cadeia evolutiva completa. */
export function getEvolutionChain(
  urlOrId: string | number,
  signal?: AbortSignal,
): Promise<EvolutionChain> {
  return request(
    typeof urlOrId === 'number' ? `/evolution-chain/${urlOrId}` : urlOrId,
    signal,
  );
}

/** Relações de dano de um tipo — usadas para calcular fraquezas. */
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

/** Todos os Pokémons de um tipo (para o filtro por tipo). */
export async function getPokemonNamesByType(
  type: PokemonTypeName,
  signal?: AbortSignal,
): Promise<NamedAPIResource[]> {
  const data = await request<{
    pokemon: Array<{ pokemon: NamedAPIResource }>;
  }>(`/type/${type}`, signal);
  return data.pokemon.map((p) => p.pokemon);
}

/** Índice completo (nome+id) de toda a Pokédex — usado na busca global. */
export async function getPokemonIndex(
  signal?: AbortSignal,
): Promise<Array<{ id: number; name: string }>> {
  const data = await getPokemonPage(20000, 0, signal);
  return data.results
    .map((r) => ({ id: extractIdFromUrl(r.url), name: r.name }))
    .filter((p) => p.id > 0);
}
