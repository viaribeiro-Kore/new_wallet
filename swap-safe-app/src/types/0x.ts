// Tipos para integração com a API da 0x Protocol

export interface ZeroXSwapParams {
  sellToken: string;
  buyToken: string;
  sellAmount?: string;
  buyAmount?: string;
  slippagePercentage?: number;
  takerAddress?: string;
  excludedSources?: string[];
  includedSources?: string[];
  skipValidation?: boolean;
  intentOnFilling?: boolean;
}

export interface ZeroXPriceResponse {
  chainId: number;
  price: string;
  guaranteedPrice: string;
  estimatedPriceImpact: string;
  to: string;
  data: string;
  value: string;
  gas: string;
  estimatedGas: string;
  gasPrice: string;
  protocolFee: string;
  minimumProtocolFee: string;
  buyTokenAddress: string;
  sellTokenAddress: string;
  buyAmount: string;
  sellAmount: string;
  sources: Array<{
    name: string;
    proportion: string;
  }>;
  orders: Array<{
    source: string;
    makerToken: string;
    takerToken: string;
    makerAmount: string;
    takerAmount: string;
    fillData: {
      tokenAddressPath: string[];
      router: string;
    };
  }>;
  allowanceTarget: string;
  decodedUniqueId: string;
  sellTokenToEthRate: string;
  buyTokenToEthRate: string;
  expectedSlippage: string;
}

export interface ZeroXQuoteResponse extends ZeroXPriceResponse {
  // Quote inclui todos os campos de Price, mais alguns específicos
  transaction: {
    to: string;
    data: string;
    value: string;
    gas: string;
    gasPrice: string;
  };
}

export interface ZeroXSource {
  name: string;
  proportion: string;
}

export interface ZeroXOrder {
  source: string;
  makerToken: string;
  takerToken: string;
  makerAmount: string;
  takerAmount: string;
  fillData: {
    tokenAddressPath: string[];
    router: string;
  };
}

export interface ZeroXError {
  code: number;
  reason: string;
  description?: string;
}

export interface ApiError {
  response?: {
    status: number;
    statusText: string;
    data?: ZeroXError;
  };
  message?: string;
}

// Tipos auxiliares para formatação e exibição
export interface FormattedSwapData {
  inputAmount: string;
  outputAmount: string;
  exchangeRate: string;
  priceImpact: string;
  minimumReceived: string;
  route: string;
  sources: ZeroXSource[];
  protocolFee: string;
  gasEstimate: string;
  totalCostUSD?: string;
  estimatedSlippage: string;
}

export interface SwapRoute {
  name: string;
  percentage: number;
  inputAmount: string;
  outputAmount: string;
}

// Configurações e constantes
export const SUPPORTED_NETWORKS = {
  ETHEREUM: 1,
  POLYGON: 137,
  BSC: 56,
  ARBITRUM: 42161,
  OPTIMISM: 10,
} as const;

export type SupportedNetwork = typeof SUPPORTED_NETWORKS[keyof typeof SUPPORTED_NETWORKS];

export const DEFAULT_SLIPPAGE = 0.5; // 0.5%
export const MAX_SLIPPAGE = 5; // 5%
export const MIN_SLIPPAGE = 0.1; // 0.1%