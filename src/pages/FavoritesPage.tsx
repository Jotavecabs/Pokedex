import { useRef, useState } from 'react';
import { useFavoritesStore } from '@/store/favoritesStore';
import { usePokemonSummaries } from '@/api/queries';
import { PokemonCard } from '@/components/pokemon/PokemonCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { Spinner } from '@/components/ui/Spinner';
import type { PokemonSummary } from '@/types/pokemon';

/** Largura da área vermelha revelada pelo swipe (Figma: 122px). */
const REVEAL_WIDTH = 122;
/** Fração da largura do card que, ao ser arrastada, remove na hora. */
const DELETE_RATIO = 0.85;

/**
 * Card de favorito com "arrastar para a esquerda" (Figma): arrastar um pouco
 * revela a lixeira vermelha (toque para remover); arrastar até o fim
 * desfavorita instantaneamente.
 */
function SwipeableFavorite({ pokemon }: { pokemon: PokemonSummary }) {
  const toggle = useFavoritesStore((s) => s.toggle);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const startOffset = useRef(0);
  const moved = useRef(false);
  const removed = useRef(false);

  const remove = () => {
    if (removed.current) return;
    removed.current = true;
    toggle(pokemon.id);
  };

  return (
    <div ref={wrapRef} className="relative overflow-hidden rounded-[15px]">
      {/* Área revelada: vermelho #cd3131 + lixeira 38px (Figma) */}
      <div
        className="absolute inset-y-0 right-0 flex items-center justify-center"
        style={{ width: REVEAL_WIDTH, backgroundColor: '#cd3131' }}
      >
        <button
          type="button"
          aria-label={`Remover ${pokemon.name} dos favoritos`}
          onClick={remove}
          className="grid h-full w-full place-items-center active:opacity-80"
        >
          <img src="/images/nav/trash.svg" alt="" className="h-[38px] w-[38px]" />
        </button>
      </div>

      {/* Card deslizável */}
      <div
        className="relative touch-pan-y"
        style={{
          transform: `translateX(${offset}px)`,
          transition: dragging ? 'none' : 'transform 200ms ease',
        }}
        onPointerDown={(e) => {
          startX.current = e.clientX;
          startOffset.current = offset;
          moved.current = false;
          setDragging(true);
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!dragging) return;
          const width = wrapRef.current?.offsetWidth ?? 328;
          const dx = e.clientX - startX.current;
          if (Math.abs(dx) > 5) moved.current = true;
          const next = Math.min(0, Math.max(-width, startOffset.current + dx));
          // arrastou até o fim → desfavorita na hora
          if (next <= -width * DELETE_RATIO) {
            setOffset(-width);
            remove();
            return;
          }
          setOffset(next);
        }}
        onPointerUp={() => {
          setDragging(false);
          setOffset((o) => (o < -REVEAL_WIDTH / 2 ? -REVEAL_WIDTH : 0));
        }}
        onPointerCancel={() => {
          setDragging(false);
          setOffset(0);
        }}
        onClickCapture={(e) => {
          // um arrasto não pode navegar para a página do Pokémon
          if (moved.current || offset !== 0) {
            e.preventDefault();
            e.stopPropagation();
            if (!moved.current) setOffset(0);
          }
        }}
      >
        <PokemonCard pokemon={pokemon} />
      </div>
    </div>
  );
}

export function FavoritesPage() {
  const ids = useFavoritesStore((s) => s.ids);
  const { summaries, isLoading } = usePokemonSummaries(ids);

  return (
    <>
      <PageHeader title="Favoritos" />

      {ids.length === 0 ? (
        /* Estado vazio (Figma): Magikarp acinzentada + mensagem */
        <div className="flex flex-col items-center gap-4 px-4 py-16 text-center">
          <img
            src="/images/magikarp.png"
            alt=""
            className="h-[215px] w-[185px] object-contain"
          />
          <div className="flex flex-col gap-2">
            <h2 className="mx-auto max-w-[380px] text-[20px] font-semibold leading-snug text-gray-800">
              Você não favoritou nenhum
              <br />
              Pokémon :(
            </h2>
            <p className="mx-auto max-w-[325px] text-sm leading-relaxed text-[#4d4d4d]">
              Clique no ícone de coração dos seus pokémons favoritos e eles
              aparecerão aqui.
            </p>
          </div>
        </div>
      ) : (
        <div className="px-4 py-4">
          {isLoading && summaries.length === 0 && (
            <div className="flex justify-center py-10">
              <Spinner className="h-8 w-8" />
            </div>
          )}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {summaries.map((pokemon) => (
              <SwipeableFavorite key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
