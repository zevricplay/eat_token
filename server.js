const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const mongoose = require('mongoose');
const crypto = require('crypto');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fftools', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Models
const UserSchema = new mongoose.Schema({
    email: String,
    uid: String,
    provider: String,
    tokens: [{
        eat: String,
        jwt: String,
        accessToken: String,
        createdAt: { type: Date, default: Date.now }
    }],
    bio: String,
    region: String,
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// Routes

// 1. Token Conversion - EAT to JWT
app.post('/api/convert/eat-to-jwt', async (req, res) => {
    try {
        const { eat, region } = req.body;

        if (!eat) {
            return res.status(400).json({ error: 'EAT token required' });
        }

        // Decode and verify EAT token
        const payload = Buffer.from(eat, 'hex').toString('utf-8');
        
        // Generate JWT
        const jwtToken = jwt.sign(
            { data: payload },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            jwtToken: jwtToken,
            region: region || 'ID'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Token Conversion - EAT to Access Token
app.post('/api/convert/eat-to-access', async (req, res) => {
    try {
        const { eat, region } = req.body;

        if (!eat) {
            return res.status(400).json({ error: 'EAT token required' });
        }

        // Generate Access Token
        const accessToken = 'access_' + crypto.randomBytes(32).toString('hex');

        res.json({
            success: true,
            accessToken: accessToken,
            region: region || 'ID',
            expiresIn: 3600
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Token Conversion - Access Token to JWT
app.post('/api/convert/access-to-jwt', async (req, res) => {
    try {
        const { accessToken, region } = req.body;

        if (!accessToken) {
            return res.status(400).json({ error: 'Access token required' });
        }

        const jwtToken = jwt.sign(
            { accessToken: accessToken },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            jwtToken: jwtToken,
            region: region || 'ID'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Token Conversion - JWT to EAT
app.post('/api/convert/jwt-to-eat', async (req, res) => {
    try {
        const { jwtToken } = req.body;

        if (!jwtToken) {
            return res.status(400).json({ error: 'JWT token required' });
        }

        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET || 'your-secret-key');
        const eat = Buffer.from(JSON.stringify(decoded.data)).toString('hex');

        res.json({
            success: true,
            eat: eat
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. Bio Generator - Long Bio
app.post('/api/bio/generate', async (req, res) => {
    try {
        const { style, length } = req.body;

        const bioStyles = {
            gaming: '🎮 GAMER 🎮 | FF PLAYER | ❤️ GAMING ❤️',
            aesthetic: '✨ Aesthetic ✨ | Living my best life',
            cool: '😎 COOL 😎 | King of the game',
            romantic: '❤️ Forever Young ❤️ | Love Life',
            motivational: '💪 Never Give Up 💪 | Success Seeker',
            stylish: '💎 STYLISH 💎 | Flexing Hard'
        };

        const bio = bioStyles[style] || bioStyles.gaming;

        res.json({
            success: true,
            bio: bio,
            preview: bio
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 6. Update Bio
app.post('/api/bio/update', async (req, res) => {
    try {
        const { uid, bio, jwtToken, region } = req.body;

        if (!uid || !bio || !jwtToken) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Verify JWT
        jwt.verify(jwtToken, process.env.JWT_SECRET || 'your-secret-key');

        // Update user bio in database
        await User.findOneAndUpdate(
            { uid: uid },
            { bio: bio, region: region },
            { upsert: true }
        );

        res.json({
            success: true,
            message: 'Bio updated successfully',
            bio: bio
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 7. Save Token History
app.post('/api/history/save', async (req, res) => {
    try {
        const { uid, eat, jwt: jwtToken, accessToken, provider, region } = req.body;

        const user = await User.findOneAndUpdate(
            { uid: uid },
            {
                $push: {
                    tokens: {
                        eat: eat,
                        jwt: jwtToken,
                        accessToken: accessToken
                    }
                },
                provider: provider,
                region: region
            },
            { upsert: true, new: true }
        );

        res.json({
            success: true,
            message: 'Token saved to history'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 8. Get User History
app.get('/api/history/:uid', async (req, res) => {
    try {
        const { uid } = req.params;

        const user = await User.findOne({ uid: uid });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            success: true,
            history: user.tokens.slice(-10) // Last 10 tokens
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 9. Google OAuth Callback
app.post('/api/auth/google', async (req, res) => {
    try {
        const { token } = req.body;

        // Verify Google token
        const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`);
        
        const user = await User.findOneAndUpdate(
            { email: response.data.email },
            {
                email: response.data.email,
                provider: 'google'
            },
            { upsert: true, new: true }
        );

        res.json({
            success: true,
            user: user,
            sessionToken: jwt.sign({ uid: user._id }, process.env.JWT_SECRET || 'your-secret-key')
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 10. Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server running' });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
