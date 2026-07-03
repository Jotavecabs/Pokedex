// junta classes ignorando valores falsy
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

// tom claro de uma cor (fundos dos cards)
export function tint(color: string, amount = 12): string {
  return `color-mix(in srgb, ${color} ${amount}%, white)`;
}
