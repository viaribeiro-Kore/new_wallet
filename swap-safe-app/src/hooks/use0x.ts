'use client';

import { useState, useCallback } from 'react';
import type { 
  ZeroXPriceResponse, 
  ZeroXQuoteResponse, 
  ZeroXSwapParams,
  ApiError 
} from '@/types/0x';

interface Use0xReturn {
  // Estados
  isLoading: boolean;
  error: string | null;
  priceData: ZeroXPriceResponse | null;
  quoteData: ZeroXQuoteResponse | null;
  
  // Métodos
  getPrice: (params: ZeroXSwapParams) => Promise<ZeroXPriceResponse | null>;
  getQuote: (params: ZeroXSwapParams) => Promise<ZeroXQuoteResponse | null>;
  clearError: () => void;
  reset: () => void;
}

const BASE_URL = process.env.NEXT_PUBLIC_0X_API_URL || 'https://api.0x.org';
const API_KEY = process.env.NEXT_PUBLIC_0X_API_KEY;

/**
 * Hook para integração com a API da 0x
 * 
 * @description
 * Fornece métodos para obter cotações (price) e quotes completos da 0x API.
 * Inclui tratamento de erros robusto e estados de loading.
 * 
 * @methods
 * - getPrice: Obtém preço estimado para um swap
 * - getQuote: Obtém quote completo incluindo dados da transação
 * - clearError: Limpa erros atuais
 * - reset: Reseta todos os estados
 * 
 * @example
 * ```tsx
 * const { getPrice, getQuote, isLoading, error } = use0x();
 * 
 * const price = await getPrice({
 *   sellToken: 'USDC',
 *   buyToken: 'WETH',
 *   sellAmount: '1000000', // 1 USDC (6 decimals)
 *   chainId: 1
 * });
 * ```
 */
export function use0x(): Use0xReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [priceData, setPriceData] = useState<ZeroXPriceResponse | null>(null);
  const [quoteData, setQuoteData] = useState<ZeroXQuoteResponse | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setPriceData(null);
    setQuoteData(null);
  }, []);

  const handleApiError = useCallback((error: any): string => {
    console.error('0x API Error:', error);
    
    if (error.response?.status === 400) {
      return 'Parâmetros inválidos. Verifique os tokens e valores informados.';
    }
    
    if (error.response?.status === 404) {
      return 'Token não encontrado ou par de trading não disponível.';
    }
    
    if (error.response?.status === 429) {
      return 'Muitas requisições. Tente novamente em alguns segundos.';
    }
    
    if (error.response?.status >= 500) {
      return 'Erro no servidor da 0x. Tente novamente mais tarde.';
    }
    
    if (!navigator.onLine) {
      return 'Sem conexão com a internet. Verifique sua conexão.';
    }
    
    return 'Erro inesperado ao buscar dados. Tente novamente.';
  }, []);

  const buildRequestParams = useCallback((params: ZeroXSwapParams): URLSearchParams => {
    const searchParams = new URLSearchParams();
    
    searchParams.append('sellToken', params.sellToken);
    searchParams.append('buyToken', params.buyToken);
    
    if (params.sellAmount) {
      searchParams.append('sellAmount', params.sellAmount);
    } else if (params.buyAmount) {
      searchParams.append('buyAmount', params.buyAmount);
    }
    
    if (params.slippagePercentage) {
      searchParams.append('slippagePercentage', params.slippagePercentage.toString());
    }
    
    if (params.takerAddress) {
      searchParams.append('takerAddress', params.takerAddress);
    }

    return searchParams;
  }, []);

  const getPrice = useCallback(async (params: ZeroXSwapParams): Promise<ZeroXPriceResponse | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const searchParams = buildRequestParams(params);
      const url = `${BASE_URL}/swap/v1/price?${searchParams.toString()}`;
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (API_KEY) {
        headers['0x-api-key'] = API_KEY;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw {
          response: {
            status: response.status,
            statusText: response.statusText,
          }
        };
      }

      const data: ZeroXPriceResponse = await response.json();
      setPriceData(data);
      
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [buildRequestParams, handleApiError]);

  const getQuote = useCallback(async (params: ZeroXSwapParams): Promise<ZeroXQuoteResponse | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const searchParams = buildRequestParams(params);
      const url = `${BASE_URL}/swap/v1/quote?${searchParams.toString()}`;
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (API_KEY) {
        headers['0x-api-key'] = API_KEY;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw {
          response: {
            status: response.status,
            statusText: response.statusText,
          }
        };
      }

      const data: ZeroXQuoteResponse = await response.json();
      setQuoteData(data);
      
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [buildRequestParams, handleApiError]);

  return {
    isLoading,
    error,
    priceData,
    quoteData,
    getPrice,
    getQuote,
    clearError,
    reset,
  };
}