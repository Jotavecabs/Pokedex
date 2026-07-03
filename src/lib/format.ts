import type { StatName } from '@/types/pokemon';

// "Nº001", "Nº025"...
export function formatDexNumber(id: number): string {
  return `Nº${String(id).padStart(3, '0')}`;
}

export function capitalize(value: string): string {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

// decímetros → metros
export function formatHeight(decimeters: number): string {
  return `${(decimeters / 10).toFixed(1).replace('.', ',')} m`;
}

// hectogramas → quilogramas
export function formatWeight(hectograms: number): string {
  return `${(hectograms / 10).toFixed(1).replace('.', ',')} kg`;
}

export const STAT_LABELS: Record<StatName, string> = {
  hp: 'HP',
  attack: 'Ataque',
  defense: 'Defesa',
  'special-attack': 'Atq. Esp.',
  'special-defense': 'Def. Esp.',
  speed: 'Velocidade',
};
