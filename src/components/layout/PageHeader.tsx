import type { ReactNode } from 'react';

/** Header de página do Figma: 67px, borda inferior, título 18px #333. */
export function PageHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <header className="sticky top-0 z-30 flex h-[67px] items-center justify-between border-b border-gray-50 bg-white px-4">
      <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
      {action}
    </header>
  );
}
