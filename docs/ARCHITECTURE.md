# Architecture & System Design

Comprehensive overview of the Zerodha Risk Platform architecture, data flow, component structure, and design decisions.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser / Client                          │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Next.js Frontend (React TSX)                              │ │
│  │  ├─ Dashboard (Main trading interface)                     │ │
│  │  ├─ Analysis (4-tab portfolio analytics)                   │ │
│  │  ├─ Execution (Order history & statistics)                 │ │
│  │  ├─ Controls (Risk management settings)                    │ │
│  │  ├─ Settings (User preferences)                            │ │
│  │  └─ Authentication (Login/Signup pages)                    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                           │                                       │
│  ┌────────────────────────┴───────────────────────────────────┐ │
│  │  WebSocket Connection (ws://localhost:3000/ws)            │ │
│  │  Real-time price updates, portfolio changes               │ │
│  └────────────────────────┬───────────────────────────────────┘ │
└─────────────────────────────┼─────────────────────────────────────┘
                              │
                    ┌─────────┴──────────┐
                    │                    │
           ┌────────▼────────┐  ┌────────▼────────┐
           │ Next.js Server  │  │  Node.js Server │
           │ (Port 3000)     │  │ (same process)  │
           ├─────────────────┤  └─────────────────┘
           │ API Routes:     │
           │ ├─ /api/auth    │  ┌──────────────────────┐
           │ ├─ /api/trade   ├──┤ SQLite Database      │
           │ ├─ /api/portfolio   │ (prisma/dev.db)    │
           │ ├─ /api/orders  │  │ ├─ User             │
           │ ├─ /api/prices  │  │ ├─ Account          │
           │ ├─ /api/risk    │  │ ├─ Order            │
           │ ├─ /api/ws      │  │ ├─ Holding          │
           │ └─ /api-docs    │  │ └─ PriceHistory     │
           └─────────────────┘  └──┬───────────────────┘
                    │              │
                    └──────┬───────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
    ┌──────▼──────┐ ┌─────▼──────┐ ┌─────▼──────┐
    │   Redis     │ │ Python     │ │  WebSocket │
    │   Cache     │ │ Market     │ │  Pub/Sub   │
    │ (6379)      │ │ Engine     │ │  (via Redis│
    │ ├─ Prices   │ │ (Updates   │ │   channels)│
    │ ├─ Sessions │ │  every 2s) │ └────────────┘
    │ └─ Channels │ └────────────┘
    └─────────────┘
```

## Data Flow

### 1. Authentication Flow

```
User Enters Credentials
        ↓
POST /api/auth/login
        ↓
Server validates email & password (bcrypt)
        ↓
Create JWT Token (HS256)
        ↓
Return token to frontend
        ↓
Frontend stores in localStorage
        ↓
Include in Authorization header for future requests
```

### 2. Trading Flow

```
User clicks BUY/SELL button
        ↓
TradeDialog component opens
        ↓
User enters quantity, clicks "Place Order"
        ↓
POST /api/trade with auth header
        ↓
Server validates:
├─ Token verification
├─ User authorization
├─ Sufficient funds (for BUY)
├─ Position limits
└─ Risk constraints
        ↓
Update database:
├─ Create new Order record
├─ Update Account balance
└─ Create/Update Holding record
        ↓
Broadcast portfolio update via Redis/WebSocket
        ↓
Frontend receives price update
        ↓
Update portfolio display
        ↓
Show success/error toast notification
```

### 3. Real-Time Price Updates

```
Market Engine (Python)
        ↓
Every 2 seconds: Generate/fetch market prices
        ↓
Publish to Redis channel: "prices"
        ↓
Next.js server subscribes to Redis channel
        ↓
Broadcast to all connected WebSocket clients
        ↓
Browser receives PRICE_UPDATE messages
        ↓
Update price displays in real-time
```

## Database Schema

### User Table
```sql
CREATE TABLE User (
  id              STRING PRIMARY KEY,
  email           STRING UNIQUE NOT NULL,
  password        STRING NOT NULL,          -- bcrypt hash
  name            STRING NOT NULL,
  role            STRING DEFAULT 'USER',    -- USER, ADMIN
  createdAt       DATETIME NOT NULL,
  updatedAt       DATETIME NOT NULL
);
```

### Account Table
```sql
CREATE TABLE Account (
  id              STRING PRIMARY KEY,
  userId          STRING FOREIGN KEY(User.id),
  balance         DECIMAL(15,2) NOT NULL,
  createdAt       DATETIME NOT NULL,
  updatedAt       DATETIME NOT NULL
);
```

### Order Table
```sql
CREATE TABLE Order (
  id              STRING PRIMARY KEY,
  userId          STRING FOREIGN KEY(User.id),
  symbol          STRING NOT NULL,
  quantity        INTEGER NOT NULL,
  type            STRING NOT NULL,          -- BUY, SELL
  price           DECIMAL(10,2) NOT NULL,
  totalCost       DECIMAL(15,2) NOT NULL,
  status          STRING DEFAULT 'FILLED',  -- FILLED, PENDING, REJECTED
  executedAt      DATETIME NOT NULL,
  createdAt       DATETIME NOT NULL,
  updatedAt       DATETIME NOT NULL
);

CREATE INDEX idx_user_orders ON Order(userId);
CREATE INDEX idx_order_symbol ON Order(symbol);
```

### Holding Table
```sql
CREATE TABLE Holding (
  id              STRING PRIMARY KEY,
  userId          STRING FOREIGN KEY(User.id),
  symbol          STRING NOT NULL,
  quantity        INTEGER NOT NULL,
  averageBuyPrice DECIMAL(10,2) NOT NULL,
  createdAt       DATETIME NOT NULL,
  updatedAt       DATETIME NOT NULL
);

CREATE UNIQUE INDEX idx_user_symbol ON Holding(userId, symbol);
```

### PriceHistory Table
```sql
CREATE TABLE PriceHistory (
  id              STRING PRIMARY KEY,
  symbol          STRING NOT NULL,
  price           DECIMAL(10,2) NOT NULL,
  timestamp       DATETIME NOT NULL,
  createdAt       DATETIME NOT NULL
);

CREATE INDEX idx_symbol_timestamp ON PriceHistory(symbol, timestamp DESC);
```

## Component Structure

### Frontend Components

```
src/app/
├── dashboard/
│   └── page.tsx              # Main trading dashboard
│       ├─ Portfolio summary card
│       ├─ Holdings table
│       ├─ QuickActions (BUY/SELL buttons)
│       ├─ Price ticker
│       └─ Real-time P&L
│
├── analysis/
│   └── page.tsx              # Analytics dashboard (4 tabs)
│       ├─ Performance Tab (Line chart, returns)
│       ├─ Risk Tab (Risk metrics, VaR)
│       ├─ Allocation Tab (Pie chart, sector breakdown)
│       └─ Activity Tab (Recent trades table)
│
├── execution/
│   └── page.tsx              # Order history
│       ├─ Order history table
│       ├─ Filters (symbol, type, status)
│       ├─ Pagination
│       └─ Statistics cards
│
├── controls/
│   └── page.tsx              # Risk controls
│       ├─ VaR limit slider
│       ├─ Max drawdown input
│       ├─ Auto-reduce toggle
│       ├─ Circuit breaker toggle
│       └─ Position limits
│
├── settings/
│   └── page.tsx              # User settings
│       ├─ Account preferences
│       ├─ Security settings
│       ├─ Notification toggles
│       └─ Display preferences
│
├── login/
│   └── page.tsx              # Login form
│
├── signup/
│   └── page.tsx              # Registration form
│
└── layout.tsx                # Root layout
    └─ Navigation sidebar
    └─ Header with user info
```

### UI Components (shadcn/ui)

```
src/components/ui/
├── button.tsx
│   ├─ default (primary action)
│   ├─ secondary (alternative action)
│   ├─ destructive (dangerous action)
│   ├─ outline (bordered)
│   ├─ ghost (minimal)
│   ├─ link (text link)
│   ├─ success (positive action)
│   └─ loading (async operation)
│
├── badge.tsx             # Status indicators
│   ├─ default
│   ├─ secondary
│   ├─ destructive
│   ├─ outline
│   ├─ success
│   └─ warning
│
├── dialog.tsx            # Modal dialogs
├── alert-dialog.tsx      # Confirmation dialogs
├── card.tsx              # Container component
├── input.tsx             # Text input
├── label.tsx             # Form labels
├── select.tsx            # Dropdown select
├── table.tsx             # Data tables
└── trade-dialog.tsx      # Custom trade order form
```

### API Routes

```
src/app/api/
├── auth/
│   ├── login/route.ts        # POST - User login (returns JWT)
│   ├── signup/route.ts       # POST - User registration
│   ├── verify/route.ts       # POST - Token verification
│   └── verify-otp/route.ts   # POST - OTP verification
│
├── trade/route.ts            # POST - Execute buy/sell orders
├── portfolio/route.ts        # GET - User holdings & balance
├── orders/route.ts           # GET - Order history with filters
├── prices/route.ts           # GET - Price history data
├── risk/route.ts             # GET - Risk metrics
├── me/route.ts               # GET - Current user info
└── ws/route.ts               # WebSocket upgrade handler
```

## Technology Decisions

### Frontend: Next.js 14
**Why:**
- Server-side rendering for fast initial load
- API routes for seamless backend integration
- Built-in optimization (images, fonts, code splitting)
- TypeScript support out of the box
- File-based routing

### UI Framework: shadcn/ui + Tailwind CSS
**Why:**
- Component library built on Radix UI (accessibility first)
- Tailwind CSS for consistent, maintainable styling
- Easy customization with CSS Variables
- Dark mode support built-in
- No component runtime overhead

### Charts: Recharts
**Why:**
- Lightweight and React-native
- Responsive by default
- Multiple chart types (line, area, bar, pie)
- Smooth animations and interactions
- Good documentation

### Database: Prisma + SQLite
**Why:**
- Type-safe database access
- Auto-migrations with schema definition
- Easy to understand data models
- SQLite for simplicity (scales to millions of records)
- Can migrate to PostgreSQL/MySQL for production

### Authentication: JWT
**Why:**
- Stateless authentication (no session storage)
- Works with distributed systems
- Can include claims (userId, role, permissions)
- Standard & widely supported

### Real-Time: WebSocket + Redis
**Why:**
- Sub-second latency for price updates
- WebSocket for live two-way communication
- Redis for pub/sub message distribution
- Scales horizontally with multiple server instances

## Performance Optimizations

### Frontend
- **Code Splitting:** Each page is its own bundle
- **Image Optimization:** Next.js Image component
- **Dynamic Imports:** Lazy-load heavy components
- **Memoization:** React.memo for expensive renders

### Database
- **Indexes:** On userId, symbol, timestamp
- **Query Optimization:** Select only needed columns
- **Connection Pooling:** Through Prisma

### Real-Time
- **Redis Caching:** Store latest prices
- **Message Batching:** Group updates before broadcasting
- **Compression:** Minify JSON before WebSocket transmission

### API
- **Rate Limiting:** Prevent abuse
- **Pagination:** Limit result sets
- **Caching:** Redis for frequently accessed data

## Security Architecture

### Authentication Layer
1. Password hashing with bcrypt (10 rounds)
2. JWT tokens signed with HS256
3. Token validation on every protected route

### API Protection
1. Token verification middleware
2. User authorization checks (token userId matches request)
3. Input validation on all endpoints
4. SQL injection prevention via Prisma ORM

### Data Privacy
1. Sensitive keys in environment variables
2. Never expose user passwords in responses
3. CORS configuration to allow only trusted origins
4. Rate limiting to prevent brute force

## Scalability Considerations

### Current Setup (Single Server)
- Suitable for development and small user bases (< 100 concurrent users)
- SQLite database sufficient for millions of records
- Redis for caching and pub/sub

### Production Scaling
- **Database:** Migrate to PostgreSQL/MySQL for concurrency
- **Load Balancer:** Route traffic across multiple Next.js instances
- **Redis Cluster:** For distributed cache and pub/sub
- **CDN:** Serve static assets globally
- **Monitoring:** Implement logging and alerting

## Error Handling & Logging

### Frontend
- Toast notifications for user-facing errors
- Console logs with prefixes: `[Trade]`, `[Auth]`, `[Portfolio]`
- Error boundaries for component crashes

### Backend
- Structured error responses with codes and messages
- Server logs for debugging
- Validation errors with specific field information

### Database
- Transaction support for multi-step operations (buy → update holdings)
- Rollback on constraint violations
- Connection error handling

## Testing Strategy

### Unit Tests
- API route validators
- Utility functions
- Component rendering

### Integration Tests
- Auth flow (login → token → authenticated request)
- Trading flow (order → holdings → balance update)
- WebSocket price broadcasting

### E2E Tests
- Full user workflows (login → trade → view analytics)
- Error scenarios (insufficient funds, risk limits)
- Real-time updates

## Monitoring & Observability

### Metrics to Track
- Request latency (p50, p95, p99)
- Error rates by endpoint
- WebSocket connection count
- Database query performance
- Redis cache hit rate

### Logs to Collect
- Authentication attempts and failures
- Trade executions and failures
- API error stack traces
- WebSocket connection/disconnection
- Risk limit violations

---

## Next Steps

1. **[Setup Guide](SETUP.md)** - Install and configure locally
2. **[API Reference](API.md)** - Learn all endpoints
3. **[Testing Guide](TESTING.md)** - Run test workflows

---

**Questions about the architecture?** Review the data flow diagrams or check individual component documentation.
