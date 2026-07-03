import { QueryClient } from '@tanstack/react-query';

// dados da PokeAPI praticamente não mudam — cache longo, sem refetch no foco
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60,
      gcTime: 1000 * 60 * 60 * 24,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
