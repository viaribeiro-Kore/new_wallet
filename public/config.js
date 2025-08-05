// Configuration file for the Secure Ethereum Wallet Generator
// Update these values for your deployment

window.WalletConfig = {
    // API Configuration
    API_BASE_URL: 'http://localhost:3000',
    
    // Google OAuth Configuration
    // Replace with your actual Google Client ID from Google Cloud Console
    GOOGLE_CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    
    // Security Settings
    SECURITY: {
        // Clear sensitive data on page unload
        clearOnUnload: true,
        
        // Show security warnings
        showWarnings: true,
        
        // Local storage key for seed half
        localStorageKey: 'walletLocalSeedHalf'
    },
    
    // UI Configuration
    UI: {
        // Auto-hide sensitive information after this time (milliseconds)
        autoHideDelay: 300000, // 5 minutes
        
        // Show detailed error messages (disable in production)
        detailedErrors: true
    }
};