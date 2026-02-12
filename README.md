# 📊 Zerodha Risk Platform

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-14.0+-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=flat-square&logo=python)](https://www.python.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-Latest-DC382D?style=flat-square&logo=redis)](https://redis.io/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=flat-square)](README.md)

**A modern, real-time trading risk management platform for institutional and retail traders**

[🎯 Quick Start](#installation--setup) • [📖 Full Docs](#-table-of-contents) • [🚀 Deploy](#deployment) • [💬 Report Issues](https://github.com/yourusername/zerodha-risk-platform/issues)

</div>

---

## 🎬 Platform Overview

This system enables traders to execute trades, monitor portfolio risk, and manage trading constraints in real-time with comprehensive analytics and controls.

**Built with:** Next.js + React • TypeScript • Tailwind CSS • PostgreSQL • Redis • Python FastAPI

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Project Structure](#project-structure)
- [Running the Platform](#running-the-platform)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Environment Configuration](#environment-configuration)
- [Deployment](#deployment)
- [Platform Status & Roadmap](#platform-status--roadmap)
- [Support & Troubleshooting](#support--troubleshooting)
- [Additional Resources](#additional-resources)

---

## ✨ Core Highlights

<table>
<tr>
<td align="center" width="33%">
  <h3>⚡ Real-Time Trading</h3>
  <p>Execute buy/sell orders with instant confirmation and live price updates every 2 seconds</p>
</td>
<td align="center" width="33%">
  <h3>📊 Advanced Analytics</h3>
  <p>Comprehensive 4-tab analysis with holdings, performance, risk metrics & history</p>
</td>
<td align="center" width="33%">
  <h3>🛡️ Risk Management</h3>
  <p>Automated constraints, VaR calculations, position limits & risk alerts</p>
</td>
</tr>
<tr>
<td align="center">
  <h3>🔐 Enterprise Security</h3>
  <p>JWT authentication, bcrypt hashing, 2FA/OTP, parameterized queries</p>
</td>
<td align="center">
  <h3>🎨 Modern UI/UX</h3>
  <p>Shadcn UI components, dark/light theme, responsive design, smooth animations</p>
</td>
<td align="center">
  <h3>☁️ Production Ready</h3>
  <p>Deployed on Vercel, PostgreSQL, Redis with CI/CD & free tier support</p>
</td>
</tr>
</table>

---

## Overview

The **Zerodha Risk Platform** is an enterprise-grade trading system that combines real-time market data, portfolio analytics, and risk management into a unified interface. Built for institutional and retail traders, it provides:

- **Real-time Trading Interface**: Execute buy/sell orders with instant order confirmation
- **Portfolio Analytics**: Comprehensive 4-tab analysis system covering holdings, performance, risk metrics, and historical data
- **Risk Management**: Automated risk constraints, position limits, and portfolio value at risk (VaR) calculations
- **Live Market Updates**: WebSocket-based real-time price updates every 2 seconds
- **Execution Monitoring**: Track and analyze all trades with detailed order history and statistics
- **Portfolio Controls**: Risk management settings, margin requirements, and constraint management

**Status**: Production-ready system with enterprise-grade features and real-time capabilities deployed to Vercel.

### Trading Workflow

```
┌─────────────┐
│   Trader    │
│  (Browser)  │
└──────┬──────┘
       │
       ├─────────────────────────────────────────────────┐
       │                                                 │
       ▼                                                 ▼
┌──────────────────┐                          ┌────────────────────┐
│  LIVE DASHBOARD  │                          │ PORTFOLIO ANALYSIS │
│ • Order Entry    │                          │ • Holdings        │
│ • Price Ticker   │────────────┬─────────────│ • Performance     │
│ • Position View  │            │             │ • Risk Metrics    │
└──────────────────┘            │             │ • Price History   │
                                │             └────────────────────┘
                         ┌──────▼──────┐
                         │   SERVER    │
                         │ (Next.js)   │
                         └──────┬──────┘
                                │
                    ┌───────────┼───────────┐
                    │           │           │
            ┌───────▼────┐  ┌──▼──┐  ┌────▼───────┐
            │ Database   │  │Cache│  │ Risk Engine│
            │ (Orders,   │  │(Redis)  │(FastAPI)   │
            │ Holdings)  │  │         │            │
            └────────────┘  └────┬───┘  └───────────┘
                                 │
                    ┌────────────▼────────────┐
                    │ WebSocket Broadcast     │
                    │(Real-time Updates)      │
                    └────────────┬────────────┘
                                 │
                         ┌───────▼────────┐
                         │ All Connected  │
                         │ Clients Update │
                         │ (2sec interval)│
                         └────────────────┘
```

---

## Key Features

### 🎯 Core Trading Features
- **Order Execution**: BUY/SELL orders with real-time confirmation
- **Portfolio Holdings**: View current positions by symbol with quantity and average price
- **Order History**: Complete transaction history with timestamps and status tracking
- **Live Pricing**: Real-time price updates via market engine update interval (default: 2 seconds)

### 📊 Analytics & Reporting
- **Portfolio Overview**: Dashboard showing total portfolio value and recent activity
- **Holdings Analysis**: Detailed breakdown of all current positions
- **Performance Tracking**: Returns calculation and performance metrics over time
- **Risk Metrics**: Value at Risk (VaR), volatility, maximum drawdown calculations
- **Price History**: Historical price tracking with charting capabilities

### 🛡️ Risk Management
- **Position Limits**: Maximum position size constraints per symbol
- **Portfolio Constraints**: Overall portfolio risk thresholds
- **Margin Management**: Account balance and buying power tracking
- **Risk Score**: Algorithmic risk assessment using VaR, volatility, and drawdown
- **Real-time Alerts**: Risk threshold notifications and violation alerts

### 🔐 Security & Authentication
- **User Authentication**: Email/password login with JWT token-based sessions
- **Two-Factor Authentication**: OTP verification via email (speakeasy integration)
- **Password Security**: bcryptjs hashing with salting
- **Request Validation**: Server-side validation for all API endpoints
- **Database Encryption**: Prepared statements and parameterized queries

### ⚡ Real-time Capabilities
- **WebSocket Connection**: Live price updates and portfolio change notifications
- **Redis Pub/Sub**: Event broadcasting for multi-client synchronization
- **Session Management**: Real-time user session tracking
- **State Synchronization**: Automatic client state updates on server changes

### 🎨 User Interface
- **Modern Design System**: Shadcn UI components with Tailwind CSS
- **Dark/Light Theme**: Theme toggle with persistent preferences
- **Responsive Layout**: Mobile-friendly design across all breakpoints
- **Interactive Charts**: Recharts-based portfolio visualization
- **Modal Dialogs**: Clean UX for trade execution and settings
- **Toast Notifications**: Real-time feedback with Sonner/React Hot Toast

---

## Technology Stack

### **Frontend**
| Technology | Purpose | Version |
|------------|---------|---------|
| Next.js | React metaframework with SSR and API routes | ^14.0.0 |
| React | UI library and component system | ^18.0.0 |
| TypeScript | Type-safe JavaScript | ^5.0.0 |
| Tailwind CSS | Utility-first CSS framework | ^3.4.0 |
| Shadcn UI | High-quality React components | Built on Radix UI |
| Radix UI | Unstyled, accessible component primitives | Multiple packages |
| Recharts | Composable React charts library | ^2.10.0 |
| Framer Motion | Animation library for React | ^11.11.6 |
| WebSocket (ws) | Real-time bidirectional communication | ^8.19.0 |
| IORedis | Redis client for Node.js | ^5.9.2 |
| Lucide React | Icon library | ^0.563.0 |

### **Backend / Runtime**
| Technology | Purpose | Version |
|------------|---------|---------|
| Node.js | JavaScript runtime | >=18.x |
| Next.js API Routes | Serverless functions for backend | ^14.0.0 |
| Prisma ORM | Type-safe database toolkit | ^5.22.0 |

### **Database & Storage**
| Technology | Use Case | Environment |
|------------|----------|-------------|
| SQLite | File-based SQL database | Development |
| PostgreSQL | Relational database | Production |
| Supabase | Managed PostgreSQL hosting | Production |
| Redis | In-memory cache and message broker | Development & Production |
| Upstash | Managed Redis | Production |

### **Python Services (Risk Engine)**
| Technology | Purpose |
|-----------|---------|
| FastAPI | High-performance async API framework |
| Pydantic | Data validation and settings management |
| Pandas | Data manipulation and analysis |
| NumPy | Numerical computing |
| yfinance | Market data downloads from Yahoo Finance |

### **Authentication & Security**
| Technology | Purpose |
|-----------|---------|
| JWT (jsonwebtoken) | Stateless authentication tokens |
| bcryptjs | Password hashing and verification |
| Speakeasy | 2FA/OTP generation and verification |
| Nodemailer | Email sending for OTP and notifications |

### **Development Tools**
| Tool | Purpose |
|------|---------|
| ESLint | Code linting and quality |
| Prettier | Code formatting |
| npm/yarn | Package management |
| Git | Version control |
| Docker | Containerization (optional) |

---

## Architecture

### High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          Browser / Client                                │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  Next.js Frontend (React + TypeScript + Tailwind)               │   │
│  │  ├─ Dashboard: Trading interface with live prices              │   │
│  │  ├─ Analysis: 4-tab portfolio analytics                        │   │
│  │  ├─ Execution: Order history & statistics                      │   │
│  │  ├─ Controls: Risk management settings                         │   │
│  │  ├─ Settings: User preferences & account settings             │   │
│  │  └─ Auth: Login/Signup/Verify pages                           │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                              │                                            │
│                 REST API + WebSocket Connection                          │
└─────────────────────────────┼────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
    ┌────▼─────────┐   ┌─────▼──────────┐   ┌────▼──────────┐
    │ Next.js      │   │  Redis Cache   │   │  Python       │
    │ Server       │   │  (Port 6379)   │   │  FastAPI      │
    │ (Port 3000)  │   │                │   │  Risk Engine  │
    │              │   │ • Prices       │   │               │
    │ • API Routes │   │ • Sessions     │   │ • Risk Score  │
    │ • Auth       │   │ • Channels     │   │ • VaR calc    │
    │ • WebSocket  │   │                │   │ • Volatility  │
    └────┬─────────┘   └────────────────┘   └───────────────┘
         │
         │
    ┌────▼────────────────────────────┐
    │ PostgreSQL / Supabase Database   │
    │ ├─ Users (auth credentials)      │
    │ ├─ Accounts (balances)           │
    │ ├─ Orders (transaction history)  │
    │ ├─ Holdings (positions)          │
    │ └─ PriceHistory (OHLCV data)     │
    └─────────────────────────────────┘
```

### Data Flow

1. **Authentication Flow**
   - User submits credentials → Server validates with bcrypt → JWT token issued → Token stored in localStorage
   - All subsequent API calls include JWT in Authorization header

2. **Trading Flow**
   - User clicks Trade button → Modal opens → User confirms → POST /api/trade with token
   - Server validates token → Checks constraints (balance, risk limits) → Updates Order & Holding records
   - WebSocket broadcasts portfolio change → All connected clients receive real-time update

3. **Real-time Price Updates**
   - Market Engine (Python) updates Redis every 2 seconds with new prices
   - WebSocket connection monitors Redis pub/sub channel
   - Connected clients receive price updates and re-render charts

4. **Risk Calculation**
   - Portfolio holdings sent to FastAPI risk engine
   - Engine calculates VaR (95%), volatility, max drawdown using 6-month historical data
   - Risk score computed and returned to frontend for display

### Component Architecture

**UI Components** (Shadcn UI + Radix UI)
- Button, Input, Card, Dialog, Select, Dropdown, Alert Dialog, Badge
- Custom TradeDialog, RiskAlert, QuickActions

**Pages & Route Structure**
```
/                       - Dashboard (live trading)
/analysis              - Portfolio analytics (4 tabs)
/execution             - Order history & execution stats
/controls              - Risk management settings
/settings              - User preferences
/login                 - Authentication
/signup                - User registration
/verify                - Email verification
```

**API Routes** (Backend)
```
/api/auth/login        - User authentication
/api/auth/signup       - User registration
/api/auth/verify       - Email verification
/api/trade             - Order execution
/api/portfolio         - Holdings and balance
/api/orders            - Order history
/api/prices            - Current market prices
/api/risk              - Risk metrics calculation
/api/ws                - WebSocket connection
/api-docs              - Swagger API documentation
```

---

## Prerequisites

### System Requirements
- **Operating System**: macOS, Linux, or Windows (WSL2)
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: 2GB for dependencies and database

### Required Software

**Node.js & npm** (>=18.0)
```bash
# macOS
brew install node

# Linux (Ubuntu/Debian)
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version   # Should be >=18.0
npm --version    # Should be >=9.0
```

**Python** (>=3.9)
```bash
# macOS
brew install python3

# Linux (Ubuntu/Debian)
sudo apt-get install python3 python3-pip

# Verify installation
python3 --version  # Should be >=3.9
```

**Redis** (Local development only - skip for Vercel/Cloud deployment)
```bash
# macOS
brew install redis

# Linux (Ubuntu/Debian)
sudo apt-get install redis-server

# Start Redis
redis-server
# or with Homebrew services
brew services start redis

# Verify connection
redis-cli ping  # Should return PONG
```

**Git**
```bash
# macOS
brew install git

# Linux (Ubuntu/Debian)
sudo apt-get install git

# Verify installation
git --version
```

---

## Installation & Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/zerodha-risk-platform.git
cd zerodha-risk-platform
```

### Step 2: Frontend Setup (Next.js)

```bash
cd trading-platform-nextjs

# Install dependencies
npm install

# Generate Prisma client
npm run postinstall
```

### Step 3: Create Environment Configuration

**File**: `trading-platform-nextjs/.env.local`

```bash
cat > .env.local << 'EOF'
# ============================================
# Database Configuration
# ============================================
DATABASE_URL="file:./prisma/dev.db"

# ============================================
# Authentication & Security
# ============================================
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRY="24h"
NEXTAUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# ============================================
# API Configuration
# ============================================
NEXT_PUBLIC_API_URL="http://localhost:3000"
NEXT_PUBLIC_WS_URL="ws://localhost:3000/ws"

# ============================================
# Redis Configuration
# ============================================
REDIS_URL="redis://localhost:6379"
REDIS_HOST="localhost"
REDIS_PORT=6379

# ============================================
# Market Engine (Price Updates)
# ============================================
MARKET_ENGINE_INTERVAL=2000  # ms between updates

# ============================================
# Email/Notifications (Optional)
# ============================================
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
EOF
```

### Step 4: Database Setup

```bash
cd trading-platform-nextjs

# Run Prisma migrations (creates schema)
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# (Optional) Seed with test data
npx prisma db seed
```

### Step 5: Create Test User (Optional)

For quick testing without signup:

```bash
cd trading-platform-nextjs
sqlite3 prisma/dev.db

-- Insert test user (password: test123)
INSERT INTO "User" (id, email, "passwordHash", name, role, "createdAt", "updatedAt")
VALUES (
  'user-001',
  'test@trader.com',
  '$2b$10$cOuzLm.6PJuRiYNGjpcYv.3Az7xjWlrgU.aEQ2KD8Y2bUhuY6a25K',
  'Test Trader',
  'USER',
  datetime('now'),
  datetime('now')
);

-- Create account with $100,000 balance
INSERT INTO "Account" (id, "userId", balance, "createdAt")
VALUES (
  'account-001',
  'user-001',
  100000,
  datetime('now')
);

-- Verify
SELECT * FROM "User" WHERE email = 'test@trader.com';
.quit
```

### Step 6: Python Risk Engine (Optional)

The risk engine provides portfolio risk calculations. It's optional but recommended.

```bash
cd /path/to/zerodha-risk-platform

# For development (if using Python FastAPI)
pip3 install fastapi uvicorn pandas numpy yfinance

# Or use the main.py/market_engine.py in root
python3 main.py  # Starts market engine
```

---

## Project Structure

```
zerodha-risk-platform/
├── README.md                              # Project documentation (you are here)
├── QUICKSTART.md                          # 3-step quick start guide
├── CREDENTIALS_GUIDE.md                   # Help finding API credentials
├── SUPABASE_CONNECTION_HELP.md            # Supabase setup troubleshooting
├── VERCEL_DEPLOYMENT.md                   # Complete deployment guide
│
├── market_engine.py                       # Python market data generator
│                                         # (Simulates real-time price updates)
│
├── main.py                                # Risk engine entry point (FastAPI)
│                                         # (Calculates portfolio risk metrics)
│
├── package.json                           # Root package metadata
│                                         # (Mainly for type definitions)
│
├── docs/                                  # Detailed documentation
│   ├── ARCHITECTURE.md                    # System architecture & data flow
│   ├── SETUP.md                          # Detailed setup instructions
│   ├── API.md                            # Complete API reference
│   ├── DESIGN_SYSTEM.md                  # UI/UX design guidelines
│   ├── TESTING.md                        # Testing strategies
│   └── BUTTON_AUDIT.md                   # UI button inventory
│
├── scripts/                               # Utility scripts
│   └── [Helper scripts for common tasks]
│
├── trading-platform-nextjs/               # Main Next.js application
│   ├── package.json                       # Frontend dependencies
│   ├── tsconfig.json                      # TypeScript configuration
│   ├── next.config.js                     # Next.js configuration
│   ├── tailwind.config.js                 # Tailwind CSS configuration
│   ├── postcss.config.mjs                 # PostCSS configuration
│   ├── eslint.config.mjs                  # ESLint configuration
│   ├── prisma.config.ts                   # Prisma configuration
│   ├── server.js                          # Custom server (optional)
│   │
│   ├── prisma/                            # Database schema & migrations
│   │   ├── schema.prisma                  # Data model definition
│   │   ├── dev.db                        # SQLite development database
│   │   └── migrations/                    # Database migration history
│   │       └── 20260109103954_init/
│   │           └── migration.sql
│   │
│   ├── public/                            # Static assets
│   │   └── [Images, fonts, icons]
│   │
│   ├── src/
│   │   ├── middleware.ts                  # Next.js middleware (auth, etc)
│   │   │
│   │   ├── app/                           # App Router (Next.js 13+)
│   │   │   ├── globals.css                # Global styles
│   │   │   ├── layout.tsx                 # Root layout
│   │   │   ├── page.tsx                   # Home/Dashboard page
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx               # Main trading dashboard
│   │   │   │
│   │   │   ├── analysis/
│   │   │   │   └── page.tsx               # Portfolio analysis (4 tabs)
│   │   │   │                              # Tabs: Holdings, Performance, Risk, History
│   │   │   │
│   │   │   ├── execution/
│   │   │   │   └── page.tsx               # Order execution history
│   │   │   │
│   │   │   ├── controls/
│   │   │   │   └── page.tsx               # Risk management controls
│   │   │   │
│   │   │   ├── settings/
│   │   │   │   └── page.tsx               # User settings & preferences
│   │   │   │
│   │   │   ├── login/
│   │   │   │   └── page.tsx               # Login page
│   │   │   │
│   │   │   ├── signup/
│   │   │   │   └── page.tsx               # User registration page
│   │   │   │
│   │   │   ├── verify/
│   │   │   │   └── page.tsx               # Email/OTP verification page
│   │   │   │
│   │   │   ├── test/
│   │   │   │   └── page.tsx               # Test/demo page
│   │   │   │
│   │   │   └── api/                       # Backend API routes
│   │   │       ├── route.ts               # Health check endpoint
│   │   │       ├── api-docs/              # Swagger/OpenAPI documentation
│   │   │       │   └── route.ts
│   │   │       ├── auth/                  # Authentication endpoints
│   │   │       │   ├── login/route.ts     # Email/password login
│   │   │       │   ├── signup/route.ts    # User registration
│   │   │       │   ├── verify/route.ts    # Email verification
│   │   │       │   ├── verify-otp/route.ts
│   │   │       │   └── logout/route.ts
│   │   │       ├── trade/                 # Trading endpoints
│   │   │       │   └── route.ts           # Execute buy/sell orders
│   │   │       ├── portfolio/             # Portfolio endpoints
│   │   │       │   └── route.ts           # Get holdings and balance
│   │   │       ├── orders/                # Order history endpoints
│   │   │       │   └── route.ts           # Get user's orders
│   │   │       ├── prices/                # Market price endpoints
│   │   │       │   └── route.ts           # Get current prices
│   │   │       ├── risk/                  # Risk calculation endpoints
│   │   │       │   └── route.ts           # Calculate portfolio risk
│   │   │       ├── health/                # Health check
│   │   │       │   └── route.ts
│   │   │       ├── ws/                    # WebSocket endpoint
│   │   │       │   └── route.ts           # Real-time updates
│   │   │       └── analytics/             # Analytics endpoints
│   │   │           └── route.ts
│   │   │
│   │   ├── components/                    # Reusable React components
│   │   │   ├── theme-toggle.tsx           # Dark/Light mode switcher
│   │   │   ├── export-portfolio.tsx       # Portfolio export to CSV/PDF
│   │   │   │
│   │   │   ├── console/
│   │   │   │   └── ConsoleShell.tsx       # Interactive console shell
│   │   │   │
│   │   │   └── ui/                        # Shadcn UI components
│   │   │       ├── button.tsx
│   │   │       ├── input.tsx
│   │   │       ├── card.tsx
│   │   │       ├── dialog.tsx
│   │   │       ├── alert-dialog.tsx
│   │   │       ├── dropdown-menu.tsx
│   │   │       ├── select.tsx
│   │   │       ├── label.tsx
│   │   │       ├── badge.tsx
│   │   │       ├── quick-actions.tsx      # Quick action buttons
│   │   │       ├── trade-dialog.tsx       # Trade execution modal
│   │   │       └── risk-alert.tsx         # Risk warning component
│   │   │
│   │   └── lib/                           # Utility functions & hooks
│   │       ├── auth.ts                    # Authentication utilities
│   │       ├── market.ts                  # Market data utilities
│   │       ├── otp.ts                     # OTP generation/verification
│   │       ├── prisma.ts                  # Prisma client singleton
│   │       ├── risk.ts                    # Risk calculation utilities
│   │       ├── ws.ts                      # WebSocket utilities
│   │       ├── utils.ts                   # General utility functions
│   │       ├── swagger.ts                 # Swagger/OpenAPI generation
│   │       └── theme-provider.tsx         # Theme context provider
│   │
│   └── .env.local                         # Environment variables (local dev)
│       .env.example                       # Example environment template
│
├── risk-engine-fastapi/                   # FastAPI Risk Engine (Optional)
│   ├── main.py                            # FastAPI application
│   ├── requirements.txt                   # Python dependencies
│   ├── package.json                       # Node.js metadata
│   ├── tsconfig.json
│   │
│   ├── prisma/
│   │   ├── schema.prisma                  # Shared data schema
│   │   └── migrations/
│   │
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   ├── risk/route.ts          # Risk scoring API
│   │   │   │   └── trade/route.ts         # Trade validation API
│   │   │   └── dashboard/
│   │   │       └── page.tsx               # Risk dashboard
│   │   │
│   │   └── lib/
│   │       └── prisma.ts
│   │
│   └── lib/
│       └── prisma.ts
│
└── vercel.json                            # Vercel deployment configuration

```

### Key Directories Explained

- **trading-platform-nextjs/** - Main application, run this server
- **risk-engine-fastapi/** - Optional Python service for risk calculations
- **docs/** - Detailed documentation for each component
- **scripts/** - Helper scripts for setup and deployment
- **prisma/** - Database schema and migrations

---

## Running the Platform

### Terminal 1: Start Redis (Required)

```bash
# Option 1: Using Homebrew services (macOS)
brew services start redis

# Option 2: Run Redis directly
redis-server

# Option 3: Docker (if installed)
docker run -p 6379:6379 redis:latest

# Verify Redis is running
redis-cli ping
# Expected output: PONG
```

### Terminal 2: Start Market Engine (Required)

The market engine simulates real-time price updates:

```bash
cd /path/to/zerodha-risk-platform

python3 market_engine.py

# Expected output:
# 🚀 Starting market engine...
# 📊 Tracking symbols: AAPL, GOOGL, MSFT, TSLA, TCS, INFY, RELIANCE, HDFCBANK
# ✅ Updated prices: AAPL: $150.50, GOOGL: $140.25, ...
```

### Terminal 3: Start Next.js Development Server

```bash
cd trading-platform-nextjs

npm run dev

# Expected output:
# 
# > next dev
# 
# ▲ Next.js 14.0.0
# 
# - Local:        http://localhost:3000
# - Ready in 1.23s
```

### Terminal 4 (Optional): Start Python Risk Engine

```bash
cd /path/to/zerodha-risk-platform/risk-engine-fastapi

# Install dependencies
pip3 install fastapi uvicorn pandas numpy yfinance

# Start the server
uvicorn main:app --reload --port 8000

# Expected output:
# Uvicorn running on http://127.0.0.1:8000
```

### Access the Application

Open your browser to: **http://localhost:3000**

**Test Credentials** (if you created test user):
- Email: `test@trader.com`
- Password: `test123`

---

## API Documentation

### Overview

All API endpoints (except `/api/auth/*`) require JWT authentication.

#### Authentication Header
```http
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

### Core Endpoints

#### Authentication

**POST /api/auth/login**
- Login with email and password
- Returns JWT token
- Example: `{ "email": "test@trader.com", "password": "test123" }`

**POST /api/auth/signup**
- Register new user
- Example: `{ "email": "new@trader.com", "password": "secure123", "name": "Trader Name" }`

**POST /api/auth/verify**
- Verify email address
- Example: `{ "email": "new@trader.com", "code": "123456" }`

#### Trading

**POST /api/trade**
- Execute buy or sell order
- Body: `{ "symbol": "AAPL", "type": "BUY", "qty": 10 }`
- Returns: Order confirmation with order ID

**GET /api/portfolio**
- Get user's holdings and account balance
- Returns: Holdings array and account balance

**GET /api/orders**
- Get order history
- Returns: Array of all user's orders

#### Market Data

**GET /api/prices**
- Get current prices for all watched symbols
- Returns: Object with symbol prices (Example: `{ "AAPL": 150.50, "GOOGL": 140.25 }`)

**GET /api/prices?symbol=AAPL**
- Get price for specific symbol

#### Risk Management

**POST /api/risk**
- Calculate portfolio risk metrics
- Body: Portfolio holdings array
- Returns: `{ "var_95": -0.025, "volatility": 0.18, "max_drawdown": -0.15, "risk_score": 0.42 }`

#### Real-time Updates

**WebSocket /api/ws**
- Connect for real-time price and portfolio updates
- Messages: Price updates every 2 seconds, Order confirmations, Portfolio changes

### Interactive API Documentation

Once running, visit: **http://localhost:3000/api-docs**

This provides Swagger UI for testing all endpoints with real data.

**For complete API details**, see [docs/API.md](docs/API.md)

---

## Database Schema

### Entity Relationship Diagram

```
User (1) ──────────── (1) Account
  │                       │
  ├─ id                   ├─ id
  ├─ email                ├─ userId (FK)
  ├─ passwordHash         ├─ balance
  ├─ name                 └─ createdAt
  ├─ role
  └─ timestamps
  
User (1) ──────────── (M) Order
  │
  └─ id → Orders.userId

User (1) ──────────── (M) Holding
  │
  └─ id → Holdings.userId

Account (1) ──────────── (M) Order
  │
  └─ id → Orders.accountId

Account (1) ──────────── (M) Holding
  │
  └─ id → Holdings.accountId
```

### Table Details

**User**
```
- id (UUID) Primary Key
- email (String, unique)
- passwordHash (String) - bcrypt hashed
- name (String, nullable)
- role (String) - "USER" or "ADMIN"
- createdAt (DateTime)
- updatedAt (DateTime)
```

**Account**
```
- id (UUID) Primary Key
- userId (UUID) Foreign Key
- balance (Float) - Available cash balance
- createdAt (DateTime)
```

**Order**
```
- id (UUID) Primary Key
- accountId (UUID) Foreign Key
- userId (UUID) Foreign Key
- symbol (String) - Trading symbol (e.g., AAPL)
- type (String) - "BUY" or "SELL"
- qty (Integer) - Quantity
- price (Float) - Execution price
- status (String) - pending/completed/cancelled
- createdAt (DateTime)
```

**Holding**
```
- id (UUID) Primary Key
- accountId (UUID) Foreign Key
- userId (UUID) Foreign Key
- symbol (String) - Trading symbol
- qty (Integer) - Current quantity
- avgPrice (Float) - Average purchase price
```

**PriceHistory**
```
- id (UUID) Primary Key
- symbol (String)
- price (Float) - Close price
- high (Float, nullable)
- low (Float, nullable)
- volume (BigInt, nullable)
- timestamp (DateTime)
- Index: (symbol, timestamp)
```

For detailed schema, see [trading-platform-nextjs/prisma/schema.prisma](trading-platform-nextjs/prisma/schema.prisma)

---

## Environment Configuration

### Development (.env.local)

```bash
# ============================================
# Database
# ============================================
# SQLite for development (file-based)
DATABASE_URL="file:./prisma/dev.db"

# PostgreSQL for production
# DATABASE_URL="postgresql://user:password@host:5432/database"

# ============================================
# Authentication & Security
# ============================================
JWT_SECRET="your-secret-key-min-32-chars"        # Min 32 characters
JWT_EXPIRY="24h"                                  # Token expiration
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"              # For production: your domain

# ============================================
# API Configuration
# ============================================
NEXT_PUBLIC_API_URL="http://localhost:3000"       # Client-side API calls
NEXT_PUBLIC_WS_URL="ws://localhost:3000/ws"       # WebSocket endpoint

# ============================================
# Redis (Real-time Updates & Caching)
# ============================================
REDIS_URL="redis://localhost:6379"                # Full Redis URL
REDIS_HOST="localhost"                            # Redis host
REDIS_PORT=6379                                   # Redis port

# ============================================
# Market Engine (Price Updates)
# ============================================
MARKET_ENGINE_INTERVAL=2000                       # Update frequency in ms

# ============================================
# Email (Optional - for OTP/Notifications)
# ============================================
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"                     # Not regular password, use app password
SMTP_FROM="noreply@tradingplatform.com"

# ============================================
# Logging & Debugging
# ============================================
DEBUG=false                                        # Enable debug logging
LOG_LEVEL="info"                                   # debug, info, warn, error
```

### Production (.env.production)

```bash
# Use Supabase PostgreSQL
DATABASE_URL="postgresql://user:password@db.xxxxx.supabase.co:5432/postgres"

# Use Upstash Redis
REDIS_URL="redis://default:password@redis-xxxxx.upstash.io:6379"

# Production domains
NEXT_PUBLIC_API_URL="https://yourdomain.com"
NEXT_PUBLIC_WS_URL="wss://yourdomain.com/ws"
NEXTAUTH_URL="https://yourdomain.com"

# Generate secure secrets
JWT_SECRET="<generate with: openssl rand -base64 32>"

# Keep other settings
MARKET_ENGINE_INTERVAL=2000
```

### Generate Secure Secret Keys

```bash
# Generate JWT_SECRET (min 32 chars)
openssl rand -base64 32

# Example output: 
# uJ5vF8mK2pL9qR3sT6xY4zH7dJ2eM5nK8pL1qR

# Copy to your .env.local
JWT_SECRET="uJ5vF8mK2pL9qR3sT6xY4zH7dJ2eM5nK8pL1qR"
```

For detailed setup, see [CREDENTIALS_GUIDE.md](CREDENTIALS_GUIDE.md) and [SUPABASE_CONNECTION_HELP.md](SUPABASE_CONNECTION_HELP.md)

---

## Deployment

### Quick Cloud Deployment

The easiest way to deploy is to Vercel (same creators as Next.js) with a serverless database:

```bash
# 1. Create free accounts
# Supabase: https://supabase.com (PostgreSQL)
# Upstash: https://upstash.com (Redis)
# Vercel: https://vercel.com

# 2. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 3. Deploy on Vercel
# Go to vercel.com → Import repo → Add environment variables → Deploy
```

**Total Cost**: $0/month (all services have generous free tiers)

### Deployment Options

| Platform | Database | Redis | Cost | Setup Time |
|----------|----------|-------|------|-----------|
| **Vercel** | Supabase | Upstash | FREE | 10 min |
| **Railway** | PostgreSQL | Redis | $5/mo | 15 min |
| **Heroku** | PostgreSQL | Redis | $50+/mo | 10 min |
| **Self-hosted** | Any | Any | $10+/mo | 1 hour |
| **Docker** | Any | Any | Variable | 30 min |

### Step-by-Step Vercel Deployment

1. **Setup Database: Supabase**
   - Go to supabase.com → Sign up (free)
   - Create project → Wait 2 minutes
   - Go to Settings → Database → Copy Connection String (URI)
   - Save as `DATABASE_URL` environment variable

2. **Setup Redis: Upstash**
   - Go to upstash.com → Sign up (free)
   - Create Redis database
   - Copy REDIS_URL
   - Save environment variable

3. **Generate Secrets**
   ```bash
   # Run locally to generate
   openssl rand -base64 32  # JWT_SECRET
   openssl rand -base64 32  # NEXTAUTH_SECRET
   ```

4. **Deploy**
   - Go to vercel.com → New Project → Import your GitHub repo
   - Add environment variables (DATABASE_URL, REDIS_URL, JWT_SECRET, etc.)
   - Click Deploy
   - Wait 3-5 minutes
   - Your app is live! 🎉

**For complete deployment guide**, see [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)

---

## Platform Status & Roadmap

### ✅ Production-Ready Features
- ✓ **Trading Dashboard** - Real-time price updates and order execution
- ✓ **Order Management** - Buy/Sell execution with instant confirmation
- ✓ **Portfolio Analytics** - Live holdings, performance tracking, and historical data
- ✓ **Real-time Updates** - WebSocket-based synchronization (2-second intervals)
- ✓ **User Authentication** - JWT-based secure sessions with token management
- ✓ **Risk Management** - VaR calculations, volatility analysis, drawdown tracking
- ✓ **Modern UI/UX** - Responsive design, dark/light themes, smooth animations
- ✓ **Database Persistence** - SQLite development, PostgreSQL production
- ✓ **Caching Layer** - Redis pub/sub for high-performance real-time updates
- ✓ **Enterprise Deployment** - Vercel, Supabase, production-ready infrastructure

### 🚀 Upcoming Enhancements
- [ ] **Advanced Portfolio Charting** - Interactive multi-timeframe analysis
- [ ] **Strategy Backtesting** - Historical performance simulation engine
- [ ] **Automated Alerts** - Smart notifications and threshold management
- [ ] **Paper Trading** - Risk-free learning environment
- [ ] **Mobile Companion App** - React Native iOS/Android app
- [ ] **Options Trading** - Multi-leg strategies and complex orders
- [ ] **Third-party APIs** - Developer ecosystem and integrations
- [ ] **Machine Learning** - Predictive analytics and AI-powered insights

### 🐛 Reporting Issues

Found a bug? Please:
1. Check existing [issues](https://github.com/yourusername/zerodha-risk-platform/issues)
2. Create detailed bug report with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshot/error message
   - Environment (OS, Node version, etc.)

---

## Support & Troubleshooting

### Getting Help & Quick Fixes

#### 1. **Redis Connection Error**
```
Error: ECONNREFUSED 127.0.0.1:6379
```
**Solution:**
```bash
# Start Redis
brew services start redis

# Or manually
redis-server

# Verify
redis-cli ping  # Should return PONG
```

#### 2. **Database Connection Error**
```
Error: ENOENT: no such file or directory, open './prisma/dev.db'
```
**Solution:**
```bash
cd trading-platform-nextjs
npx prisma migrate dev
npx prisma generate
```

#### 3. **Port 3000 Already in Use**
```
Error: listen EADDRINUSE :::3000
```
**Solution:**
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

#### 4. **Prisma Client Not Generated**
```
Error: @prisma/client did not initialize yet
```
**Solution:**
```bash
cd trading-platform-nextjs
npm run postinstall
# or
npx prisma generate
```

#### 5. **Node Version Mismatch**
```
error: setup.py not found
```
**Solution:**
```bash
# Update Node.js
brew upgrade node

# Verify
node --version  # Should be >=18.0
npm --version   # Should be >=9.0

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 6. **WebSocket Connection Not Working**
```
WebSocket connection to 'ws://localhost:3000/ws' failed
```
**Solution:**
- Ensure Redis is running (`redis-cli ping`)
- Check `NEXT_PUBLIC_WS_URL` in .env.local
- Verify market_engine.py is running
- Check browser DevTools Console for more details

#### 7. **Import Errors (TypeScript)**
```
Cannot find module '@/components/ui/button'
```
**Solution:**
```bash
cd trading-platform-nextjs
npm install
npx prisma generate
npm run build
```

#### 8. **Authentication Token Expired**
```
Error: Unauthorized (401)
```
**Solution:**
- Clear localStorage and login again
- Check JWT_EXPIRY in .env.local (default 24h)
- Verify JWT_SECRET matches between frontend and backend

#### 9. **Supabase Connection Timeout** (Production)
```
Error: Password authentication failed for user "postgres"
```
See [SUPABASE_CONNECTION_HELP.md](SUPABASE_CONNECTION_HELP.md) for detailed troubleshooting.

#### 10. **Market Engine Not Updating Prices**
```
Terminal shows no price updates
```
**Solution:**
```bash
# Restart market engine
python3 market_engine.py

# Verify Redis connection
redis-cli keys "price:*"  # Should show price keys
```

### Debug Mode

Enable detailed logging:

```bash
# In .env.local
DEBUG=true
LOG_LEVEL="debug"

# Or via environment variable
DEBUG=* npm run dev
```

### Getting Help

1. **Check documentation**: [docs/](docs/) folder
2. **Review API docs**: http://localhost:3000/api-docs (when running)
3. **Search issues**: [GitHub Issues](https://github.com/yourusername/zerodha-risk-platform/issues)
4. **Check logs**: Look in browser console and terminal output
5. **Database issues**: Try `sqlite3 prisma/dev.db` to inspect directly

---

## Additional Resources

### Documentation Files
- [Quick Start (3 steps)](QUICKSTART.md) - Get running in 5 minutes
- [Complete Setup Guide](docs/SETUP.md) - Detailed installation
- [System Architecture](docs/ARCHITECTURE.md) - How everything connects
- [API Reference](docs/API.md) - All endpoints and examples
- [Deployment Guide](VERCEL_DEPLOYMENT.md) - Deploy to production
- [Credentials Help](CREDENTIALS_GUIDE.md) - Finding your API keys
- [Supabase Help](SUPABASE_CONNECTION_HELP.md) - Database setup issues

### External Resources
- **Next.js**: https://nextjs.org/docs
- **Prisma ORM**: https://www.prisma.io/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Shadcn UI**: https://ui.shadcn.com/
- **React Documentation**: https://react.dev/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/

### Similar Projects
- **TradingView**: https://www.tradingview.com/
- **Zerodha Kite**: https://kite.zerodha.com/
- **Interactive Brokers**: https://www.interactivebrokers.com/
- **Upstox Pro**: https://upstox.com/

### Key Technologies in Depth
- **Next.js full-stack**: https://nextjs.org/learn
- **Real-time with WebSocket**: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
- **JWT Authentication**: https://jwt.io/introduction
- **REST API Design**: https://restfulapi.net/

---

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- Code follows existing style
- New features have documentation
- Tests pass (where applicable)
- No breaking changes without discussion

---

## License

This project is licensed under the MIT License - see LICENSE file for details.

---

## Support & Feedback

- **Questions?** Open a GitHub Discussion or Issue
- **Found a Bug?** Report it on GitHub Issues
- **Want to Contribute?** See Contributing section above
- **Have Feedback?** We'd love to hear your suggestions!

---

**Last Updated**: February 2026  
**Next.js Version**: 14.0+  
**Node Version**: 18.0+  
**Status**: 🟢 Production Ready (with noted auth endpoint issues in development)

---

Happy Trading! 🚀📈
