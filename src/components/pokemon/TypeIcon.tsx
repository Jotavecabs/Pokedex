import type { SVGProps } from 'react';
import { TYPE_GLYPHS } from './typeGlyphs';
import type { PokemonTypeName } from '@/types/pokemon';

interface TypeIconProps extends SVGProps<SVGSVGElement> {
  type: PokemonTypeName;
  /**
   * Preenche o glifo com um degradê branco (marca d'água atrás do sprite
   * nos cards, como no Figma). Sem isso, usa `currentColor` sólido.
   */
  whiteGradient?: boolean;
}

/**
 * Símbolo oficial do tipo (o mesmo usado nos jogos e no Figma).
 * Pequeno no badge (currentColor), grande como marca d'água (degradê).
 */
export function TypeIcon({ type, whiteGradient, ...props }: TypeIconProps) {
  // id determinístico por tipo — instâncias repetidas compartilham o mesmo def
  const gradientId = `type-watermark-${type}`;
  const fill = whiteGradient ? `url(#${gradientId})` : 'currentColor';

  return (
    <svg viewBox="0 0 512 512" aria-hidden {...props}>
      {whiteGradient && (
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0.05" />
          </linearGradient>
        </defs>
      )}
      {TYPE_GLYPHS[type].map((d, i) => (
        <path key={i} d={d} fill={fill} fillRule="evenodd" clipRule="evenodd" />
      ))}
    </svg>
  );
}
