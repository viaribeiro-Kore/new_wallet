# Safe Swap App

Uma aplicação de swap de tokens integrada com Safe (Gnosis Safe) e protocolo 0x, permitindo execução de swaps através de transações multi-sig.

## 🚀 Características

- **Integração 0x Protocol**: Utiliza a API da 0x para obter as melhores cotações e rotas de swap
- **Safe Integration**: Executa swaps através do Safe Wallet para transações multi-sig
- **Gestão de Tokens**: Suporte a listas de tokens padrão (Uniswap, CoinGecko) + tokens customizados
- **Preview Detalhado**: Visualização completa do swap incluindo rotas, slippage e custos
- **Interface Responsiva**: Design moderno com componentes acessíveis

## 📋 Pré-requisitos

- Node.js 18+
- Safe Wallet configurado
- Chave de API da 0x Protocol (opcional para produção)

## 🛠️ Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd swap-safe-app
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```

4. **Configure as variáveis no arquivo .env.local**
```env
# Configuração da API 0x
NEXT_PUBLIC_0X_API_URL=https://api.0x.org
NEXT_PUBLIC_0X_API_KEY=sua_chave_da_api_0x

# URLs de RPC por rede
NEXT_PUBLIC_ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/sua_chave
NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-mainnet.infura.io/v3/sua_chave
```

5. **Execute o ambiente de desenvolvimento**
```bash
npm run dev
```

## 🔧 Configuração da API 0x

### Obtendo Chave de API

1. Acesse [0x Dashboard](https://dashboard.0x.org/)
2. Crie uma conta e um novo projeto
3. Copie a chave de API gerada
4. Configure no arquivo `.env.local`

### Endpoints Utilizados

- **GET /swap/v1/price**: Cotações rápidas para preview
- **GET /swap/v1/quote**: Quotes completos para execução

### Redes Suportadas

- Ethereum Mainnet (chainId: 1)
- Polygon (chainId: 137)
- Arbitrum (chainId: 42161)
- Optimism (chainId: 10)
- BSC (chainId: 56)

## 🏗️ Arquitetura

### Hooks Principais

#### `use0x`
Gerencia integração com a API da 0x:
- `getPrice()`: Obtém cotação rápida
- `getQuote()`: Obtém quote completo para execução
- Tratamento robusto de erros
- Estados de loading

#### `useTokens`
Gerencia lista de tokens:
- Carregamento automático de listas padrão
- Cache local com atualização periódica
- Suporte a tokens customizados
- Busca e filtros

#### `useSafe`
Integração com Safe Wallet:
- Detecção automática do ambiente Safe
- Submissão de transações multi-sig
- Informações da carteira conectada

#### `useSwap`
Hook principal que coordena:
- Estado completo do swap
- Integração entre 0x e Safe
- Validações e formatação
- Execução do swap

### Componentes UI

#### `TokenSelector`
- Seleção visual de tokens
- Busca inteligente
- Gestão de tokens customizados
- Prevenção de seleção dupla

#### `SwapPreview`
- Preview detalhado do swap
- Análise de rota de execução
- Alertas de impacto no preço
- Breakdown de custos

#### `SwapInterface`
- Interface principal unificada
- Estados de loading/error
- Configurações de slippage
- Feedback visual

## 📊 Dados do Swap

### Informações Exibidas

- **Taxa de Câmbio**: Preço atual entre os tokens
- **Impacto no Preço**: Impacto percentual no mercado
- **Rota de Execução**: Protocolos utilizados (Uniswap, SushiSwap, etc.)
- **Slippage Estimado**: Tolerância configurável
- **Custos**: Gas estimado e taxas de protocolo
- **Mínimo Recebido**: Quantidade mínima garantida

### Validações

- Verificação de endereços de token
- Validação de quantidades
- Limites de slippage (0.1% - 5%)
- Verificação de liquidez
- Alertas de alto impacto (>3%)

## 🔒 Segurança

### Safe Integration

- Transações executadas através do Safe Wallet
- Requer aprovações multi-sig conforme configuração
- Validação de parâmetros antes da submissão
- Não requer chaves privadas na aplicação

### Validações de Input

- Sanitização de entradas do usuário
- Validação de endereços Ethereum
- Limites de precisão numérica
- Prevenção de overflow/underflow

## 🧪 Desenvolvimento

### Estrutura de Pastas

```
src/
├── components/
│   ├── ui/           # Componentes básicos
│   └── swap/         # Componentes específicos do swap
├── hooks/            # Hooks personalizados
├── types/            # Definições TypeScript
├── lib/              # Utilitários
└── app/              # Páginas Next.js
```

### Scripts Disponíveis

```bash
npm run dev        # Desenvolvimento
npm run build      # Build de produção
npm run lint       # Linting
npm run type-check # Verificação de tipos
```

### Padrões de Código

- TypeScript strict mode
- ESLint + Prettier
- Componentes funcionais com hooks
- Props tipadas com interfaces
- Documentação JSDoc nos hooks

## 🚀 Deploy

### Safe App

Para fazer deploy como Safe App:

1. Faça build da aplicação
2. Configure HTTPS
3. Registre no Safe App Store ou use URL personalizada
4. Configure CORS adequadamente

### Variáveis de Produção

```env
NODE_ENV=production
NEXT_PUBLIC_0X_API_URL=https://api.0x.org
NEXT_PUBLIC_0X_API_KEY=sua_chave_de_producao
```

## 📝 Changelog

### v1.0.0
- ✅ Integração completa com 0x API
- ✅ Interface de swap funcional
- ✅ Gestão de tokens dinâmica
- ✅ Preview detalhado de swaps
- ✅ Integração com Safe Wallet
- ✅ Tratamento robusto de erros
- ✅ Componentes UI melhorados

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.

## 🔗 Links Úteis

- [0x API Documentation](https://docs.0x.org/)
- [Safe Apps SDK](https://docs.safe.global/safe-core-aa-sdk)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)