# Secure Ethereum Wallet Generator - Setup Instructions

This application implements a secure wallet generation system that splits seed phrases between server and local storage, protected by Google OAuth authentication.

## Features

- **Split Seed Phrase Storage**: Words 1-6 stored on server, words 7-12 stored locally
- **Google OAuth Protection**: Server half tied to Google account
- **Enhanced Security**: Even if one half is compromised, wallet remains secure
- **Local Generation**: Wallet creation still happens client-side
- **Recovery System**: Combine both halves to recover wallet

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API and Google Sign-In API
4. Go to "Credentials" section
5. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:8080` (or your domain)
   - Authorized redirect URIs: `http://localhost:8080` (or your domain)
6. Copy the Client ID

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file:
   ```
   PORT=3000
   FRONTEND_URL=http://localhost:8080
   GOOGLE_CLIENT_ID=your_actual_google_client_id_here
   JWT_SECRET=your_very_long_random_jwt_secret_here
   DB_PATH=./wallet_storage.db
   ```

### 4. Update Frontend Configuration

In `index.html`, replace the Google Client ID:

```javascript
const GOOGLE_CLIENT_ID = 'your_actual_google_client_id_here.apps.googleusercontent.com';
```

Also update the meta tag:
```html
<meta name="google-signin-client_id" content="your_actual_google_client_id_here.apps.googleusercontent.com">
```

### 5. Start the Application

1. Start the backend server:
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

2. Serve the frontend (in a new terminal):
   ```bash
   # Option 1: Simple HTTP server
   python -m http.server 8080
   
   # Option 2: Using Node.js http-server
   npx http-server -p 8080
   
   # Option 3: Using Live Server (VS Code extension)
   # Right-click index.html -> "Open with Live Server"
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

## How It Works

### Seed Phrase Splitting

1. User generates a 12-word seed phrase
2. Application splits it:
   - **Server Half**: Words 1-6 → Stored in database (hashed)
   - **Local Half**: Words 7-12 → Stored in browser localStorage

### Authentication Flow

1. User signs in with Google
2. Google token verified with Google's servers
3. User account created/retrieved in database
4. Server half tied to user's Google ID

### Security Features

- **Double Protection**: Need both Google account access AND local storage
- **Hashed Storage**: Server half is bcrypt hashed (salt rounds: 12)
- **Rate Limiting**: API endpoints protected against brute force
- **CORS Protection**: Only allowed origins can access API
- **Input Validation**: All inputs validated and sanitized

### Recovery Process

1. User signs in with Google account
2. User enters their local half (words 7-12)
3. System verifies local half matches stored data
4. Full seed phrase reconstructed for wallet recovery

## API Endpoints

- `POST /auth/google` - Authenticate with Google token
- `POST /store-seed-half` - Store server half of seed phrase
- `POST /verify-seed` - Verify full seed phrase reconstruction
- `POST /check-stored-seed` - Check if user has stored seed
- `GET /health` - Health check endpoint

## Security Considerations

### Production Deployment

1. **Use HTTPS**: Never deploy without SSL/TLS
2. **Secure Database**: Use encrypted database or encrypt sensitive fields
3. **Environment Variables**: Never commit actual credentials
4. **Rate Limiting**: Implement stricter rate limits
5. **Monitoring**: Add logging and monitoring
6. **Backup Strategy**: Implement secure database backups

### Client-Side Security

1. **Local Storage**: Consider more secure storage methods
2. **Browser Security**: Warn users about browser security
3. **Clear Data**: Implement secure data clearing on logout
4. **Validation**: Client-side validation as backup

## Development Notes

- Database: SQLite (development) → PostgreSQL/MySQL (production)
- Authentication: Google OAuth 2.0 with JWT verification
- Encryption: bcrypt for password hashing (salt rounds: 12)
- Framework: Express.js with security middleware

## Troubleshooting

### Common Issues

1. **Google Sign-In Not Working**:
   - Check Client ID is correct
   - Verify authorized origins in Google Console
   - Check browser console for errors

2. **Database Errors**:
   - Ensure write permissions in project directory
   - Check SQLite installation

3. **CORS Errors**:
   - Verify FRONTEND_URL matches your serving port
   - Check CORS configuration in server.js

4. **Authentication Failures**:
   - Verify Google Client ID environment variable
   - Check network connectivity
   - Validate token expiration

### Testing the Setup

1. Sign in with Google account
2. Generate a new wallet
3. Note the split seed phrase
4. Clear localStorage and refresh
5. Sign in again and try to reconstruct
6. Verify both halves are required

## License

This tool is provided as-is for educational and personal use. Use at your own risk.

**Disclaimer**: This tool generates real Ethereum wallets. The developers are not responsible for any loss of funds. Always verify the security of your environment before generating wallets with real value.