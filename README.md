# Pokédex — Case Técnico Frontend

Pokédex construída com **React + TypeScript** consumindo a [PokéAPI](https://pokeapi.co),
reproduzindo fielmente o design fornecido no Figma — cores, tipografia (Poppins),
espaçamentos e assets originais exportados do próprio arquivo de design.

🔗 **Deploy:** [pokedexcase.vercel.app](https://pokedexcase.vercel.app)
📦 **Repositório:** [github.com/Jotavecabs/Pokedex](https://github.com/Jotavecabs/Pokedex)

---

## ✨ Funcionalidades

| Funcionalidade | Onde |
| --- | --- |
| **Listagem de Pokémons** com sprite 2D, nome, número e tipos | `pages/HomePage.tsx`, `components/pokemon/PokemonCard.tsx` |
| **"Carregar mais"** (paginação incremental) | `hooks/usePokemonList.ts` |
| **Busca por nome** (com debounce) | `components/filters/SearchBar.tsx` |
| **Filtro por tipo** (bottom sheet com os 18 tipos) e **ordenação** (menor/maior número, A-Z, Z-A) | `components/filters/FilterControls.tsx` |
| **Regiões** — navegar por geração (Kanto → Galar) com as artes oficiais | `pages/RegionsPage.tsx`, `lib/regions.ts` |
| **Detalhes em rota dedicada** (`/pokemon/:id`): descrição, peso/altura/categoria/habilidade, gênero, fraquezas, estatísticas e cadeia de evolução com gatilhos ("Pedra da Lua", "Nível 16"…) | `pages/PokemonDetailPage.tsx` |
| **Favoritar/desfavoritar** (estado global) + **arrastar para a esquerda** para remover | `store/favoritesStore.ts`, `pages/FavoritesPage.tsx` |
| **Comparação de estatísticas** entre 2 Pokémons, com destaque do maior valor | `pages/ComparePage.tsx` |
| **Persistência** de favoritos, comparação e preferências de filtro | `zustand/middleware` → `localStorage` |
| **Descrições em português** (tradução automática — ver abaixo) | `lib/translate.ts` |
| **Responsividade** desktop e mobile | grid responsivo em todas as telas |

---

## 🧱 Stack e decisões técnicas

| Ferramenta | Por quê |
| --- | --- |
| **Vite + React 19 + TypeScript** | Build rápido e tipagem forte de ponta a ponta. |
| **TanStack Query** | A PokéAPI é fragmentada (detalhe, espécie, evolução e tipo são endpoints separados). O Query cacheia cada recurso por chave e deduplica — um Pokémon visto na listagem não é rebuscado nos detalhes, favoritos ou comparação. |
| **Zustand (+ persist)** | Estado global mínimo para favoritos, comparação e filtros; o middleware `persist` grava em `localStorage` de forma declarativa. |
| **React Router** | Rota dedicada de detalhes + páginas de regiões, favoritos e comparação. |
| **Tailwind CSS v4** | Reprodução fiel do Figma com produtividade; tokens de cor dos 18 tipos centralizados em `lib/pokemonTypes.ts`. |

### Tipagem forte (sem `any`)

- Contratos da PokéAPI modelados em `types/pokemon.ts`;
- Uniões literais para os 18 tipos (`PokemonTypeName`) e as 6 estatísticas (`StatName`) — o compilador garante cobertura total em rótulos, cores e filtros;
- Genéricos no cliente HTTP (`request<T>`) e type guards ao filtrar resultados nulos;
- Modelo cru da API (`Pokemon`) separado do modelo de UI (`PokemonSummary`).

### Descrições em pt-BR (limitação da PokéAPI)

A PokéAPI **não fornece flavor texts em português**. A solução em camadas
(`lib/translate.ts` + `useFlavorTextPtBr`):

1. Se a API tiver pt-BR um dia, usa direto;
2. Senão, o texto em inglês é traduzido automaticamente via **MyMemory**
   (API pública e gratuita, sem chave);
3. Cada tradução é **cacheada em `localStorage`** — um Pokémon é traduzido uma
   única vez por dispositivo, respeitando a cota da API;
4. Enquanto a tradução carrega — ou se ela falhar — a UI exibe o inglês
   (graceful degradation, nunca quebra).

### Fraquezas calculadas de verdade

As fraquezas do Pokémon multiplicam as relações de dano (`/type/{name}`) de
todos os seus tipos (2x, 0.5x, 0x) e exibem só o resultado > 1 — igual aos jogos.

### Sprites

- **Cards, regiões e comparação:** pixel art 2D estática (`front_default` e
  ícones de menu), com `image-rendering: pixelated`;
- **Página do Pokémon:** GIF 2D animado (estilo Gen V), com fallback para o
  sprite estático quando o GIF não existe.

### Gestos

Nos favoritos, **arrastar o card para a esquerda** revela a lixeira (toque
remove); arrastar até o fim desfavorita instantaneamente — implementado com
Pointer Events, sem bibliotecas.

---

## 📁 Estrutura

```
src/
├── api/          # hooks do TanStack Query (dados + tradução + fraquezas)
├── components/
│   ├── filters/  # busca + sheets de tipo e ordenação
│   ├── layout/   # shell, header de página e hotbar (assets do Figma)
│   ├── pokemon/  # card, badges, ícones de tipo, favorito, stats, evolução
│   └── ui/       # bottom sheet, spinner, ícones
├── hooks/        # useDebounce, usePokemonList (busca+filtros+paginação)
├── lib/          # cliente PokéAPI, tipos, regiões, gerações, tradução, formatação
├── pages/        # Pokédex, Detalhes, Regiões, Favoritos, Comparar
├── store/        # Zustand: favoritos, comparação, filtros
└── types/        # contratos TypeScript da PokéAPI
```

---

## 🚀 Rodando localmente

Pré-requisitos: **Node 18+** e **npm**.

```bash
# 1. Clonar e instalar
git clone https://github.com/Jotavecabs/Pokedex.git
cd Pokedex
npm install

# 2. Ambiente de desenvolvimento (http://localhost:5173)
npm run dev

# 3. Build de produção + preview
npm run build
npm run preview
```

Não há variáveis de ambiente — a PokéAPI e a API de tradução são públicas.

---

## 📝 Observações técnicas

- **SPA na Vercel:** `vercel.json` reescreve todas as rotas para `index.html`,
  então URLs diretas como `/pokemon/25` funcionam no deploy;
- **Filtros eficientes:** nome, tipo, geração e ordenação reduzem a lista de
  *ids* antes de buscar detalhes — só os cards visíveis geram requisições;
- **Acessibilidade:** `aria-label`/`aria-pressed` nos botões de ação, foco
  visível, modais fecham com `Esc` e clique no overlay;
- **Assets:** artes das regiões, Magikarp e ícones exportados do arquivo
  Figma; símbolos dos 18 tipos em SVG ([duiker101/pokemon-type-svg-icons](https://github.com/duiker101/pokemon-type-svg-icons), MIT).
