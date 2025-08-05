# Safe Swap - Professional Swap Interface

A modern, professional swap interface that integrates the 0x API with Safe Wallet for secure multi-signature transaction execution.

## ✨ Features

- **🔄 Professional Swap Interface** - Clean, intuitive UI inspired by Uniswap
- **🔗 0x API Integration** - Optimal routing and pricing via 0x protocol
- **🛡️ Safe Wallet Integration** - Secure multi-signature transaction execution
- **🌐 Multi-Network Support** - Ethereum, Base, Arbitrum, Optimism, Polygon
- **💰 Customizable Fees** - Configure fee percentage and recipient address
- **📱 Responsive Design** - Optimized for desktop and mobile
- **⚡ Real-time Quotes** - Live pricing and swap calculations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A 0x API key (optional for basic usage)
- Safe Wallet address for transaction execution

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd swap-safe-app
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   - Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_ZEROX_API_KEY` | 0x API key for enhanced features | Optional |
| `NEXT_PUBLIC_DEFAULT_FEE_PERCENTAGE` | Default fee percentage (0.25) | Yes |
| `NEXT_PUBLIC_DEFAULT_FEE_RECIPIENT` | Default fee recipient address | Yes |
| `NEXT_PUBLIC_ETHEREUM_RPC_URL` | Ethereum RPC URL | Yes |
| `NEXT_PUBLIC_BASE_RPC_URL` | Base network RPC URL | Yes |

### Network Support

Currently supported networks (in priority order):
1. **Ethereum Mainnet** - Primary network
2. **Base** - L2 with low fees
3. **Arbitrum** - High-throughput L2
4. **Optimism** - Fast L2 network
5. **Polygon** - Low-cost alternative

## 🏗️ Architecture

### Tech Stack

- **Framework:** Next.js 14 with App Router
- **Styling:** Tailwind CSS + Radix UI
- **State Management:** React hooks + Zustand
- **API Integration:** Axios + 0x API
- **Wallet Integration:** Safe Apps SDK
- **Type Safety:** TypeScript

### Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/
│   ├── ui/             # Reusable UI components
│   ├── swap/           # Swap-specific components
│   └── layout/         # Layout components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── types/              # TypeScript type definitions
```

## 🔗 Integrations

### 0x API

The app integrates with 0x API for:
- Real-time token prices (`/price` endpoint)
- Swap quotes and routing (`/quote` endpoint)
- Optimal trade execution paths

### Safe Wallet

Safe integration provides:
- Secure multi-signature execution
- Transaction preparation and formatting
- Direct integration with Safe Apps

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking

### Code Standards

- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting
- **Conventional Commits** for commit messages

## 📋 Roadmap

### ✅ Milestone 1: Foundation (COMPLETED)
- [x] Next.js setup with TypeScript
- [x] Tailwind CSS + Radix UI integration
- [x] Component library (Button, Input, Card, Select)
- [x] Main layout and swap interface
- [x] Responsive design

### 🔄 Milestone 2: 0x API Integration (NEXT)
- [ ] Token list management
- [ ] Real-time price quotes
- [ ] Swap quote integration
- [ ] Error handling

### 🔄 Milestone 3: Fee System
- [ ] Customizable fee configuration
- [ ] Fee calculation and validation
- [ ] Recipient address management

### 🔄 Milestone 4: Safe Integration
- [ ] Safe transaction formatting
- [ ] Safe Apps SDK integration
- [ ] Transaction execution flow

### 🔄 Milestone 5: Multi-Network
- [ ] Network switching
- [ ] Per-network token lists
- [ ] Transaction history

### 🔄 Milestone 6: Polish & UX
- [ ] Advanced error handling
- [ ] Loading states and animations
- [ ] Transaction confirmation modal

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in this repository
- Review the documentation above
- Check the [0x API docs](https://docs.0x.org) for API-specific questions
- Check the [Safe docs](https://docs.safe.global) for Safe-specific questions