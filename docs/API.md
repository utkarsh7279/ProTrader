# API Reference Guide

Complete documentation of all API endpoints, request formats, response schemas, and usage examples.

## Base URL

```
Development:  http://localhost:3000
Production:   https://your-domain.com
WebSocket:    ws://localhost:3000/ws
```

## Authentication

All API endpoints (except `/auth/*`) require JWT token in the `Authorization` header.

### Request Header Format

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Token Acquisition

- Obtain token via `/auth/login` or `/auth/signup`
- Store token in browser localStorage
- Include in all subsequent requests
- Token expires after 24 hours

## Authentication Endpoints

### POST /api/auth/login

Authenticate user and receive JWT token.

**Request:**
```json
{
  "email": "test@trader.com",
  "password": "test123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "test-user-id-12345678",
    "email": "test@trader.com",
    "name": "Test Trader",
    "role": "USER"
  }
}
```

**Errors:**
- `400` - Missing email or password
- `401` - Invalid credentials
- `500` - Server error

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@trader.com","password":"test123"}'
```

**JavaScript Example:**
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@trader.com',
    password: 'test123'
  })
});
const data = await response.json();
localStorage.setItem('token', data.token);
```

---

### POST /api/auth/signup

Register new user and receive JWT token.

**Request:**
```json
{
  "email": "newtrade@example.com",
  "password": "securepass123",
  "name": "New Trader"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-uuid",
    "email": "newtrade@example.com",
    "name": "New Trader",
    "role": "USER"
  }
}
```

**Errors:**
- `400` - Invalid input or email already exists
- `500` - Server error

---

## Trading Endpoints

### GET /api/portfolio

Get user's current holdings, account balance, and portfolio summary.

**Authorization Required:** Yes

**Request:**
```http
GET /api/portfolio
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "account": {
    "id": "test-account-id-987654321",
    "balance": 89500.00,
    "initialBalance": 100000.00,
    "userId": "test-user-id-12345678"
  },
  "holdings": [
    {
      "id": "holding-1",
      "symbol": "AAPL",
      "quantity": 10,
      "averageBuyPrice": 150.25,
      "currentPrice": 155.50,
      "totalCost": 1502.50,
      "currentValue": 1555.00,
      "unrealizedPnL": 52.50,
      "unrealizedPnLPercent": 3.49
    }
  ],
  "summary": {
    "totalPortfolioValue": 91055.00,
    "totalInvested": 1502.50,
    "totalUnrealizedPnL": 52.50,
    "totalUnrealizedPnLPercent": 3.49,
    "cashAvailable": 89500.00
  }
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/portfolio \
  -H "Authorization: Bearer <token>"
```

---

### POST /api/trade

Execute buy or sell order for a security.

**Authorization Required:** Yes

**Request:**
```json
{
  "symbol": "AAPL",
  "quantity": 10,
  "type": "BUY",
  "price": 150.25
}
```

**Parameters:**
- `symbol` (string, required): Stock symbol (e.g., "AAPL", "GOOGL", "TSLA")
- `quantity` (number, required): Number of shares to buy/sell (positive integer)
- `type` (string, required): "BUY" or "SELL"
- `price` (number, required): Execution price per share

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Order executed successfully",
  "order": {
    "id": "order-uuid",
    "symbol": "AAPL",
    "quantity": 10,
    "type": "BUY",
    "price": 150.25,
    "totalCost": 1502.50,
    "status": "FILLED",
    "executedAt": "2026-02-09T15:30:45Z"
  },
  "updatedBalance": 89500.00,
  "updatedHolding": {
    "symbol": "AAPL",
    "quantity": 10,
    "totalValue": 1555.00,
    "unrealizedPnL": 52.50
  }
}
```

**Errors:**
- `400` - Invalid request parameters
- `401` - Unauthorized (missing/invalid token)
- `402` - Insufficient funds
- `409` - Risk limit exceeded
- `500` - Server error

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/trade \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "symbol":"AAPL",
    "quantity":10,
    "type":"BUY",
    "price":150.25
  }'
```

---

### GET /api/orders

Get order history with filtering and pagination.

**Authorization Required:** Yes

**Query Parameters:**
- `symbol` (optional): Filter by stock symbol
- `type` (optional): Filter by "BUY" or "SELL"
- `status` (optional): "FILLED", "PENDING", "REJECTED", "CANCELLED"
- `limit` (optional, default: 20): Number of results per page
- `offset` (optional, default: 0): Pagination offset
- `sortOrder` (optional, default: "desc"): "asc" or "desc"

**Request:**
```http
GET /api/orders?symbol=AAPL&type=BUY&limit=10&offset=0
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "orders": [
    {
      "id": "order-1",
      "symbol": "AAPL",
      "quantity": 10,
      "type": "BUY",
      "price": 150.25,
      "totalCost": 1502.50,
      "status": "FILLED",
      "executedAt": "2026-02-09T15:30:45Z"
    }
  ],
  "pagination": {
    "total": 12,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  },
  "statistics": {
    "totalOrders": 12,
    "totalFilled": 10,
    "totalBuys": 7,
    "totalSells": 3,
    "totalSpent": 15025.00,
    "totalEarned": 5000.00
  }
}
```

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/orders?symbol=AAPL&limit=10" \
  -H "Authorization: Bearer <token>"
```

---

### GET /api/prices

Get historical price data for a symbol.

**Authorization Required:** No

**Query Parameters:**
- `symbol` (required): Stock symbol
- `interval` (optional, default: 24): Hours of history
- `limit` (optional, default: 100): Number of data points

**Request:**
```http
GET /api/prices?symbol=AAPL&interval=24&limit=100
```

**Response (200 OK):**
```json
{
  "symbol": "AAPL",
  "prices": [
    { "timestamp": "2026-02-08T15:00:00Z", "price": 148.50 },
    { "timestamp": "2026-02-08T15:02:00Z", "price": 149.25 },
    { "timestamp": "2026-02-08T15:04:00Z", "price": 150.50 }
  ],
  "latest": {
    "price": 150.50,
    "timestamp": "2026-02-08T15:04:00Z",
    "change": 2.00,
    "changePercent": 1.34
  }
}
```

---

## Analytics Endpoints

### GET /api/analytics

Get portfolio analytics and performance metrics.

**Authorization Required:** Yes

**Request:**
```http
GET /api/analytics
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "performance": {
    "totalReturn": 0.0349,
    "returns30d": -0.015,
    "sharpeRatio": 1.45,
    "maxDrawdown": -0.08,
    "volatility": 0.24
  },
  "allocation": {
    "bySymbol": [
      { "symbol": "AAPL", "value": 1555.00, "percent": 1.71 }
    ],
    "bySector": [
      { "sector": "Technology", "value": 45230.50, "percent": 49.7 }
    ]
  },
  "riskMetrics": {
    "valueAtRisk95": 2450.00,
    "maxDrawdown": -0.05,
    "betaToMarket": 1.2,
    "concentration": 0.15
  },
  "tradingActivity": {
    "totalTrades": 12,
    "winRate": 0.58,
    "averageReturn": 0.035,
    "recentTrades": []
  }
}
```

---

### GET /api/risk

Get current risk status and limits.

**Authorization Required:** Yes

**Request:**
```http
GET /api/risk
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "riskScore": 2.4,
  "riskLevel": "LOW",
  "limits": {
    "maxDailyLoss": { "amount": 5000, "remaining": 4950 },
    "maxPosition": { "percent": 0.25, "remaining": 0.20 },
    "maxConcentration": { "percent": 0.40, "remaining": 0.35 }
  },
  "alerts": [
    {
      "type": "CONCENTRATION",
      "severity": "WARNING",
      "message": "AAPL position is 15% of portfolio"
    }
  ],
  "autoReduceEnabled": true,
  "circuitBreakerEnabled": true
}
```

---

## Real-Time WebSocket

### Connection

```javascript
// Connect to WebSocket
const ws = new WebSocket('ws://localhost:3000/ws');

ws.onopen = () => {
  console.log('Connected to price feed');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Price update:', data);
  // { symbol: 'AAPL', price: 150.25, timestamp: '...' }
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = () => {
  console.log('Disconnected from price feed');
};
```

### Message Format

**Price Update (from server):**
```json
{
  "type": "PRICE_UPDATE",
  "symbol": "AAPL",
  "price": 150.25,
  "change": 2.00,
  "changePercent": 1.34,
  "timestamp": "2026-02-09T15:30:45Z"
}
```

**Portfolio Update (from server):**
```json
{
  "type": "PORTFOLIO_UPDATE",
  "balance": 89500.00,
  "totalValue": 91055.00,
  "timestamp": "2026-02-09T15:30:45Z"
}
```

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": "Insufficient funds",
  "code": "INSUFFICIENT_FUNDS",
  "statusCode": 402
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| INVALID_REQUEST | 400 | Missing or invalid parameters |
| UNAUTHORIZED | 401 | Missing or invalid token |
| INSUFFICIENT_FUNDS | 402 | Account balance too low |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Risk limit exceeded or invalid operation |
| INTERNAL_ERROR | 500 | Server error |

---

## Rate Limiting

- **Default**: 100 requests per minute per IP
- **Trade Endpoint**: 10 requests per minute (to prevent rapid-fire orders)
- **Headers**: Rate limit info included in response headers
  - `X-RateLimit-Limit`: Total allowed requests
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Unix timestamp when limit resets

---

## Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created (new resource) |
| 400 | Bad Request |
| 401 | Unauthorized |
| 402 | Payment Required (insufficient funds) |
| 404 | Not Found |
| 409 | Conflict (business logic error) |
| 500 | Internal Server Error |

---

## Testing Endpoints with cURL

### Login and Save Token

```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@trader.com","password":"test123"}' \
  | jq -r '.token')

# Verify token
echo "Token: $TOKEN"
```

### Make Authenticated Request

```bash
curl -X GET http://localhost:3000/api/portfolio \
  -H "Authorization: Bearer $TOKEN"
```

### Place Order

```bash
curl -X POST http://localhost:3000/api/trade \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "AAPL",
    "quantity": 10,
    "type": "BUY",
    "price": 150.25
  }'
```

---

## Next Steps

1. **[Setup Guide](SETUP.md)** - Install and configure the platform
2. **[Architecture](ARCHITECTURE.md)** - Understand system design
3. **[Testing Guide](TESTING.md)** - Run test scenarios

---

**Need help?** Review the detailed endpoint documentation above or check the testing guide for common workflows.
