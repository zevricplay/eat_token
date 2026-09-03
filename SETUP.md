# Setup Guide - Free Fire Token Generator

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Git
- npm or yarn

---

## 📦 Installation

### Step 1: Clone Repository
```bash
git clone https://github.com/zevricplay/eat_token.git
cd eat_token
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Setup Environment Variables
```bash
cp .env.example .env
```

Edit `.env` file with your configurations:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fftools
JWT_SECRET=your-super-secret-key
```

### Step 4: Start MongoDB
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (Cloud)
# Update MONGODB_URI in .env
```

### Step 5: Start Backend Server
```bash
npm start
# Server running on http://localhost:5000
```

### Step 6: Open Frontend
```bash
# Option 1: Open in Browser
open index.html

# Option 2: Use Live Server
npm run dev
```

---

## 🔑 OAuth Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs:
   ```
   http://localhost:5000/auth/google/callback
   https://youromain.com/auth/google/callback
   ```
6. Copy Client ID and Secret to `.env`:
   ```env
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   ```

### Facebook OAuth

1. Go to [Facebook Developers](https://developers.facebook.com)
2. Create new app
3. Add Facebook Login product
4. Configure OAuth Redirect URIs:
   ```
   http://localhost:5000/auth/facebook/callback
   https://yourdomain.com/auth/facebook/callback
   ```
5. Add to `.env`:
   ```env
   FACEBOOK_APP_ID=your_app_id
   FACEBOOK_APP_SECRET=your_app_secret
   ```

### Apple OAuth

1. Go to [Apple Developer](https://developer.apple.com)
2. Create App ID with Sign in with Apple capability
3. Generate private key
4. Add to `.env`:
   ```env
   APPLE_TEAM_ID=your_team_id
   APPLE_KEY_ID=your_key_id
   APPLE_PRIVATE_KEY=your_private_key
   ```

---

## 🌐 Deployment

### Option 1: Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret
heroku config:set MONGODB_URI=your_mongodb_uri

# Deploy
git push heroku main

# View logs
heroku logs -t
```

### Option 2: DigitalOcean / VPS

```bash
# SSH into server
ssh root@your_server_ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
curl -fsSL https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Clone and setup
git clone https://github.com/zevricplay/eat_token.git
cd eat_token
npm install

# Create .env file
nano .env

# Install PM2 for process management
npm install -g pm2
pm2 start server.js
pm2 save
```

### Option 3: Docker

```bash
# Build image
docker build -t fftools:latest .

# Run container
docker run -p 5000:5000 \
  -e MONGODB_URI=mongodb://mongo:27017/fftools \
  -e JWT_SECRET=your-secret \
  fftools:latest

# With Docker Compose
docker-compose up -d
```

---

## 🔒 SSL Certificate (HTTPS)

### Using Let's Encrypt

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Nginx Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 📊 Database Backup

### MongoDB Backup
```bash
# Backup
mongodump --uri="mongodb://localhost:27017/fftools" --out ./backup

# Restore
mongorestore --uri="mongodb://localhost:27017" ./backup
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### MongoDB Connection Error
```bash
# Check MongoDB status
systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
```

### CORS Error
Make sure `CORS_ORIGIN` in `.env` matches your frontend domain:
```env
CORS_ORIGIN=http://localhost:3000
```

### Token Conversion Not Working
1. Check JWT_SECRET is set
2. Verify token format
3. Check server logs: `npm start` or `heroku logs -t`

---

## 📈 Monitoring

### PM2 Monitoring
```bash
# Show status
pm2 status

# Monitor real-time
pm2 monit

# View logs
pm2 logs
```

### Using New Relic (Optional)
```bash
npm install newrelic
# Add to top of server.js: require('newrelic');
```

---

## 🚨 Security Best Practices

1. ✅ Use strong JWT_SECRET
2. ✅ Enable HTTPS
3. ✅ Use environment variables for secrets
4. ✅ Enable CORS only for trusted domains
5. ✅ Implement rate limiting
6. ✅ Regular security updates: `npm audit`
7. ✅ Use MongoDB authentication
8. ✅ Enable firewall rules

---

## 📞 Support

- GitHub Issues: [Report issues](https://github.com/zevricplay/eat_token/issues)
- Email: support@fftools.site

---

**Version:** 2.0.0  
**Last Updated:** September 2024
