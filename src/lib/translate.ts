// A PokeAPI não tem descrições em português — traduzimos o inglês com a
// MyMemory (API pública, sem chave) e guardamos em localStorage.

const CACHE_PREFIX = 'pokedex:flavor-pt:';

export function getCachedTranslation(key: string | number): string | null {
  try {
    return localStorage.getItem(`${CACHE_PREFIX}${key}`);
  } catch {
    return null;
  }
}

export function setCachedTranslation(key: string | number, value: string): void {
  try {
    localStorage.setItem(`${CACHE_PREFIX}${key}`, value);
  } catch {
    // storage indisponível — segue sem cache
  }
}

interface MyMemoryResponse {
  responseStatus: number;
  responseData?: {
    translatedText?: string;
  };
}

export async function translateToPtBr(
  text: string,
  signal?: AbortSignal,
): Promise<string> {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    text,
  )}&langpair=en%7Cpt-BR`;

  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`Falha ao traduzir (${res.status})`);
  }

  const data = (await res.json()) as MyMemoryResponse;
  const translated = data.responseData?.translatedText?.trim();

  // avisos de cota vêm dentro do próprio texto traduzido
  if (
    data.responseStatus !== 200 ||
    !translated ||
    /MYMEMORY WARNING/i.test(translated)
  ) {
    throw new Error('Tradução indisponível no momento');
  }

  return translated;
}
