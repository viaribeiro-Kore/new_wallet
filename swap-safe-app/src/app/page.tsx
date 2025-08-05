"use client"

import { SwapInterface } from '@/components/swap/SwapInterface';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
            Safe Swap
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Execute swaps seguros através do Safe Wallet com as melhores cotações da 0x Protocol
          </p>
        </div>

        {/* Swap Interface */}
        <SwapInterface />

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>
            Powered by{' '}
            <a 
              href="https://0x.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              0x Protocol
            </a>
            {' '}and{' '}
            <a 
              href="https://safe.global" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Safe
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}