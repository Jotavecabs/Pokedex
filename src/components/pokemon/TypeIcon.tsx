import type { SVGProps } from 'react';
import { TYPE_GLYPHS } from './typeGlyphs';
import type { PokemonTypeName } from '@/types/pokemon';

interface TypeIconProps extends SVGProps<SVGSVGElement> {
  type: PokemonTypeName;
  // degradê branco usado na marca d'água dos cards
  whiteGradient?: boolean;
}

export function TypeIcon({ type, whiteGradient, ...props }: TypeIconProps) {
  const gradientId = `type-watermark-${type}`;
  const fill = whiteGradient ? `url(#${gradientId})` : 'currentColor';

  return (
    <svg viewBox="0 0 512 512" aria-hidden {...props}>
      {whiteGradient && (
        <defs>
          <linearGradient id={gradientId} x1="0.05" y1="0.075" x2="0.87" y2="1.03">
            <stop offset="0" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
      )}
      {TYPE_GLYPHS[type].map((d, i) => (
        <path key={i} d={d} fill={fill} fillRule="evenodd" clipRule="evenodd" />
      ))}
    </svg>
  );
}
