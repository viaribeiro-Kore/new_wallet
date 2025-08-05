"use client"

import { Network } from "@/types"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeftRight, Settings, History } from "lucide-react"

interface HeaderProps {
  selectedNetwork: Network | null
  networks: Network[]
  onNetworkChange: (networkId: string) => void
}

export function Header({ selectedNetwork, networks, onNetworkChange }: HeaderProps) {
  return (
    <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo e Nome */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-swap-pink to-swap-blue">
            <ArrowLeftRight className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Safe Swap</h1>
            <p className="text-xs text-muted-foreground">0x API + Safe Wallet</p>
          </div>
        </div>

        {/* Navigation Center */}
        <nav className="hidden md:flex items-center gap-6">
          <Button variant="ghost" size="sm">
            Swap
          </Button>
          <Button variant="ghost" size="sm">
            <History className="w-4 h-4 mr-2" />
            History
          </Button>
        </nav>

        {/* Network Selector e Settings */}
        <div className="flex items-center gap-3">
          {/* Network Selector */}
          <Select value={selectedNetwork?.id.toString()} onValueChange={onNetworkChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select network">
                {selectedNetwork && (
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: selectedNetwork.color }}
                    />
                    <span className="text-sm">{selectedNetwork.name}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {networks.map((network) => (
                <SelectItem key={network.id} value={network.id.toString()}>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: network.color }}
                    />
                    <span>{network.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Settings Button */}
          <Button variant="ghost" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}