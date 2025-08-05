"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ArrowUpDown, Settings2, Zap, Shield } from "lucide-react"
import { Token, FeeConfig } from "@/types"
import { cn, formatNumber, formatAddress, isValidEthereumAddress } from "@/lib/utils"

interface SwapInterfaceProps {
  tokens: Token[]
  selectedFromToken: Token | null
  selectedToToken: Token | null
  fromAmount: string
  toAmount: string
  fee: FeeConfig
  safeAddress: string
  isLoading: boolean
  onFromTokenChange: (token: Token) => void
  onToTokenChange: (token: Token) => void
  onFromAmountChange: (amount: string) => void
  onFeeChange: (fee: FeeConfig) => void
  onSafeAddressChange: (address: string) => void
  onSwapTokens: () => void
  onExecuteSwap: () => void
}

export function SwapInterface({
  tokens,
  selectedFromToken,
  selectedToToken,
  fromAmount,
  toAmount,
  fee,
  safeAddress,
  isLoading,
  onFromTokenChange,
  onToTokenChange,
  onFromAmountChange,
  onFeeChange,
  onSafeAddressChange,
  onSwapTokens,
  onExecuteSwap
}: SwapInterfaceProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [feeRecipient, setFeeRecipient] = useState(fee.recipient)
  const [feePercentage, setFeePercentage] = useState(fee.percentage.toString())

  const handleFeeUpdate = () => {
    const percentage = parseFloat(feePercentage) || 0.25
    onFeeChange({
      percentage: Math.min(Math.max(percentage, 0), 5), // Entre 0% e 5%
      recipient: feeRecipient
    })
  }

  const isValidForm = selectedFromToken && selectedToToken && fromAmount && 
                     isValidEthereumAddress(safeAddress) && 
                     isValidEthereumAddress(feeRecipient)

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Main Swap Card */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Swap</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Settings2 className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* From Token Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>From</span>
              {selectedFromToken?.balance && (
                <span>Balance: {formatNumber(selectedFromToken.balance)}</span>
              )}
            </div>
            
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="0.0"
                  value={fromAmount}
                  onChange={(e) => onFromAmountChange(e.target.value)}
                  className="text-right text-lg font-medium"
                />
              </div>
              
              <Select 
                value={selectedFromToken?.address} 
                onValueChange={(address) => {
                  const token = tokens.find(t => t.address === address)
                  if (token) onFromTokenChange(token)
                }}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Token">
                    {selectedFromToken && (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-muted" />
                        <span className="text-sm font-medium">{selectedFromToken.symbol}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {tokens.map((token) => (
                    <SelectItem key={token.address} value={token.address}>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-muted" />
                        <div>
                          <div className="font-medium">{token.symbol}</div>
                          <div className="text-xs text-muted-foreground">{token.name}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Swap Direction Button */}
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={onSwapTokens}
              className="rounded-xl border bg-background hover:bg-muted"
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </div>

          {/* To Token Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>To</span>
              {selectedToToken?.balance && (
                <span>Balance: {formatNumber(selectedToToken.balance)}</span>
              )}
            </div>
            
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="0.0"
                  value={toAmount}
                  readOnly
                  className="text-right text-lg font-medium bg-muted/50"
                />
              </div>
              
              <Select 
                value={selectedToToken?.address} 
                onValueChange={(address) => {
                  const token = tokens.find(t => t.address === address)
                  if (token) onToTokenChange(token)
                }}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Token">
                    {selectedToToken && (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-muted" />
                        <span className="text-sm font-medium">{selectedToToken.symbol}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {tokens.map((token) => (
                    <SelectItem key={token.address} value={token.address}>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-muted" />
                        <div>
                          <div className="font-medium">{token.symbol}</div>
                          <div className="text-xs text-muted-foreground">{token.name}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced Settings */}
          {showAdvanced && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Settings2 className="w-4 h-4" />
                  Advanced Settings
                </h4>
                
                {/* Fee Configuration */}
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Fee Percentage (0% - 5%)</label>
                  <Input
                    placeholder="0.25"
                    value={feePercentage}
                    onChange={(e) => setFeePercentage(e.target.value)}
                    onBlur={handleFeeUpdate}
                    endIcon={<span className="text-xs">%</span>}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Fee Recipient Address</label>
                  <Input
                    placeholder="0x..."
                    value={feeRecipient}
                    onChange={(e) => setFeeRecipient(e.target.value)}
                    onBlur={handleFeeUpdate}
                    error={!!feeRecipient && !isValidEthereumAddress(feeRecipient)}
                    helperText={feeRecipient && !isValidEthereumAddress(feeRecipient) ? "Invalid Ethereum address" : undefined}
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Safe Address Configuration */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Safe Wallet Address
            </label>
            <Input
              placeholder="0x... (Safe address that will execute the swap)"
              value={safeAddress}
              onChange={(e) => onSafeAddressChange(e.target.value)}
              error={!!safeAddress && !isValidEthereumAddress(safeAddress)}
              helperText={safeAddress && !isValidEthereumAddress(safeAddress) ? "Invalid Safe address" : undefined}
            />
          </div>
        </CardContent>
      </Card>

      {/* Execute Button */}
      <Button
        variant="swap"
        size="xl"
        className="w-full"
        disabled={!isValidForm || isLoading}
        loading={isLoading}
        onClick={onExecuteSwap}
      >
        <Zap className="w-5 h-5 mr-2" />
        {isLoading ? "Preparing Swap..." : "Review Swap"}
      </Button>

      {/* Quick Stats */}
      {selectedFromToken && selectedToToken && fromAmount && (
        <Card className="bg-muted/30">
          <CardContent className="pt-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rate</span>
                <span>1 {selectedFromToken.symbol} = {formatNumber(1.234)} {selectedToToken.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fee ({fee.percentage}%)</span>
                <span>${formatNumber(parseFloat(fromAmount) * 0.01234)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fee Recipient</span>
                <span className="font-mono text-xs">{formatAddress(fee.recipient)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}