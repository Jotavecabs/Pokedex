import { useFavoritesStore } from '@/store/favoritesStore';
import { HeartIcon } from '@/components/ui/icons';
import { cn } from '@/lib/cn';

interface FavoriteButtonProps {
  id: number;
  className?: string;
  size?: number;
  // solid: círculo branco | ghost: contorno branco | bare: só o coração
  variant?: 'solid' | 'ghost' | 'bare';
}

export function FavoriteButton({
  id,
  className,
  size = 18,
  variant = 'solid',
}: FavoriteButtonProps) {
  const isFavorite = useFavoritesStore((s) => s.ids.includes(id));
  const toggle = useFavoritesStore((s) => s.toggle);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
      }}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      title={isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
      className={cn(
        'grid place-items-center rounded-full transition-transform active:scale-90',
        variant === 'solid' &&
          cn(
            'bg-white/90 shadow-sm hover:bg-white',
            isFavorite ? 'text-rose-500' : 'text-gray-400',
          ),
        variant === 'ghost' &&
          cn(
            'border-2 border-white/90 hover:bg-white/15',
            isFavorite ? 'bg-white/0 text-[#cd3131]' : 'text-white',
          ),
        variant === 'bare' && (isFavorite ? 'text-[#cd3131]' : 'text-white'),
        className,
      )}
    >
      <HeartIcon filled={isFavorite} style={{ width: size, height: size }} />
    </button>
  );
}
