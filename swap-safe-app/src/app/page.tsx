"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { SwapInterface } from "@/components/swap/swap-interface"
import { Token, Network, FeeConfig } from "@/types"

// Mock data - será substituído por dados reais nas próximas etapas
const MOCK_NETWORKS: Network[] = [
  {
    id: 1,
    name: "Ethereum",
    symbol: "ETH",
    rpcUrl: "https://mainnet.infura.io/v3/",
    blockExplorerUrl: "https://etherscan.io",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18
    },
    zeroXApi: "https://api.0x.org",
    color: "#627EEA"
  },
  {
    id: 8453,
    name: "Base",
    symbol: "ETH",
    rpcUrl: "https://mainnet.base.org",
    blockExplorerUrl: "https://basescan.org",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18
    },
    zeroXApi: "https://base.api.0x.org",
    color: "#0052FF"
  },
  {
    id: 42161,
    name: "Arbitrum",
    symbol: "ETH",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    blockExplorerUrl: "https://arbiscan.io",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18
    },
    zeroXApi: "https://arbitrum.api.0x.org",
    color: "#12AAFF"
  }
]

const MOCK_TOKENS: Token[] = [
  {
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    symbol: "WETH",
    name: "Wrapped Ether",
    decimals: 18,
    chainId: 1,
    balance: "1.5234"
  },
  {
    address: "0xA0b86a33E6417e2e8d8ad1C8E9c42D13E83f4bE3",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    chainId: 1,
    balance: "2500.00"
  },
  {
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
    chainId: 1,
    balance: "1000.50"
  },
  {
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    decimals: 8,
    chainId: 1,
    balance: "0.05432"
  }
]

export default function SwapPage() {
  // Network state
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(MOCK_NETWORKS[0])
  
  // Swap state
  const [selectedFromToken, setSelectedFromToken] = useState<Token | null>(null)
  const [selectedToToken, setSelectedToToken] = useState<Token | null>(null)
  const [fromAmount, setFromAmount] = useState<string>("")
  const [toAmount, setToAmount] = useState<string>("")
  const [safeAddress, setSafeAddress] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  
  // Fee configuration
  const [fee, setFee] = useState<FeeConfig>({
    percentage: 0.25,
    recipient: "0x742DEA2e50b3c2F2fA451DE5EF4dc74c4564e9e3" // Default fee recipient
  })

  const handleNetworkChange = (networkId: string) => {
    const network = MOCK_NETWORKS.find(n => n.id.toString() === networkId)
    if (network) {
      setSelectedNetwork(network)
      // Reset tokens when network changes
      setSelectedFromToken(null)
      setSelectedToToken(null)
      setFromAmount("")
      setToAmount("")
    }
  }

  const handleSwapTokens = () => {
    // Swap the selected tokens
    const tempToken = selectedFromToken
    setSelectedFromToken(selectedToToken)
    setSelectedToToken(tempToken)
    
    // Clear amounts
    setFromAmount("")
    setToAmount("")
  }

  const handleFromAmountChange = (amount: string) => {
    setFromAmount(amount)
    // TODO: Implement real-time price calculation via 0x API
    if (amount && selectedFromToken && selectedToToken) {
      // Mock calculation - will be replaced with real API call
      const mockRate = 1850.50 // Example ETH to USDC rate
      const calculatedAmount = (parseFloat(amount) * mockRate).toString()
      setToAmount(calculatedAmount)
    } else {
      setToAmount("")
    }
  }

  const handleExecuteSwap = async () => {
    if (!selectedFromToken || !selectedToToken || !fromAmount || !safeAddress) {
      return
    }

    setIsLoading(true)
    
    try {
      // TODO: Implement 0x API integration and Safe transaction preparation
      console.log("Executing swap:", {
        from: selectedFromToken,
        to: selectedToToken,
        amount: fromAmount,
        safeAddress,
        fee,
        network: selectedNetwork
      })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert("Swap prepared! (This will be replaced with actual Safe integration)")
    } catch (error) {
      console.error("Swap error:", error)
      alert("Error preparing swap. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header
        selectedNetwork={selectedNetwork}
        networks={MOCK_NETWORKS}
        onNetworkChange={handleNetworkChange}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
          {/* Welcome Message */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-swap-pink to-swap-blue bg-clip-text text-transparent">
              Professional Swap Interface
            </h1>
            <p className="text-lg text-muted-foreground">
              Powered by 0x API • Executed via Safe Wallet • Multi-network Support
            </p>
          </div>

          {/* Swap Interface */}
          <SwapInterface
            tokens={MOCK_TOKENS.filter(token => token.chainId === selectedNetwork?.id)}
            selectedFromToken={selectedFromToken}
            selectedToToken={selectedToToken}
            fromAmount={fromAmount}
            toAmount={toAmount}
            fee={fee}
            safeAddress={safeAddress}
            isLoading={isLoading}
            onFromTokenChange={setSelectedFromToken}
            onToTokenChange={setSelectedToToken}
            onFromAmountChange={handleFromAmountChange}
            onFeeChange={setFee}
            onSafeAddressChange={setSafeAddress}
            onSwapTokens={handleSwapTokens}
            onExecuteSwap={handleExecuteSwap}
          />

          {/* Footer Info */}
          <div className="mt-12 text-center text-sm text-muted-foreground max-w-2xl">
            <p>
              This interface connects to the 0x API for optimal swap routing and integrates with Safe Wallet 
              for secure multi-signature execution. All transactions are transparent and verifiable on-chain.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}