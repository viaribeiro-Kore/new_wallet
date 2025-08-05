'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TrendingDown, TrendingUp, Route, Zap, DollarSign, Clock } from 'lucide-react';
import type { FormattedSwapData, ZeroXSource } from '@/types/0x';
import type { Token } from '@/types/tokens';

interface SwapPreviewProps {
  sellToken: Token;
  buyToken: Token;
  swapData: FormattedSwapData;
  className?: string;
}

export function SwapPreview({ 
  sellToken, 
  buyToken, 
  swapData, 
  className 
}: SwapPreviewProps) {
  const priceImpactValue = parseFloat(swapData.priceImpact);
  const isHighImpact = priceImpactValue > 3;
  const isMediumImpact = priceImpactValue > 1;

  const formatNumber = (value: string, decimals: number = 6) => {
    const num = parseFloat(value);
    if (num === 0) return '0';
    if (num < 0.000001) return '<0.000001';
    return num.toFixed(decimals);
  };

  const getPriceImpactColor = () => {
    if (isHighImpact) return 'text-red-600';
    if (isMediumImpact) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getPriceImpactIcon = () => {
    if (isHighImpact) return <TrendingDown className="h-4 w-4" />;
    if (isMediumImpact) return <TrendingUp className="h-4 w-4 text-yellow-600" />;
    return <TrendingUp className="h-4 w-4 text-green-600" />;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5" />
          <span>Preview do Swap</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Resumo da transação */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {sellToken.logoURI && (
                <img 
                  src={sellToken.logoURI} 
                  alt={sellToken.symbol}
                  className="w-5 h-5 rounded-full"
                />
              )}
              <span className="text-sm font-medium">Você paga</span>
            </div>
            <div className="text-right">
              <div className="font-mono font-medium">
                {formatNumber(swapData.inputAmount)} {sellToken.symbol}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center py-2">
            <div className="w-full border-t border-dashed" />
            <div className="px-3">↓</div>
            <div className="w-full border-t border-dashed" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {buyToken.logoURI && (
                <img 
                  src={buyToken.logoURI} 
                  alt={buyToken.symbol}
                  className="w-5 h-5 rounded-full"
                />
              )}
              <span className="text-sm font-medium">Você recebe</span>
            </div>
            <div className="text-right">
              <div className="font-mono font-medium text-green-600">
                {formatNumber(swapData.outputAmount)} {buyToken.symbol}
              </div>
              <div className="text-xs text-muted-foreground">
                Mín: {formatNumber(swapData.minimumReceived)} {buyToken.symbol}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Métricas do swap */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <DollarSign className="h-3 w-3" />
              <span>Taxa de câmbio</span>
            </div>
            <div className="font-mono text-sm">
              1 {sellToken.symbol} = {formatNumber(swapData.exchangeRate, 4)} {buyToken.symbol}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className={`flex items-center space-x-1 text-sm ${getPriceImpactColor()}`}>
              {getPriceImpactIcon()}
              <span>Impacto no preço</span>
            </div>
            <div className={`font-mono text-sm ${getPriceImpactColor()}`}>
              {swapData.priceImpact}%
            </div>
          </div>
        </div>

        <Separator />

        {/* Rota de execução */}
        <div className="space-y-2">
          <div className="flex items-center space-x-1 text-sm font-medium">
            <Route className="h-4 w-4" />
            <span>Rota de Execução</span>
          </div>
          
          <div className="space-y-2">
            {swapData.sources
              .filter(source => parseFloat(source.proportion) > 0)
              .map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {source.name}
                    </Badge>
                  </div>
                  <div className="text-sm font-mono">
                    {(parseFloat(source.proportion) * 100).toFixed(1)}%
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        <Separator />

        {/* Custos e taxas */}
        <div className="space-y-3">
          <div className="flex items-center space-x-1 text-sm font-medium">
            <Clock className="h-4 w-4" />
            <span>Custos</span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Taxa do protocolo</span>
              <span className="font-mono">
                {swapData.protocolFee === '0' ? 'Grátis' : `${swapData.protocolFee} ETH`}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gas estimado</span>
              <span className="font-mono">{swapData.gasEstimate} Gwei</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Slippage estimado</span>
              <span className="font-mono">
                {(parseFloat(swapData.estimatedSlippage) * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* Alertas baseados no impacto no preço */}
        {isHighImpact && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <TrendingDown className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <div className="font-medium text-red-800">Alto impacto no preço</div>
                <div className="text-red-600">
                  Este swap pode ter um impacto significativo no preço. Considere dividir em várias transações menores.
                </div>
              </div>
            </div>
          </div>
        )}
        
        {isMediumImpact && !isHighImpact && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <TrendingUp className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <div className="font-medium text-yellow-800">Impacto moderado no preço</div>
                <div className="text-yellow-600">
                  Este swap terá um impacto moderado no preço. Verifique se está confortável com o valor.
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}