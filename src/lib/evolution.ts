import { capitalize } from './format';
import type { EvolutionDetail } from '@/types/pokemon';

/** Itens de evolução mais comuns traduzidos para pt-BR. */
const ITEM_LABELS: Record<string, string> = {
  'moon-stone': 'Pedra da Lua',
  'fire-stone': 'Pedra do Fogo',
  'water-stone': 'Pedra da Água',
  'thunder-stone': 'Pedra do Trovão',
  'leaf-stone': 'Pedra da Folha',
  'ice-stone': 'Pedra do Gelo',
  'sun-stone': 'Pedra do Sol',
  'shiny-stone': 'Pedra Brilhante',
  'dusk-stone': 'Pedra do Crepúsculo',
  'dawn-stone': 'Pedra da Alvorada',
  'oval-stone': 'Pedra Oval',
  'kings-rock': 'Rocha do Rei',
  'metal-coat': 'Revestimento Metálico',
};

const TRIGGER_LABELS: Record<string, string> = {
  trade: 'Troca',
  'use-item': 'Item',
  shed: 'Especial',
  spin: 'Especial',
};

/**
 * Descreve como um estágio evolui a partir do anterior, em pt-BR:
 * "Nível 16", "Pedra da Lua", "Nível de Amizade", "Troca"…
 */
export function describeEvolution(details: EvolutionDetail[]): string {
  const detail = details[0];
  if (!detail) return 'Evolução';

  if (detail.item) {
    return ITEM_LABELS[detail.item.name] ?? capitalize(detail.item.name);
  }
  if (detail.min_happiness !== null) return 'Nível de Amizade';
  if (detail.min_level !== null) return `Nível ${detail.min_level}`;

  return TRIGGER_LABELS[detail.trigger.name] ?? 'Evolução especial';
}
