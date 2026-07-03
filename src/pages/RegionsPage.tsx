import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { REGIONS, type Region } from '@/lib/regions';
import { menuSpriteUrl, staticSpriteUrl } from '@/lib/pokeapi';
import { useFiltersStore } from '@/store/filtersStore';

export function RegionsPage() {
  return (
    <>
      <PageHeader title="Regiões" />
      <div className="grid grid-cols-1 gap-3 px-4 py-4 sm:grid-cols-2">
        {REGIONS.map((region) => (
          <RegionCard key={region.generationId} region={region} />
        ))}
      </div>
    </>
  );
}

function RegionCard({ region }: { region: Region }) {
  const navigate = useNavigate();
  const setGeneration = useFiltersStore((s) => s.setGeneration);

  return (
    <button
      type="button"
      onClick={() => {
        setGeneration(region.generationId);
        navigate('/');
      }}
      className="relative flex h-[102px] items-center overflow-hidden rounded-[15px] bg-gray-800 bg-cover bg-center text-left transition-transform hover:scale-[1.01] active:scale-[0.99]"
      style={{ backgroundImage: `url(/images/regions/gen${region.generationId}.png)` }}
    >
      {/* Overlay */}
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.15) 100%)',
        }}
        aria-hidden
      />

      {/* Nome + geração */}
      <span className="relative ml-6 flex flex-col">
        <span className="text-lg font-semibold w-[80px] leading-tight text-white">
          {region.name}
        </span>
        <span className="text-[11px] font-medium uppercase tracking-[0.55px] text-gray-200">
          {region.generationId}º Geração
        </span>
      </span>

      {/* Iniciais */}
      <span className="relative ml-auto mr-4 -mt-17 flex ">
        {region.starters.map((id, i) => (
          <img
            key={id}
            src={menuSpriteUrl(id)}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = staticSpriteUrl(id);
            }}
            alt=""
            loading="lazy"
            className={`h-[140px] w-auto object-contain [image-rendering:pixelated] drop-shadow ${i > 0 ? '-ml-[100px]' : ''}`}          />
        ))}
      </span>
    </button>
  );
}
