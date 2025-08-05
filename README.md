# Secure Ethereum Wallet Generator

A secure Ethereum wallet generator with split seed phrase storage and Google OAuth authentication for enhanced security.

## 🔒 Enhanced Security Features

- ✅ **Split seed phrase storage** - Server stores words 1-6, local storage holds words 7-12
- ✅ **Google OAuth protection** - Server half tied to your Google account
- ✅ **Double authentication** - Need both Google access AND local storage to recover
- ✅ **Client-side generation** - Wallet creation still happens in your browser
- ✅ **Hashed storage** - Server half is securely hashed with bcrypt
- ✅ **Modern UI** - Beautiful, responsive design with security indicators
- ✅ **Recovery system** - Reconstruct wallet from both halves
- ✅ **Mobile responsive** - Works on all devices

## How to Use

### Initial Setup (First Time)
1. **Configure Google OAuth** - See `setup-instructions.md` for detailed steps
2. **Install dependencies** - Run `npm install`
3. **Start the backend** - Run `npm start`
4. **Serve the frontend** - Use `python -m http.server 8080` or similar
5. **Open in browser** - Navigate to `http://localhost:8080`

### Generating a Secure Wallet
1. **Sign in with Google** - Required for server-side storage
2. **Generate new wallet** - Click "Generate New Wallet"
3. **Note the split storage**:
   - **Server half (words 1-6)** - Automatically stored securely on server
   - **Local half (words 7-12)** - Write this down on paper and store safely
4. **Use wallet address** - For receiving Ethereum transactions

### Recovering Your Wallet
1. **Sign in with Google** - Same account used for generation
2. **Enter local half** - Input words 7-12 in the reconstruction section
3. **Verify and reconstruct** - System combines both halves securely

## Security Features

- **Split storage architecture** - No single point of failure
- **Google OAuth verification** - Server half protected by Google authentication
- **Bcrypt hashing** - Server half stored as secure hash (12 salt rounds)
- **Rate limiting** - API protection against brute force attacks
- **CORS protection** - Restricted API access from authorized origins only
- **Local generation** - Wallet creation happens client-side
- **Ethers.js library** - Uses the trusted Ethers.js library for cryptographic operations
- **Input validation** - All user inputs validated and sanitized
- **Secure headers** - Helmet.js security middleware implemented

## Important Security Notes

⚠️ **CRITICAL SECURITY WARNINGS:**

- **NEVER share your local seed half** (words 7-12) with anyone
- **Write your local half on paper** and store it safely offline
- **Protect your Google account** - Enable 2FA and use strong passwords
- **Both halves required** - You need Google access AND local half to recover
- **This tool generates real wallets** - treat the keys as you would real money
- **Use only on trusted devices** with updated security software
- **HTTPS required in production** - Never use over unencrypted connections
- **The generated wallet is immediately usable** on the Ethereum mainnet and testnets

## Technical Details

### Frontend
- **Ethers.js v5.7.2** for wallet generation
- **BIP39 standard** for mnemonic generation
- **Google Sign-In API** for OAuth authentication
- **Responsive design** with modern CSS
- **Local storage** for client-side seed half

### Backend
- **Node.js with Express** server framework
- **SQLite database** for development (easily upgradeable to PostgreSQL/MySQL)
- **Google Auth Library** for token verification
- **bcrypt** for secure password hashing
- **Helmet.js** for security headers
- **CORS middleware** for cross-origin protection
- **Rate limiting** for API endpoint protection

### Security Architecture
- **Split seed phrase** (6 words server, 6 words local)
- **OAuth 2.0** authentication flow
- **JWT token** verification
- **Database normalization** with foreign key relationships
- **Input validation** and sanitization

## Browser Compatibility

- Chrome/Chromium 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Quick Start

For detailed setup instructions, see `setup-instructions.md`.

```bash
# 1. Install dependencies
npm install

# 2. Configure Google OAuth (see setup-instructions.md)
cp .env.example .env
# Edit .env with your Google Client ID

# 3. Start the backend server
npm start

# 4. In another terminal, serve the frontend
python -m http.server 8080

# 5. Open browser and navigate to:
# http://localhost:8080
```

## License

This tool is provided as-is for educational and personal use. Use at your own risk.

---

**Disclaimer:** This tool generates real Ethereum wallets. The developers are not responsible for any loss of funds. Always verify the security of your environment before generating wallets with real value.
