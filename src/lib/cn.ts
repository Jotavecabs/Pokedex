/** Concatena classes ignorando valores falsy. Alternativa mínima ao clsx. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

/** Tom claro de uma cor (fundo do card) — mistura com branco via CSS. */
export function tint(color: string, amount = 12): string {
  return `color-mix(in srgb, ${color} ${amount}%, white)`;
}
