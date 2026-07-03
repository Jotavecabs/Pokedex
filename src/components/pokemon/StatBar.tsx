import { cn } from '@/lib/cn';

const MAX_STAT = 255;

interface StatBarProps {
  label: string;
  value: number;
  color: string;
  highlight?: boolean;
}

export function StatBar({ label, value, color, highlight }: StatBarProps) {
  const pct = Math.min(100, (value / MAX_STAT) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 text-xs font-medium text-gray-600">{label}</span>
      <span
        className={cn(
          'w-9 shrink-0 text-right text-xs tabular-nums',
          highlight ? 'font-bold text-gray-800' : 'text-gray-500',
        )}
      >
        {value}
      </span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
