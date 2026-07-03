import type { StatName } from '@/types/pokemon';

/** "Nº001", "Nº025"… número da Pokédex com zero à esquerda. */
export function formatDexNumber(id: number): string {
  return `Nº${String(id).padStart(3, '0')}`;
}

/** Primeira letra maiúscula; trata nomes com hífen (ex.: "mr-mime"). */
export function capitalize(value: string): string {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/** PokeAPI dá altura em decímetros → metros (vírgula decimal, como no Figma). */
export function formatHeight(decimeters: number): string {
  return `${(decimeters / 10).toFixed(1).replace('.', ',')} m`;
}

/** PokeAPI dá peso em hectogramas → quilogramas (vírgula decimal). */
export function formatWeight(hectograms: number): string {
  return `${(hectograms / 10).toFixed(1).replace('.', ',')} kg`;
}

/** Rótulos pt-BR das 6 estatísticas base. */
export const STAT_LABELS: Record<StatName, string> = {
  hp: 'HP',
  attack: 'Ataque',
  defense: 'Defesa',
  'special-attack': 'Atq. Esp.',
  'special-defense': 'Def. Esp.',
  speed: 'Velocidade',
};
