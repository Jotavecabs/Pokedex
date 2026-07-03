import { cn } from '@/lib/cn';

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Carregando"
      className={cn(
        'inline-block animate-spin rounded-full border-2 border-gray-200 border-t-gray-800',
        className ?? 'h-6 w-6',
      )}
    />
  );
}
