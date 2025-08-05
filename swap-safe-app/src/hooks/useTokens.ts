'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Token, TokenList, CustomToken } from '@/types/tokens';

interface UseTokensReturn {
  // Estados
  tokens: Token[];
  customTokens: CustomToken[];
  isLoading: boolean;
  error: string | null;
  
  // Métodos
  searchTokens: (query: string) => Token[];
  addCustomToken: (token: CustomToken) => Promise<boolean>;
  removeCustomToken: (address: string) => void;
  getTokenByAddress: (address: string) => Token | undefined;
  getTokenBySymbol: (symbol: string) => Token | undefined;
  refreshTokenList: () => Promise<void>;
  clearError: () => void;
}

// URLs das listas de tokens padrão
const TOKEN_LISTS = {
  uniswap: 'https://tokens.uniswap.org',
  coingecko: 'https://tokens.coingecko.com/uniswap/all.json',
  defiprime: 'https://defiprime.com/defiprime.tokenlist.json',
};

// Tokens essenciais que sempre estarão disponíveis
const ESSENTIAL_TOKENS: Token[] = [
  {
    address: '0xA0b86a33E6417c527a8b59FF3aDb83f466C36b08',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png',
    chainId: 1,
  },
  {
    address: '0xA0b86a33E6417c527a8b59FF3aDb83f466C36b08',
    symbol: 'WETH',
    name: 'Wrapped Ethereum',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/2518/thumb/weth.png',
    chainId: 1,
  },
  {
    address: '0xA0b86a33E6417c527a8b59FF3aDb83f466C36b08',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: 'https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png',
    chainId: 1,
  },
  {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    logoURI: 'https://assets.coingecko.com/coins/images/325/thumb/Tether-logo.png',
    chainId: 1,
  },
  {
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/9956/thumb/4943.png',
    chainId: 1,
  },
];

const STORAGE_KEYS = {
  customTokens: 'swap-safe-custom-tokens',
  tokenListCache: 'swap-safe-token-list-cache',
  lastUpdate: 'swap-safe-token-list-last-update',
};

/**
 * Hook para gerenciamento de tokens
 * 
 * @description
 * Gerencia lista de tokens disponíveis, incluindo tokens padrão (Uniswap, CoinGecko)
 * e tokens customizados adicionados pelo usuário. Inclui cache local e busca.
 * 
 * @methods
 * - searchTokens: Busca tokens por símbolo ou nome
 * - addCustomToken: Adiciona token customizado à lista
 * - removeCustomToken: Remove token customizado
 * - getTokenByAddress: Busca token por endereço
 * - getTokenBySymbol: Busca token por símbolo
 * - refreshTokenList: Atualiza lista de tokens das fontes externas
 * 
 * @example
 * ```tsx
 * const { tokens, searchTokens, addCustomToken } = useTokens();
 * 
 * const usdcTokens = searchTokens('USDC');
 * 
 * await addCustomToken({
 *   address: '0x...',
 *   symbol: 'CUSTOM',
 *   name: 'Custom Token',
 *   decimals: 18,
 *   chainId: 1
 * });
 * ```
 */
export function useTokens(): UseTokensReturn {
  const [tokens, setTokens] = useState<Token[]>(ESSENTIAL_TOKENS);
  const [customTokens, setCustomTokens] = useState<CustomToken[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Carregar tokens customizados do localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.customTokens);
      if (saved) {
        const parsed = JSON.parse(saved);
        setCustomTokens(parsed);
      }
    } catch (err) {
      console.error('Erro ao carregar tokens customizados:', err);
    }
  }, []);

  // Carregar lista de tokens do cache ou da API
  useEffect(() => {
    const loadTokenList = async () => {
      try {
        const lastUpdate = localStorage.getItem(STORAGE_KEYS.lastUpdate);
        const cached = localStorage.getItem(STORAGE_KEYS.tokenListCache);
        
        // Se cache é recente (< 1 hora), usar cache
        if (lastUpdate && cached) {
          const hourAgo = Date.now() - (60 * 60 * 1000);
          if (parseInt(lastUpdate) > hourAgo) {
            const cachedTokens = JSON.parse(cached);
            setTokens([...ESSENTIAL_TOKENS, ...cachedTokens]);
            return;
          }
        }
        
        // Caso contrário, buscar da API
        await refreshTokenList();
      } catch (err) {
        console.error('Erro ao carregar lista de tokens:', err);
        setError('Erro ao carregar lista de tokens. Usando tokens essenciais.');
      }
    };

    loadTokenList();
  }, []);

  const fetchTokenList = useCallback(async (url: string): Promise<Token[]> => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro ao buscar lista: ${response.statusText}`);
    }
    
    const data: TokenList = await response.json();
    return data.tokens || [];
  }, []);

  const refreshTokenList = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Tentar carregar de múltiplas fontes
      const tokenPromises = Object.values(TOKEN_LISTS).map(async (url) => {
        try {
          return await fetchTokenList(url);
        } catch (err) {
          console.warn(`Falha ao carregar tokens de ${url}:`, err);
          return [];
        }
      });

      const results = await Promise.allSettled(tokenPromises);
      const allTokens: Token[] = [];
      
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          allTokens.push(...result.value);
        }
      });

      // Remover duplicatas por endereço
      const uniqueTokens = allTokens.reduce((acc, token) => {
        const key = `${token.address}-${token.chainId}`;
        if (!acc.has(key)) {
          acc.set(key, token);
        }
        return acc;
      }, new Map<string, Token>());

      const finalTokens = [...ESSENTIAL_TOKENS, ...Array.from(uniqueTokens.values())];
      
      setTokens(finalTokens);
      
      // Salvar no cache
      localStorage.setItem(STORAGE_KEYS.tokenListCache, JSON.stringify(Array.from(uniqueTokens.values())));
      localStorage.setItem(STORAGE_KEYS.lastUpdate, Date.now().toString());
      
    } catch (err) {
      console.error('Erro ao atualizar lista de tokens:', err);
      setError('Erro ao atualizar lista de tokens. Usando cache local.');
    } finally {
      setIsLoading(false);
    }
  }, [fetchTokenList]);

  const allTokens = useMemo(() => {
    return [...tokens, ...customTokens];
  }, [tokens, customTokens]);

  const searchTokens = useCallback((query: string): Token[] => {
    if (!query.trim()) return allTokens;
    
    const normalizedQuery = query.toLowerCase().trim();
    
    return allTokens.filter((token) => {
      return (
        token.symbol.toLowerCase().includes(normalizedQuery) ||
        token.name.toLowerCase().includes(normalizedQuery) ||
        token.address.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [allTokens]);

  const addCustomToken = useCallback(async (token: CustomToken): Promise<boolean> => {
    try {
      // Verificar se já existe
      const exists = allTokens.some(
        (t) => t.address.toLowerCase() === token.address.toLowerCase() && t.chainId === token.chainId
      );
      
      if (exists) {
        setError('Token já existe na lista.');
        return false;
      }

      const newCustomTokens = [...customTokens, token];
      setCustomTokens(newCustomTokens);
      
      // Salvar no localStorage
      localStorage.setItem(STORAGE_KEYS.customTokens, JSON.stringify(newCustomTokens));
      
      return true;
    } catch (err) {
      console.error('Erro ao adicionar token customizado:', err);
      setError('Erro ao adicionar token customizado.');
      return false;
    }
  }, [customTokens, allTokens]);

  const removeCustomToken = useCallback((address: string) => {
    try {
      const newCustomTokens = customTokens.filter(
        (token) => token.address.toLowerCase() !== address.toLowerCase()
      );
      
      setCustomTokens(newCustomTokens);
      localStorage.setItem(STORAGE_KEYS.customTokens, JSON.stringify(newCustomTokens));
    } catch (err) {
      console.error('Erro ao remover token customizado:', err);
      setError('Erro ao remover token customizado.');
    }
  }, [customTokens]);

  const getTokenByAddress = useCallback((address: string): Token | undefined => {
    return allTokens.find(
      (token) => token.address.toLowerCase() === address.toLowerCase()
    );
  }, [allTokens]);

  const getTokenBySymbol = useCallback((symbol: string): Token | undefined => {
    return allTokens.find(
      (token) => token.symbol.toLowerCase() === symbol.toLowerCase()
    );
  }, [allTokens]);

  return {
    tokens: allTokens,
    customTokens,
    isLoading,
    error,
    searchTokens,
    addCustomToken,
    removeCustomToken,
    getTokenByAddress,
    getTokenBySymbol,
    refreshTokenList,
    clearError,
  };
}