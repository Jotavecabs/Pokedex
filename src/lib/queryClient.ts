import { QueryClient } from '@tanstack/react-query';

/**
 * Dados da PokeAPI são imutáveis na prática, então usamos cache longo
 * e evitamos refetch ao focar a janela.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60, // 1h
      gcTime: 1000 * 60 * 60 * 24, // 24h
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
