'use client';

import { useState, useEffect } from 'react';
import { ArrowUpDown, Settings, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TokenSelector } from './TokenSelector';
import { SwapPreview } from './SwapPreview';
import { useSwap } from '@/hooks/useSwap';
import { useSafe } from '@/hooks/useSafe';
import { DEFAULT_SLIPPAGE, MIN_SLIPPAGE, MAX_SLIPPAGE } from '@/types/0x';

export function SwapInterface() {
  const [showSettings, setShowSettings] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  
  const {
    swapState,
    isLoading,
    error,
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
  } = useSwap();

  const { isConnected: safeConnected, connectSafe, safeInfo } = useSafe();

  // Auto-refresh quote quando parâmetros mudarem
  useEffect(() => {
    if (swapState.sellToken && swapState.buyToken && swapState.sellAmount) {
      const timer = setTimeout(() => {
        refreshQuote();
      }, 1000); // Debounce de 1 segundo

      return () => clearTimeout(timer);
    }
  }, [swapState.sellToken, swapState.buyToken, swapState.sellAmount, refreshQuote]);

  const handleSellAmountChange = (value: string) => {
    // Validar entrada numérica
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setSellAmount(value);
    }
  };

  const handleBuyAmountChange = (value: string) => {
    // Validar entrada numérica
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setBuyAmount(value);
    }
  };

  const handleExecuteSwap = async () => {
    try {
      clearError();
      const hash = await executeSwap();
      if (hash) {
        setTxHash(hash);
      }
    } catch (err) {
      console.error('Erro ao executar swap:', err);
    }
  };

  const handleConnectSafe = async () => {
    try {
      await connectSafe();
    } catch (err) {
      console.error('Erro ao conectar Safe:', err);
    }
  };

  const getSwapButtonText = () => {
    if (!safeConnected) return 'Conectar Safe';
    if (!swapState.sellToken) return 'Selecionar token de venda';
    if (!swapState.buyToken) return 'Selecionar token de compra';
    if (!swapState.sellAmount) return 'Inserir quantidade';
    if (isLoading) return 'Buscando melhor cotação...';
    if (!canSwap) return 'Cotação indisponível';
    return 'Executar Swap';
  };

  const getSwapButtonVariant = () => {
    if (!safeConnected) return 'outline';
    if (canSwap) return 'default';
    return 'secondary';
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Swap</h1>
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Configurações do Swap</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Tolerância ao Slippage: {swapState.slippage}%</Label>
                <Slider
                  value={[swapState.slippage]}
                  onValueChange={(value) => setSlippage(value[0])}
                  min={MIN_SLIPPAGE}
                  max={MAX_SLIPPAGE}
                  step={0.1}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{MIN_SLIPPAGE}%</span>
                  <span>{MAX_SLIPPAGE}%</span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Status do Safe */}
      {safeConnected && safeInfo ? (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Safe conectado: {safeInfo.address.slice(0, 6)}...{safeInfo.address.slice(-4)} 
            ({safeInfo.threshold}/{safeInfo.owners.length} assinaturas)
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Safe não conectado. Conecte seu Safe para executar swaps.
          </AlertDescription>
        </Alert>
      )}

      {/* Interface principal de swap */}
      <Card>
        <CardHeader>
          <CardTitle>Trocar Tokens</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Token de venda */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>De</Label>
              {swapState.sellToken && (
                <span className="text-xs text-muted-foreground">
                  Saldo: -- {swapState.sellToken.symbol}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <TokenSelector
                selectedToken={swapState.sellToken}
                onSelectToken={setSellToken}
                otherToken={swapState.buyToken}
                placeholder="Token de venda"
              />
              <Input
                type="text"
                placeholder="0.0"
                value={swapState.sellAmount}
                onChange={(e) => handleSellAmountChange(e.target.value)}
                className="text-right font-mono"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Botão de inversão */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={switchTokens}
              disabled={isLoading}
              className="rounded-full"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>

          {/* Token de compra */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Para</Label>
              {swapState.buyToken && (
                <span className="text-xs text-muted-foreground">
                  Saldo: -- {swapState.buyToken.symbol}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <TokenSelector
                selectedToken={swapState.buyToken}
                onSelectToken={setBuyToken}
                otherToken={swapState.sellToken}
                placeholder="Token de compra"
              />
              <Input
                type="text"
                placeholder="0.0"
                value={swapState.buyAmount}
                onChange={(e) => handleBuyAmountChange(e.target.value)}
                className="text-right font-mono"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Botão de ação principal */}
          <Button
            className="w-full h-12"
            variant={getSwapButtonVariant()}
            onClick={safeConnected ? handleExecuteSwap : handleConnectSafe}
            disabled={safeConnected && (!canSwap || isLoading)}
            loading={isLoading}
            loadingText="Processando..."
          >
            {getSwapButtonText()}
          </Button>

          {/* Link para resetar */}
          {(swapState.sellToken || swapState.buyToken || swapState.sellAmount) && (
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetSwap}
                className="text-muted-foreground"
              >
                Limpar tudo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview do swap */}
      {formattedData && swapState.sellToken && swapState.buyToken && (
        <SwapPreview
          sellToken={swapState.sellToken}
          buyToken={swapState.buyToken}
          swapData={formattedData}
        />
      )}

      {/* Confirmação de transação */}
      {txHash && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <div>Transação enviada para o Safe!</div>
              <div className="text-xs font-mono break-all">
                Hash: {txHash}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}