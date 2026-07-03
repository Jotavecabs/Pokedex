# Pokédex — Case Técnico Frontend

Aplicação de Pokédex construída com **React + TypeScript**, consumindo a
[PokéAPI](https://pokeapi.co). Reproduz fielmente a tela fornecida no Figma e
implementa todas as funcionalidades do desafio.

🔗 **Deploy:** _adicione aqui a URL da Vercel após o deploy_
🎨 **Design de referência:** [Figma — Pokédex](https://www.figma.com/design/GNL2BNiYCrMQstUkebspv7)

---

## ✨ Funcionalidades

| Requisito | Status | Onde |
| --- | --- | --- |
| Listagem de Pokémons (nome, sprite, tipos) | ✅ | `pages/HomePage.tsx`, `components/pokemon/PokemonCard.tsx` |
| Paginação / "Carregar mais" | ✅ | `hooks/usePokemonList.ts` |
| Detalhes em rota dedicada | ✅ | `pages/PokemonDetailPage.tsx` (`/pokemon/:id`) |
| Favoritar / desfavoritar (estado global) | ✅ | `store/favoritesStore.ts` |
| Busca por nome | ✅ | `components/filters/SearchBar.tsx` |
| Filtros múltiplos (tipo, altura, peso, geração) | ✅ | `components/filters/FilterControls.tsx` |
| Responsividade desktop e mobile | ✅ | grid responsivo em todas as telas |
| Persistência (favoritos + preferências) | ✅ | `zustand/middleware` → `localStorage` |
| Comparação de estatísticas entre 2 Pokémons | ✅ | `pages/ComparePage.tsx` |
| Cadeia de evolução | ✅ | `components/pokemon/EvolutionChain.tsx` |
| Deploy público | ⏳ | Vercel |

---

## 🧱 Stack e decisões técnicas

| Ferramenta | Por quê |
| --- | --- |
| **Vite** | Dev server e build rápidos; padrão atual para SPAs React. |
| **React 19 + TypeScript** | Tipagem forte como diferencial (ver abaixo). |
| **TanStack Query** | Cache, deduplicação e estados de loading/erro para as centenas de requisições da PokéAPI (que é bastante fragmentada). Cada Pokémon é cacheado por `id` e reaproveitado entre listagem, favoritos, detalhes e comparação. |
| **Zustand** (+ `persist`) | Estado global mínimo e sem boilerplate para favoritos, comparação e filtros. O middleware `persist` resolve o requisito de persistência em `localStorage` de forma declarativa. |
| **React Router** | Rota dedicada de detalhes (`/pokemon/:id`) + páginas de favoritos e comparação. |
| **Tailwind CSS v4** | Reproduzir o Figma rapidamente e manter a responsividade próxima ao design. As cores dos tipos vêm das variáveis exatas do Figma (`lib/pokemonTypes.ts`). |

### Tipagem forte (diferencial)

- **Zero `any`.** Os contratos da PokéAPI estão modelados em `types/pokemon.ts`.
- **União literal** para os 18 tipos (`PokemonTypeName`) e para as 6 estatísticas
  (`StatName`) — o compilador garante que rótulos, cores e filtros cobrem todos os casos.
- **Genéricos** no cliente HTTP (`request<T>`) e em `usePokemonSummaries`.
- **Type guards** (`filter((s): s is PokemonSummary => …)`) para estreitar tipos
  ao descartar resultados nulos.
- Modelo cru (`Pokemon`) separado do modelo de UI (`PokemonSummary`), convertido
  por `toSummary()`.

### Como os filtros funcionam

Os filtros "baratos" (nome, tipo, geração, ordenação) reduzem a lista de **ids**
_antes_ de buscar detalhes na API — só os cards visíveis são carregados.
Altura e peso dependem do detalhe de cada Pokémon, então são aplicados sobre os
itens já carregados. As **preferências de filtro** são persistidas; a busca é
reiniciada a cada sessão.

---

## 📁 Estrutura

```
src/
├── api/          # hooks do TanStack Query (queries.ts)
├── components/
│   ├── filters/  # busca + sheets de tipo/ordenação/filtros
│   ├── layout/   # shell + barra de navegação inferior
│   ├── pokemon/  # card, badge, favorito, stats, evolução
│   └── ui/       # bottom sheet, spinner, ícones
├── hooks/        # useDebounce, usePokemonList (orquestra a listagem)
├── lib/          # cliente PokéAPI, tipos de Pokémon, formatação, gerações
├── pages/        # Home, Detalhes, Favoritos, Comparar
├── store/        # Zustand: favoritos, comparação, filtros
└── types/        # tipos da PokéAPI
```

---

## 🚀 Rodando localmente

Pré-requisitos: **Node 18+** e **npm**.

```bash
# 1. Instalar dependências
npm install

# 2. Ambiente de desenvolvimento (http://localhost:5173)
npm run dev

# 3. Build de produção
npm run build

# 4. Pré-visualizar o build
npm run preview
```

Não há variáveis de ambiente — a PokéAPI é pública.

---

## 📝 Observações técnicas

- **Sprites:** usamos a _official artwork_ em alta resolução, com fallback para o
  sprite padrão.
- **`useQueries`:** a listagem busca cada Pokémon como uma query independente,
  então cards já vistos vêm do cache ao paginar ou navegar entre telas.
- **Acessibilidade:** botões com `aria-label`/`aria-pressed`, foco visível,
  fechamento de modais por `Esc` e overlay.
- **SPA na Vercel:** `vercel.json` reescreve todas as rotas para `index.html`
  para que rotas como `/pokemon/25` funcionem no deploy.

---

## ☁️ Deploy (Vercel)

1. Suba o repositório no GitHub.
2. Em [vercel.com](https://vercel.com) → **Add New → Project** → importe o repo.
3. A Vercel detecta o Vite automaticamente (`build`: `npm run build`, output: `dist`).
4. Deploy. Cole a URL gerada no topo deste README.
