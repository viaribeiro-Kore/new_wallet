// Tipos para gerenciamento de tokens

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  chainId: number;
  tags?: string[];
}

export interface CustomToken extends Token {
  isCustom: true;
  addedAt: number;
}

export interface TokenList {
  name: string;
  timestamp: string;
  version: {
    major: number;
    minor: number;
    patch: number;
  };
  tags?: Record<string, {
    name: string;
    description: string;
  }>;
  logoURI?: string;
  keywords?: string[];
  tokens: Token[];
}

export interface TokenBalance {
  token: Token;
  balance: string;
  balanceFormatted: string;
  balanceUSD?: string;
}

export interface TokenPair {
  tokenA: Token;
  tokenB: Token;
}

export interface TokenPrice {
  address: string;
  symbol: string;
  price: number;
  priceChange24h?: number;
  volume24h?: number;
  marketCap?: number;
  lastUpdated: number;
}

// Tokens nativos por rede
export const NATIVE_TOKENS: Record<number, Token> = {
  1: {
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png',
    chainId: 1,
  },
  137: {
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    symbol: 'MATIC',
    name: 'Polygon',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/4713/thumb/matic-token-icon.png',
    chainId: 137,
  },
  56: {
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    symbol: 'BNB',
    name: 'BNB Smart Chain',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/825/thumb/bnb-icon2_2x.png',
    chainId: 56,
  },
  42161: {
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png',
    chainId: 42161,
  },
  10: {
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png',
    chainId: 10,
  },
};

// Stablecoins populares por rede
export const POPULAR_STABLECOINS: Record<number, Token[]> = {
  1: [
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
  ],
};

// Utilidades de validação
export const isValidTokenAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const isNativeToken = (token: Token): boolean => {
  return token.address === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
};

export const formatTokenAmount = (
  amount: string,
  decimals: number,
  displayDecimals: number = 6
): string => {
  const num = parseFloat(amount) / Math.pow(10, decimals);
  return num.toFixed(displayDecimals);
};

export const parseTokenAmount = (
  amount: string,
  decimals: number
): string => {
  const num = parseFloat(amount);
  return Math.floor(num * Math.pow(10, decimals)).toString();
};