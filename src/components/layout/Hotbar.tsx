import { NavLink } from 'react-router-dom';

/** Azul dos itens ativos (Figma). */
const NAVY = '#173ea5';
const RED = '#e3350d';
const GRAY = '#808080';

interface NavItem {
  to: string;
  label: string;
  activeIcon: string;
  inactiveIcon: string;
}

/** Ícones oficiais exportados do Figma (public/images/nav). */
const NAV_ITEMS: NavItem[] = [
  {
    to: '/',
    label: 'Pokédex',
    activeIcon: '/images/nav/pokeball-active.svg',
    inactiveIcon: '/images/nav/pokeball-inactive.svg',
  },
  {
    to: '/regioes',
    label: 'Regiões',
    activeIcon: '/images/nav/regions-active.svg',
    inactiveIcon: '/images/nav/regions-inactive.svg',
  },
  {
    to: '/favoritos',
    label: 'Favoritos',
    activeIcon: '/images/nav/heart-active.svg',
    inactiveIcon: '/images/nav/heart-inactive.svg',
  },
];

/** Balança do Comparar — desenhada no mesmo estilo dos ícones do Figma. */
function CompareIcon({ active }: { active: boolean }) {
  const stroke = active ? NAVY : GRAY;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={active ? 'h-[26px] w-[26px]' : 'h-6 w-6'}
    >
      <path d="M12 7v13M9 20h6M5 7h14" stroke={stroke} />
      <circle cx={12} cy={5} r={1.5} fill={active ? RED : 'none'} stroke={stroke} />
      <path d="M5 7 2 12M5 7l3 5" stroke={stroke} />
      <path d="M2 12a3 3 0 0 0 6 0Z" fill={active ? RED : 'none'} stroke={stroke} />
      <path d="M19 7l-3 5M19 7l3 5" stroke={stroke} />
      <path d="M16 12a3 3 0 0 0 6 0Z" fill={active ? RED : 'none'} stroke={stroke} />
    </svg>
  );
}

/**
 * Barra de navegação inferior (Figma): 72px, borda superior #e6e6e6,
 * itens 56x56 e rótulo de 12px em azul apenas no item ativo.
 */
export function Hotbar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 h-[72px] border-t border-gray-100 bg-white">
      <ul className="mx-auto flex h-full max-w-md items-center justify-between px-8">
        {NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === '/'}
              aria-label={item.label}
              className="flex h-14 w-14 flex-col items-center justify-center"
            >
              {({ isActive }) => (
                <>
                  <img
                    src={isActive ? item.activeIcon : item.inactiveIcon}
                    alt=""
                    className={isActive ? '-mb-0.5 h-[26px] w-[26px]' : 'h-6 w-6'}
                  />
                  {isActive && (
                    <span className="text-xs font-medium" style={{ color: NAVY }}>
                      {item.label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          </li>
        ))}
        <li>
          <NavLink
            to="/comparar"
            aria-label="Comparar"
            className="flex h-14 w-14 flex-col items-center justify-center"
          >
            {({ isActive }) => (
              <>
                <CompareIcon active={isActive} />
                {isActive && (
                  <span className="text-xs font-medium" style={{ color: NAVY }}>
                    Comparar
                  </span>
                )}
              </>
            )}
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
