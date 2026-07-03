// Faixas de id da Pokédex nacional por geração

export interface Generation {
  id: number;
  label: string;
  range: [min: number, max: number];
}

export const GENERATIONS: Generation[] = [
  { id: 1, label: 'Geração I', range: [1, 151] },
  { id: 2, label: 'Geração II', range: [152, 251] },
  { id: 3, label: 'Geração III', range: [252, 386] },
  { id: 4, label: 'Geração IV', range: [387, 493] },
  { id: 5, label: 'Geração V', range: [494, 649] },
  { id: 6, label: 'Geração VI', range: [650, 721] },
  { id: 7, label: 'Geração VII', range: [722, 809] },
  { id: 8, label: 'Geração VIII', range: [810, 905] },
  { id: 9, label: 'Geração IX', range: [906, 1025] },
];

export function getGenerationById(id: number): Generation | undefined {
  return GENERATIONS.find((g) => g.id === id);
}

export function isInGeneration(pokemonId: number, generationId: number): boolean {
  const gen = getGenerationById(generationId);
  if (!gen) return true;
  const [min, max] = gen.range;
  return pokemonId >= min && pokemonId <= max;
}
