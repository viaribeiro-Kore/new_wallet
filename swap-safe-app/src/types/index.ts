// Network types
export interface Network {
  id: number
  name: string
  symbol: string
  rpcUrl: string
  blockExplorerUrl: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  zeroXApi: string
  color: string
}

// Token types
export interface Token {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI?: string
  chainId: number
  balance?: string
  price?: number
}

// Swap types
export interface SwapQuote {
  chainId: number
  price: string
  guaranteedPrice: string
  to: string
  data: string
  value: string
  gas: string
  gasPrice: string
  protocolFee: string
  minimumProtocolFee: string
  buyTokenAddress: string
  sellTokenAddress: string
  buyAmount: string
  sellAmount: string
  sources: Array<{
    name: string
    proportion: string
  }>
  allowanceTarget: string
  decodedUniqueId: string
  sellTokenToEthRate: string
  buyTokenToEthRate: string
}

export interface SwapPrice {
  chainId: number
  price: string
  estimatedPriceImpact: string
  value: string
  gasPrice: string
  gas: string
  estimatedGas: string
  protocolFee: string
  minimumProtocolFee: string
  buyTokenAddress: string
  sellTokenAddress: string
  buyAmount: string
  sellAmount: string
  sources: Array<{
    name: string
    proportion: string
  }>
  allowanceTarget: string
  sellTokenToEthRate: string
  buyTokenToEthRate: string
}

// Fee configuration
export interface FeeConfig {
  percentage: number // 0.25 = 0.25%
  recipient: string  // Address to receive the fee
}

// Safe transaction
export interface SafeTransaction {
  to: string
  value: string
  data: string
  operation: number
  safeTxGas: string
  baseGas: string
  gasPrice: string
  gasToken: string
  refundReceiver: string
  nonce: number
}

// Swap state
export interface SwapState {
  fromToken: Token | null
  toToken: Token | null
  fromAmount: string
  toAmount: string
  slippage: number
  fee: FeeConfig
  safeAddress: string
  network: Network | null
  quote: SwapQuote | null
  isLoading: boolean
  error: string | null
}