# Setup & Installation Guide

Complete guide to set up the Zerodha Risk Platform for development and testing.

## Prerequisites

- **Node.js** >= 18.x (with npm)
- **Python** >= 3.9 (for market engine)
- **Redis** (for price caching and real-time updates)
- **SQLite3** (comes with system on macOS/Linux)

### Install Prerequisites

**macOS:**
```bash
# Install Node.js and npm (via Homebrew)
brew install node

# Install Python
brew install python3

# Install Redis
brew install redis
```

**Linux (Ubuntu/Debian):**
```bash
# Install Node.js and npm
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Python
sudo apt-get install python3 python3-pip

# Install Redis
sudo apt-get install redis-server
```

## Repository Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/zerodha-risk-platform.git
cd zerodha-risk-platform
```

### 2. Next.js Frontend Setup

```bash
cd trading-platform-nextjs

# Install dependencies
npm install

# Create environment file
cat > .env.local << 'EOF'
# Database
DATABASE_URL="file:./prisma/dev.db"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRY="24h"

# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:3000"
NEXT_PUBLIC_WS_URL="ws://localhost:3000/ws"

# Redis Configuration
REDIS_URL="redis://localhost:6379"
REDIS_HOST="localhost"
REDIS_PORT=6379

# Market Engine
MARKET_ENGINE_INTERVAL=2000
EOF
```

## Database Setup

### 1. Initialize Database

```bash
cd trading-platform-nextjs

# Run migrations
npx prisma migrate dev

# (Optional) Seed test data
npx prisma db seed
```

### 2. Create Test User (if not created)

```bash
# Access the database
cd trading-platform-nextjs
sqlite3 prisma/dev.db

# Insert test user with bcrypt-hashed password "test123"
INSERT INTO User (id, email, password, name, role, createdAt, updatedAt)
VALUES (
  'test-user-id-12345678',
  'test@trader.com',
  '$2b$10$cOuzLm.6PJuRiYNGjpcYv.3Az7xjWlrgU.aEQ2KD8Y2bUhuY6a25K',
  'Test Trader',
  'USER',
  datetime('now'),
  datetime('now')
);

# Create trading account with $100,000 balance
INSERT INTO Account (id, userId, balance, createdAt, updatedAt)
VALUES (
  'test-account-id-987654321',
  'test-user-id-12345678',
  100000,
  datetime('now'),
  datetime('now')
);

# Verify
SELECT * FROM User WHERE email = 'test@trader.com';
.quit
```

## Starting Services

### Terminal 1: Redis Cache

```bash
# Start Redis service
brew services start redis

# Verify Redis is running
redis-cli ping
# Should output: PONG
```

### Terminal 2: Market Engine

```bash
cd /path/to/zerodha-risk-platform

# Install Python dependencies (if needed)
pip3 install redis

# Start market engine
python3 market_engine.py

# Expected output:
# Starting market engine...
# Broadcasting prices to Redis...
# Price update 1: AAPL=$150.25
# Price update 2: GOOGL=$140.50
# ...
```

### Terminal 3: Next.js Server

```bash
cd /path/to/zerodha-risk-platform/trading-platform-nextjs

# Start development server
npm run dev

# Expected output:
# ▲ Next.js 14.0.0
# - Local:        http://localhost:3000
# ✓ Ready in 2.5s
```

## Verify Installation

### 1. Check Services Are Running

```bash
# Check Redis
redis-cli ping
# Output: PONG

# Check Node process
lsof -i :3000 | grep node
# Output: Shows node process on port 3000

# Verify WebSocket connection
curl -i http://localhost:3000/api/ws 2>/dev/null | head -5
```

### 2. Test Login

Open browser and navigate to `http://localhost:3000/login`

**Test Credentials:**
- Email: `test@trader.com`
- Password: `test123`

**Expected Flow:**
1. Enter credentials → Click "Login"
2. Redirect to dashboard with portfolio data
3. Open DevTools Console → Run: `localStorage.getItem('token')`
4. Should return long JWT string (not null)

### 3. Test Trading

On dashboard:
1. Click "BUY" button → Trade dialog opens
2. Enter quantity (e.g., 10) → Click "Place Order"
3. Should see success toast notification
4. Holdings table should update with new position

## Environment Variables Reference

```env
# Database Configuration
DATABASE_URL              # SQLite connection string (file:./prisma/dev.db)

# Authentication (Required)
JWT_SECRET               # Secret key for signing JWT tokens (min 32 chars)
JWT_EXPIRY              # Token expiry time (default: 24h)

# API & WebSocket
NEXT_PUBLIC_API_URL     # Frontend API base URL (http://localhost:3000)
NEXT_PUBLIC_WS_URL      # WebSocket endpoint (ws://localhost:3000/ws)

# Redis Configuration
REDIS_URL               # Full Redis connection URL
REDIS_HOST              # Redis server host (localhost)
REDIS_PORT              # Redis server port (6379)

# Market Engine
MARKET_ENGINE_INTERVAL  # Price update frequency in ms (default: 2000)
```

## Troubleshooting

### Issue: "Port 3000 already in use"

```bash
# Find and kill process on port 3000
lsof -i :3000 | grep -v COMMAND | awk '{print $2}' | xargs kill -9

# Verify port is free
lsof -i :3000
# Should be empty
```

### Issue: "Redis connection refused"

```bash
# Check if Redis is running
redis-cli ping
# If error, start Redis:
brew services start redis
# Or on Linux:
sudo systemctl start redis-server
```

### Issue: "Database file not found"

```bash
cd trading-platform-nextjs
# Run migrations
npx prisma migrate dev
```

### Issue: "Login fails / Invalid credentials"

```bash
# Check JWT_SECRET in .env.local
cat .env.local | grep JWT_SECRET

# Re-create test user with correct password hash
sqlite3 prisma/dev.db << 'EOF'
DELETE FROM User WHERE email = 'test@trader.com';
INSERT INTO User (id, email, password, name, role, createdAt, updatedAt)
VALUES (
  'test-user-id-12345678',
  'test@trader.com',
  '$2b$10$cOuzLm.6PJuRiYNGjpcYv.3Az7xjWlrgU.aEQ2KD8Y2bUhuY6a25K',
  'Test Trader',
  'USER',
  datetime('now'),
  datetime('now')
);
.quit
EOF
```

### Issue: "WebSocket connection failed"

```bash
# Check WebSocket path logs in browser DevTools
# Look for: ws://localhost:3000/ws

# Ensure Redis is running (WebSocket relies on Redis for pub/sub)
redis-cli ping

# Check server logs for connection errors
# Look in Next.js terminal output for [ws] messages
```

### Issue: "Authentication header mismatch"

```bash
# Check localStorage has token
Open DevTools → Console → Run:
localStorage.getItem('token')
# Should return: eyJhbGci... (not null/undefined)

# Check API request uses token
Open DevTools → Network tab
Click "Trade" → Check request headers → Authorization: Bearer eyJ...
```

## Development Commands

```bash
cd trading-platform-nextjs

# Development server with hot reload
npm run dev

# Build for production
npm run build

# Start production build
npm start

# Lint code
npm run lint

# Type check
npx tsc --noEmit

# View database (interactive UI)
npx prisma studio

# Create database migration
npx prisma migrate dev --name <migration-name>

# Reset database (warning: deletes all data)
npx prisma migrate reset
```

## Production Deployment

### Pre-deployment Checklist

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Update `NEXT_PUBLIC_API_URL` to production domain
- [ ] Update `NEXT_PUBLIC_WS_URL` to production WebSocket URL
- [ ] Configure `DATABASE_URL` to production database
- [ ] Set `NODE_ENV=production`
- [ ] Enable CORS for production domains
- [ ] Configure Redis for production (separate server, authentication)

### Build & Deploy

```bash
# Build application
npm run build

# Start production server
npm start

# Or use process manager (pm2)
npm install -g pm2
pm2 start npm --name "trading-platform" -- start
pm2 save
pm2 startup
```

## Next Steps

1. **[Read API Documentation](API.md)** - Understand available endpoints
2. **[Review Architecture](ARCHITECTURE.md)** - Learn system design
3. **[Start Testing](TESTING.md)** - Run test scenarios
4. **[Customize Design](DESIGN_SYSTEM.md)** - Adapt UI to your needs

---

**Having issues?** Check the Troubleshooting section above or review the individual service logs for error messages.
