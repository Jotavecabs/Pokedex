/**
 * Regiões do mundo Pokémon (tela "Regiões" do Figma — Kanto a Galar).
 * Cada uma corresponde a uma geração (faixas de id em `generations.ts`);
 * o fundo vem de `public/images/regions/gen{id}.png` (exportado do Figma).
 */
export interface Region {
  /** Mesmo id da geração correspondente. */
  generationId: number;
  name: string;
  /** Iniciais de grama, fogo e água — mostrados no card. */
  starters: [number, number, number];
}

export const REGIONS: Region[] = [
  { generationId: 1, name: 'Kanto', starters: [1, 4, 7] },
  { generationId: 2, name: 'Johto', starters: [152, 155, 158] },
  { generationId: 3, name: 'Hoenn', starters: [252, 255, 258] },
  { generationId: 4, name: 'Sinnoh', starters: [387, 390, 393] },
  { generationId: 5, name: 'Unova', starters: [495, 498, 501] },
  { generationId: 6, name: 'Kalos', starters: [650, 653, 656] },
  { generationId: 7, name: 'Alola', starters: [722, 725, 728] },
  { generationId: 8, name: 'Galar', starters: [810, 813, 816] },
];

export function getRegionByGeneration(generationId: number): Region | undefined {
  return REGIONS.find((r) => r.generationId === generationId);
}
