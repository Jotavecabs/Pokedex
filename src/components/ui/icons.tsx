import type { SVGProps } from 'react';

export function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <circle cx={11} cy={11} r={7} />
      <path d="m20 20-3.2-3.2" strokeLinecap="round" />
    </svg>
  );
}

export function HeartIcon({ filled, ...props }: SVGProps<SVGSVGElement> & { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M24.3135 5.37819C23.7176 4.78202 23.0101 4.30911 22.2314 3.98645C21.4527 3.66379 20.618 3.49772 19.7751 3.49772C18.9322 3.49772 18.0976 3.66379 17.3189 3.98645C16.5402 4.30911 15.8327 4.78202 15.2368 5.37819L14.0001 6.61485L12.7635 5.37819C11.5598 4.17454 9.92734 3.49835 8.22514 3.49835C6.52293 3.49835 4.89045 4.17454 3.68681 5.37819C2.48316 6.58183 1.80697 8.21431 1.80697 9.91652C1.80697 11.6187 2.48316 13.2512 3.68681 14.4549L4.92347 15.6915L14.0001 24.7682L23.0768 15.6915L24.3135 14.4549C24.9096 13.859 25.3826 13.1515 25.7052 12.3728C26.0279 11.5941 26.1939 10.7594 26.1939 9.91652C26.1939 9.07362 26.0279 8.23897 25.7052 7.46027C25.3826 6.68157 24.9096 5.97407 24.3135 5.37819V5.37819Z" />
    </svg>
  );
}

export function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function SlidersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" {...props}>
      <path d="M4 6h11M18 6h2M4 12h2M9 12h11M4 18h11M18 18h2" />
      <circle cx={16} cy={6} r={2} fill="currentColor" stroke="none" />
      <circle cx={7} cy={12} r={2} fill="currentColor" stroke="none" />
      <circle cx={16} cy={18} r={2} fill="currentColor" stroke="none" />
    </svg>
  );
}

export function PokeballIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={2} />
      <path d="M2 12h6a4 4 0 0 1 8 0h6" stroke="currentColor" strokeWidth={2} />
      <circle cx={12} cy={12} r={3} fill="currentColor" />
      <circle cx={12} cy={12} r={2} fill="white" />
    </svg>
  );
}

export function ArrowLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg className="border border-black" width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M7.58203 1.25L1.2487 7.58333L7.58203 13.9167" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  );
}

export function RegionsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2a7.5 7.5 0 0 1 7.5 7.5C19.5 14.5 12 22 12 22S4.5 14.5 4.5 9.5A7.5 7.5 0 0 1 12 2Z" />
      <path d="M4.7 9.5h4.8M14.5 9.5h4.8" />
      <circle cx={12} cy={9.5} r={2.5} />
    </svg>
  );
}

export function WeightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 7a3 3 0 1 1 6 0M5 7h14l2 13H3L5 7Z" />
    </svg>
  );
}

export function RulerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3v18M8 3h8M8 21h8M12 7h3M12 12h3M12 17h3" />
    </svg>
  );
}

export function GridIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" {...props}>
      <rect x={4} y={4} width={6} height={6} rx={1} />
      <rect x={14} y={4} width={6} height={6} rx={1} />
      <rect x={4} y={14} width={6} height={6} rx={1} />
      <rect x={14} y={14} width={6} height={6} rx={1} />
    </svg>
  );
}

export function SparkleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 4v4M12 16v4M4 12h4M16 12h4M7 7l2 2M15 15l2 2M17 7l-2 2M9 15l-2 2" />
    </svg>
  );
}

export function ArrowDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M10 3h4v10h4l-6 8-6-8h4V3Z" />
    </svg>
  );
}

export function ScaleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3v18M7 8l-4 7h8l-4-7ZM17 8l-4 7h8l-4-7ZM5 21h14" />
    </svg>
  );
}
