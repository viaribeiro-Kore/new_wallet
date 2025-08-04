# Ethereum Wallet Generator

A secure, client-side Ethereum wallet generator that creates wallets with 12-word seed phrases directly in your browser.

## Features

- ✅ **Client-side generation** - Your keys never leave your browser
- ✅ **12-word seed phrase** - Standard BIP39 mnemonic generation
- ✅ **Modern UI** - Beautiful, responsive design
- ✅ **Copy functionality** - Easy copying of seed phrase, address, and private key
- ✅ **Security warnings** - Built-in reminders about best practices
- ✅ **Mobile responsive** - Works on all devices

## How to Use

1. Open `index.html` in your web browser
2. Read the security warnings carefully
3. Click "Generate New Wallet"
4. **Write down your 12-word seed phrase** on paper
5. Store your seed phrase in a secure location
6. Use the wallet address to receive Ethereum

## Security Features

- **No server communication** - Everything runs locally in your browser
- **No data storage** - Wallet data is cleared when you close the page
- **Ethers.js library** - Uses the trusted Ethers.js library for cryptographic operations
- **Security reminders** - Clear warnings about seed phrase security

## Important Security Notes

⚠️ **CRITICAL SECURITY WARNINGS:**

- **NEVER share your seed phrase** with anyone
- **Write it down on paper** and store it safely offline
- **This tool generates real wallets** - treat the keys as you would real money
- **Use only on trusted devices** with updated security software
- **Clear your browser history** after use for extra security
- **The generated wallet is immediately usable** on the Ethereum mainnet and testnets

## Technical Details

- Uses Ethers.js v5.7.2 for wallet generation
- Implements BIP39 standard for mnemonic generation
- Generates wallets compatible with MetaMask, Trust Wallet, and other standard wallets
- No dependencies on external servers or APIs

## Browser Compatibility

- Chrome/Chromium 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Running the Application

Simply open `index.html` in any modern web browser. No installation or setup required.

```bash
# Option 1: Open directly in browser
open index.html

# Option 2: Serve with a simple HTTP server (optional)
python -m http.server 8000
# Then visit http://localhost:8000
```

## License

This tool is provided as-is for educational and personal use. Use at your own risk.

---

**Disclaimer:** This tool generates real Ethereum wallets. The developers are not responsible for any loss of funds. Always verify the security of your environment before generating wallets with real value.
