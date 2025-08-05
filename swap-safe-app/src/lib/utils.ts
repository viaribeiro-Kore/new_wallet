import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format address to show only first 6 and last 4 characters
 */
export function formatAddress(address: string, startLength = 6, endLength = 4): string {
  if (!address) return ""
  if (address.length <= startLength + endLength) return address
  
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
}

/**
 * Format number to display with appropriate decimals
 */
export function formatNumber(value: number | string, decimals: number = 4): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return "0"
  
  // For very small numbers, use scientific notation
  if (num < 0.0001 && num > 0) {
    return num.toExponential(2)
  }
  
  // For numbers >= 1 million, use M notation
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + "M"
  }
  
  // For numbers >= 1000, use K notation
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + "K"
  }
  
  return num.toFixed(decimals).replace(/\.?0+$/, "")
}

/**
 * Format currency with symbol
 */
export function formatCurrency(amount: number | string, symbol: string = "$"): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(num)) return `${symbol}0`
  
  return `${symbol}${formatNumber(num, 2)}`
}

/**
 * Sleep utility for delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Check if address is valid Ethereum address
 */
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Calculate percentage difference
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0
  return (value / total) * 100
}