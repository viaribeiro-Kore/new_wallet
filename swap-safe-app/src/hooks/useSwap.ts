'use client';

import { useState, useCallback, useMemo } from 'react';
import { use0x } from './use0x';
import { useSafe } from './useSafe';
import { useTokens } from './useTokens';
import type { 
  ZeroXQuoteResponse, 
  ZeroXSwapParams, 
  FormattedSwapData 
} from '@/types/0x';
import type { Token } from '@/types/tokens';

interface SwapState {
  sellToken: Token | null;
  buyToken: Token | null;
  sellAmount: string;
  buyAmount: string;
  slippage: number;
  isExactInput: boolean;
}

interface UseSwapReturn {
  // Estados
  swapState: SwapState;
  isLoading: boolean;
  error: string | null;
  quote: ZeroXQuoteResponse | null;
  formattedData: FormattedSwapData | null;
  canSwap: boolean;
  
  // Métodos
  setSellToken: (token: Token | null) => void;
  setBuyToken: (token: Token | null) => void;
  setSellAmount: (amount: string) => void;
  setBuyAmount: (amount: string) => void;
  setSlippage: (slippage: number) => void;
  switchTokens: () => void;
  refreshQuote: () => Promise<void>;
  executeSwap: () => Promise<string | null>;
  resetSwap: () => void;
  clearError: () => void;
}

const DEFAULT_STATE: SwapState = {
  sellToken: null,
  buyToken: null,
  sellAmount: '',
  buyAmount: '',
  slippage: 0.5,
  isExactInput: true,
};

/**
 * Hook principal para coordenar swaps
 * 
 * @description
 * Coordena todo o processo de swap, desde a seleção de tokens até a execução
 * no Safe. Integra os hooks use0x, useSafe e useTokens para fornecer uma
 * interface unificada para swaps.
 * 
 * @methods
 * - setSellToken/setBuyToken: Define tokens para o swap
 * - setSellAmount/setBuyAmount: Define quantidades
 * - setSlippage: Define tolerância ao slippage
 * - switchTokens: Inverte posições dos tokens
 * - refreshQuote: Atualiza cotação da 0x
 * - executeSwap: Executa o swap no Safe
 * - resetSwap: Reseta todos os estados
 * 
 * @example
 * ```tsx
 * const { 
 *   swapState, 
 *   setSellToken, 
 *   setSellAmount, 
 *   executeSwap, 
 *   formattedData 
 * } = useSwap();
 * 
 * setSellToken(usdcToken);
 * setSellAmount('100');
 * 
 * if (formattedData) {
 *   const txHash = await executeSwap();
 * }
 * ```
 */
export function useSwap(): UseSwapReturn {
  const [swapState, setSwapState] = useState<SwapState>(DEFAULT_STATE);
  const [quote, setQuote] = useState<ZeroXQuoteResponse | null>(null);
  
  const { 
    getQuote, 
    getPrice, 
    isLoading: is0xLoading, 
    error: zeroXError,
    clearError: clear0xError 
  } = use0x();
  
  const { 
    submitTransaction, 
    isConnected: safeConnected,
    isLoading: safeLoading,
    error: safeError 
  } = useSafe();
  
  const { getTokenBySymbol } = useTokens();

  const isLoading = is0xLoading || safeLoading;
  const error = zeroXError || safeError;

  const clearError = useCallback(() => {
    clear0xError();
  }, [clear0xError]);

  const setSellToken = useCallback((token: Token | null) => {
    setSwapState(prev => ({
      ...prev,
      sellToken: token,
      // Limpar amounts quando trocar token
      sellAmount: '',
      buyAmount: '',
    }));
    setQuote(null);
  }, []);

  const setBuyToken = useCallback((token: Token | null) => {
    setSwapState(prev => ({
      ...prev,
      buyToken: token,
      // Limpar amounts quando trocar token
      sellAmount: '',
      buyAmount: '',
    }));
    setQuote(null);
  }, []);

  const setSellAmount = useCallback((amount: string) => {
    setSwapState(prev => ({
      ...prev,
      sellAmount: amount,
      isExactInput: true,
    }));
  }, []);

  const setBuyAmount = useCallback((amount: string) => {
    setSwapState(prev => ({
      ...prev,
      buyAmount: amount,
      isExactInput: false,
    }));
  }, []);

  const setSlippage = useCallback((slippage: number) => {
    setSwapState(prev => ({
      ...prev,
      slippage,
    }));
  }, []);

  const switchTokens = useCallback(() => {
    setSwapState(prev => ({
      ...prev,
      sellToken: prev.buyToken,
      buyToken: prev.sellToken,
      sellAmount: prev.buyAmount,
      buyAmount: prev.sellAmount,
    }));
    setQuote(null);
  }, []);

  const buildSwapParams = useCallback((): ZeroXSwapParams | null => {
    const { sellToken, buyToken, sellAmount, buyAmount, slippage, isExactInput } = swapState;
    
    if (!sellToken || !buyToken) return null;
    
    const amount = isExactInput ? sellAmount : buyAmount;
    if (!amount || parseFloat(amount) <= 0) return null;

    // Converter amount para wei/units baseado nos decimais do token
    const tokenDecimals = isExactInput ? sellToken.decimals : buyToken.decimals;
    const amountInUnits = Math.floor(parseFloat(amount) * Math.pow(10, tokenDecimals)).toString();

    return {
      sellToken: sellToken.address,
      buyToken: buyToken.address,
      [isExactInput ? 'sellAmount' : 'buyAmount']: amountInUnits,
      slippagePercentage: slippage,
    };
  }, [swapState]);

  const refreshQuote = useCallback(async (): Promise<void> => {
    const params = buildSwapParams();
    if (!params) return;

    try {
      const newQuote = await getQuote(params);
      if (newQuote) {
        setQuote(newQuote);
        
        // Atualizar amount do lado oposto
        if (swapState.isExactInput) {
          const buyAmountFormatted = (
            parseFloat(newQuote.buyAmount) / Math.pow(10, swapState.buyToken!.decimals)
          ).toString();
          setSwapState(prev => ({
            ...prev,
            buyAmount: buyAmountFormatted,
          }));
        } else {
          const sellAmountFormatted = (
            parseFloat(newQuote.sellAmount) / Math.pow(10, swapState.sellToken!.decimals)
          ).toString();
          setSwapState(prev => ({
            ...prev,
            sellAmount: sellAmountFormatted,
          }));
        }
      }
    } catch (err) {
      console.error('Erro ao buscar quote:', err);
    }
  }, [buildSwapParams, getQuote, swapState]);

  // Auto-refresh quote quando parâmetros mudarem
  useState(() => {
    const timeoutId = setTimeout(() => {
      if (buildSwapParams()) {
        refreshQuote();
      }
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timeoutId);
  });

  const formattedData = useMemo((): FormattedSwapData | null => {
    if (!quote || !swapState.sellToken || !swapState.buyToken) return null;

    const inputAmount = (parseFloat(quote.sellAmount) / Math.pow(10, swapState.sellToken.decimals)).toFixed(6);
    const outputAmount = (parseFloat(quote.buyAmount) / Math.pow(10, swapState.buyToken.decimals)).toFixed(6);
    const exchangeRate = (parseFloat(outputAmount) / parseFloat(inputAmount)).toFixed(6);
    
    const priceImpact = (parseFloat(quote.estimatedPriceImpact) * 100).toFixed(2);
    const minimumReceived = (parseFloat(outputAmount) * (1 - swapState.slippage / 100)).toFixed(6);
    
    const route = quote.sources
      .filter(s => parseFloat(s.proportion) > 0)
      .map(s => `${s.name} (${(parseFloat(s.proportion) * 100).toFixed(1)}%)`)
      .join(', ');

    const gasEstimate = (parseFloat(quote.gas) / 1e9).toFixed(2); // Em Gwei

    return {
      inputAmount,
      outputAmount,
      exchangeRate,
      priceImpact,
      minimumReceived,
      route,
      sources: quote.sources,
      protocolFee: quote.protocolFee,
      gasEstimate,
      estimatedSlippage: quote.expectedSlippage,
    };
  }, [quote, swapState]);

  const canSwap = useMemo(() => {
    return Boolean(
      swapState.sellToken &&
      swapState.buyToken &&
      swapState.sellAmount &&
      swapState.buyAmount &&
      quote &&
      safeConnected &&
      !isLoading
    );
  }, [swapState, quote, safeConnected, isLoading]);

  const executeSwap = useCallback(async (): Promise<string | null> => {
    if (!canSwap || !quote) {
      throw new Error('Swap não pode ser executado. Verifique os parâmetros.');
    }

    try {
      // Submeter transação para o Safe
      const txHash = await submitTransaction({
        to: quote.to,
        data: quote.data,
        value: quote.value,
      });

      if (txHash) {
        // Reset após sucesso
        resetSwap();
      }

      return txHash;
    } catch (err) {
      console.error('Erro ao executar swap:', err);
      throw err;
    }
  }, [canSwap, quote, submitTransaction]);

  const resetSwap = useCallback(() => {
    setSwapState(DEFAULT_STATE);
    setQuote(null);
    clearError();
  }, [clearError]);

  return {
    swapState,
    isLoading,
    error,
    quote,
    formattedData,
    canSwap,
    setSellToken,
    setBuyToken,
    setSellAmount,
    setBuyAmount,
    setSlippage,
    switchTokens,
    refreshQuote,
    executeSwap,
    resetSwap,
    clearError,
  };
}