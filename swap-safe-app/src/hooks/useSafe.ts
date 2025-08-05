'use client';

import { useState, useCallback, useEffect } from 'react';

interface SafeInfo {
  address: string;
  chainId: number;
  owners: string[];
  threshold: number;
  version: string;
}

interface SafeTransaction {
  to: string;
  data: string;
  value: string;
  operation: number;
  safeTxGas: string;
  baseGas: string;
  gasPrice: string;
  gasToken: string;
  refundReceiver: string;
  nonce: number;
}

interface UseSafeReturn {
  // Estados
  isConnected: boolean;
  safeInfo: SafeInfo | null;
  isLoading: boolean;
  error: string | null;
  
  // Métodos
  connectSafe: () => Promise<boolean>;
  disconnectSafe: () => void;
  submitTransaction: (transaction: Partial<SafeTransaction>) => Promise<string | null>;
  getSafeInfo: () => Promise<SafeInfo | null>;
  clearError: () => void;
}

/**
 * Hook para integração com Safe (Gnosis Safe)
 * 
 * @description
 * Fornece funcionalidades para conectar e interagir com Safe wallets,
 * incluindo submissão de transações multi-sig para swaps.
 * 
 * @methods
 * - connectSafe: Conecta com o Safe wallet
 * - disconnectSafe: Desconecta do Safe
 * - submitTransaction: Submete transação para o Safe
 * - getSafeInfo: Obtém informações do Safe conectado
 * - clearError: Limpa erros atuais
 * 
 * @example
 * ```tsx
 * const { connectSafe, submitTransaction, isConnected, safeInfo } = useSafe();
 * 
 * if (!isConnected) {
 *   await connectSafe();
 * }
 * 
 * const txHash = await submitTransaction({
 *   to: '0x...',
 *   data: '0x...',
 *   value: '0'
 * });
 * ```
 */
export function useSafe(): UseSafeReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [safeInfo, setSafeInfo] = useState<SafeInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleSafeError = useCallback((error: any): string => {
    console.error('Safe Error:', error);
    
    if (error.message?.includes('not supported')) {
      return 'Safe App não suportado neste ambiente. Use dentro do Safe Wallet.';
    }
    
    if (error.message?.includes('rejected')) {
      return 'Transação rejeitada pelo usuário.';
    }
    
    if (error.message?.includes('network')) {
      return 'Erro de rede. Verifique sua conexão e tente novamente.';
    }
    
    return 'Erro inesperado no Safe. Tente novamente.';
  }, []);

  // Verificar se está rodando dentro do Safe App
  useEffect(() => {
    const checkSafeEnvironment = async () => {
      try {
        // Verificar se está no contexto do Safe App
        if (typeof window !== 'undefined' && window.parent !== window) {
          // Simular verificação do Safe SDK
          // Em um ambiente real, usaríamos @safe-global/safe-apps-sdk
          const isInSafeApp = true; // Placeholder
          
          if (isInSafeApp) {
            setIsConnected(true);
            await getSafeInfo();
          }
        }
      } catch (err) {
        console.warn('Não está rodando como Safe App:', err);
      }
    };

    checkSafeEnvironment();
  }, []);

  const connectSafe = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Em um ambiente real, usaríamos o Safe Apps SDK
      // import { SafeAppProvider } from '@safe-global/safe-apps-provider'
      // import SafeAppsSDK from '@safe-global/safe-apps-sdk'
      
      // Simulação da conexão com Safe
      // const sdk = new SafeAppsSDK();
      // const safeInfo = await sdk.safe.getInfo();
      
      // Por enquanto, simulamos uma conexão bem-sucedida
      const mockSafeInfo: SafeInfo = {
        address: '0x1234567890123456789012345678901234567890',
        chainId: 1,
        owners: [
          '0xOwner1...',
          '0xOwner2...',
          '0xOwner3...'
        ],
        threshold: 2,
        version: '1.3.0'
      };
      
      setSafeInfo(mockSafeInfo);
      setIsConnected(true);
      
      return true;
    } catch (err) {
      const errorMessage = handleSafeError(err);
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [handleSafeError]);

  const disconnectSafe = useCallback(() => {
    setIsConnected(false);
    setSafeInfo(null);
    setError(null);
  }, []);

  const getSafeInfo = useCallback(async (): Promise<SafeInfo | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Em um ambiente real:
      // const sdk = new SafeAppsSDK();
      // const safeInfo = await sdk.safe.getInfo();
      
      // Simulação
      const mockSafeInfo: SafeInfo = {
        address: '0x1234567890123456789012345678901234567890',
        chainId: 1,
        owners: [
          '0xOwner1...',
          '0xOwner2...',
          '0xOwner3...'
        ],
        threshold: 2,
        version: '1.3.0'
      };
      
      setSafeInfo(mockSafeInfo);
      return mockSafeInfo;
    } catch (err) {
      const errorMessage = handleSafeError(err);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleSafeError]);

  const submitTransaction = useCallback(async (transaction: Partial<SafeTransaction>): Promise<string | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!isConnected) {
        throw new Error('Safe não conectado. Conecte primeiro.');
      }
      
      // Preparar transação com valores padrão
      const safeTx: SafeTransaction = {
        to: transaction.to || '',
        data: transaction.data || '0x',
        value: transaction.value || '0',
        operation: transaction.operation || 0, // CALL
        safeTxGas: transaction.safeTxGas || '0',
        baseGas: transaction.baseGas || '0',
        gasPrice: transaction.gasPrice || '0',
        gasToken: transaction.gasToken || '0x0000000000000000000000000000000000000000',
        refundReceiver: transaction.refundReceiver || '0x0000000000000000000000000000000000000000',
        nonce: transaction.nonce || 0,
      };
      
      // Em um ambiente real:
      // const sdk = new SafeAppsSDK();
      // const txs = [safeTx];
      // const txHash = await sdk.txs.send({ txs });
      
      // Simulação
      const mockTxHash = '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';
      
      return mockTxHash;
    } catch (err) {
      const errorMessage = handleSafeError(err);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, handleSafeError]);

  return {
    isConnected,
    safeInfo,
    isLoading,
    error,
    connectSafe,
    disconnectSafe,
    submitTransaction,
    getSafeInfo,
    clearError,
  };
}