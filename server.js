const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { OAuth2Client } = require('google-auth-library');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8080',
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Database setup
const db = new sqlite3.Database('./wallet_storage.db');

// Initialize database tables
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        google_id TEXT UNIQUE NOT NULL,
        email TEXT NOT NULL,
        name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS seed_halves (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        seed_half_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);
});

// Verify Google token
async function verifyGoogleToken(token) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        return ticket.getPayload();
    } catch (error) {
        console.error('Error verifying Google token:', error);
        return null;
    }
}

// Routes

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Google authentication
app.post('/auth/google', async (req, res) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }

        const payload = await verifyGoogleToken(token);
        if (!payload) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        const { sub: googleId, email, name } = payload;

        // Check if user exists
        db.get('SELECT * FROM users WHERE google_id = ?', [googleId], (err, user) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (user) {
                // User exists
                res.json({
                    success: true,
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name
                    },
                    isNewUser: false
                });
            } else {
                // Create new user
                db.run('INSERT INTO users (google_id, email, name) VALUES (?, ?, ?)', 
                    [googleId, email, name], 
                    function(err) {
                        if (err) {
                            console.error('Database error:', err);
                            return res.status(500).json({ error: 'Failed to create user' });
                        }

                        res.json({
                            success: true,
                            user: {
                                id: this.lastID,
                                email,
                                name
                            },
                            isNewUser: true
                        });
                    }
                );
            }
        });
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
});

// Store seed phrase half
app.post('/store-seed-half', async (req, res) => {
    try {
        const { token, seedHalf } = req.body;

        if (!token || !seedHalf) {
            return res.status(400).json({ error: 'Token and seed half are required' });
        }

        const payload = await verifyGoogleToken(token);
        if (!payload) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        const googleId = payload.sub;

        // Get user ID
        db.get('SELECT id FROM users WHERE google_id = ?', [googleId], async (err, user) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Hash the seed half for storage
            const seedHalfHash = await bcrypt.hash(seedHalf, 12);

            // Check if user already has a stored seed half
            db.get('SELECT id FROM seed_halves WHERE user_id = ?', [user.id], (err, existingSeed) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Database error' });
                }

                if (existingSeed) {
                    // Update existing seed half
                    db.run('UPDATE seed_halves SET seed_half_hash = ? WHERE user_id = ?', 
                        [seedHalfHash, user.id], 
                        (err) => {
                            if (err) {
                                console.error('Database error:', err);
                                return res.status(500).json({ error: 'Failed to update seed half' });
                            }
                            res.json({ success: true, message: 'Seed half updated successfully' });
                        }
                    );
                } else {
                    // Store new seed half
                    db.run('INSERT INTO seed_halves (user_id, seed_half_hash) VALUES (?, ?)', 
                        [user.id, seedHalfHash], 
                        (err) => {
                            if (err) {
                                console.error('Database error:', err);
                                return res.status(500).json({ error: 'Failed to store seed half' });
                            }
                            res.json({ success: true, message: 'Seed half stored successfully' });
                        }
                    );
                }
            });
        });
    } catch (error) {
        console.error('Store seed half error:', error);
        res.status(500).json({ error: 'Failed to store seed half' });
    }
});

// Verify seed phrase reconstruction
app.post('/verify-seed', async (req, res) => {
    try {
        const { token, fullSeedPhrase } = req.body;

        if (!token || !fullSeedPhrase) {
            return res.status(400).json({ error: 'Token and full seed phrase are required' });
        }

        const payload = await verifyGoogleToken(token);
        if (!payload) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        const googleId = payload.sub;

        // Get user and their stored seed half
        db.get(`
            SELECT u.id, sh.seed_half_hash 
            FROM users u 
            LEFT JOIN seed_halves sh ON u.id = sh.user_id 
            WHERE u.google_id = ?
        `, [googleId], async (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (!result) {
                return res.status(404).json({ error: 'User not found' });
            }

            if (!result.seed_half_hash) {
                return res.status(404).json({ error: 'No seed half stored for this user' });
            }

            // Split the provided full seed phrase
            const words = fullSeedPhrase.trim().split(' ');
            if (words.length !== 12) {
                return res.status(400).json({ error: 'Invalid seed phrase length' });
            }

            const firstHalf = words.slice(0, 6).join(' ');
            
            // Verify the first half matches stored hash
            const isValid = await bcrypt.compare(firstHalf, result.seed_half_hash);
            
            res.json({ 
                success: true, 
                isValid,
                message: isValid ? 'Seed phrase is valid' : 'Seed phrase does not match stored data'
            });
        });
    } catch (error) {
        console.error('Verify seed error:', error);
        res.status(500).json({ error: 'Failed to verify seed phrase' });
    }
});

// Check if user has stored seed half
app.post('/check-stored-seed', async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }

        const payload = await verifyGoogleToken(token);
        if (!payload) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        const googleId = payload.sub;

        db.get(`
            SELECT COUNT(*) as count 
            FROM users u 
            JOIN seed_halves sh ON u.id = sh.user_id 
            WHERE u.google_id = ?
        `, [googleId], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            res.json({ 
                success: true, 
                hasSeedStored: result.count > 0 
            });
        });
    } catch (error) {
        console.error('Check stored seed error:', error);
        res.status(500).json({ error: 'Failed to check stored seed' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check available at http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down gracefully...');
    db.close();
    process.exit(0);
});