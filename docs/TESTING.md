# Testing Guide & Workflows

Complete guide to testing the Zerodha Risk Platform with step-by-step workflows and troubleshooting.

## Quick Verification Checklist

Before starting full tests, verify all services are running:

```bash
# Terminal 1: Check Redis
redis-cli ping
# Output: PONG

# Terminal 2: Check Node server
lsof -i :3000 | grep node
# Output: Shows node process

# Terminal 3: Check WebSocket
curl -i http://localhost:3000/api/ws 2>/dev/null | head
# Should show WebSocket upgrade connection
```

## Test User Credentials

**Auto-created test user:**
```
Email:    test@trader.com
Password: test123
Balance:  $100,000
```

If test user doesn't exist, see "[Create Test User](#create-test-user)" section.

## Test Workflows

### Workflow 1: Basic Login & Dashboard

**Objective:** Verify authentication and dashboard load

**Steps:**

1. Open browser: `http://localhost:3000`
   - Should see landing page with "Login" and "Signup" buttons

2. Click "Login"
   - Route to `/login` page

3. Enter credentials:
   - Email: `test@trader.com`
   - Password: `test123`
   - Click "Login"

4. **Expected Result:**
   - ✅ Redirect to `/dashboard`
   - ✅ Portfolio data loads (balance, holdings)
   - ✅ WebSocket status shows "Connected" (green dot)
   - ✅ Prices update every 2 seconds
   - ✅ No console errors

5. **Verify Token Storage:**
   - Open DevTools (F12) → Console
   - Run: `localStorage.getItem('token')`
   - Expected: Long JWT string (starts with `eyJ...`)

6. **Troubleshooting:**
   - **Redirect fails:** Check JWT_SECRET in `.env.local`
   - **No portfolio data:** Check database has Account record for test user
   - **No WebSocket:** Check Redis is running (`redis-cli ping`)
   - **Token is null:** Check login route stores token correctly

---

### Workflow 2: Execute Buy Order

**Objective:** Verify trading functionality and database updates

**Steps:**

1. From dashboard, click "BUY" button
   - Trade dialog opens

2. Enter trade details:
   - Symbol: `AAPL` (should auto-populate)
   - Quantity: `10`

3. Click "Place Order"
   - Dialog closes
   - Toast notification appears: "Order executed successfully"

4. **Verify Order Execution:**
   - Check DevTools → Network tab
   - Look for POST request to `/api/trade`
   - Response should show: `"success": true`

5. **Verify Portfolio Update:**
   - Holdings table should show new AAPL position
   - Balance should decrease by purchase amount
   - P&L should reflect current position value

6. **Verify Database:**
   ```bash
   # Check new order in database
   sqlite3 trading-platform-nextjs/prisma/dev.db
   SELECT * FROM "Order" WHERE symbol='AAPL' ORDER BY createdAt DESC LIMIT 1;
   
   # Check holding was created/updated
   SELECT * FROM "Holding" WHERE symbol='AAPL' AND userId='test-user-id-12345678';
   
   # Check balance was updated
   SELECT balance FROM "Account" WHERE userId='test-user-id-12345678';
   .quit
   ```

7. **Troubleshooting:**
   - **"Order failed: Unauthorized"**
     - Token might be null in localStorage
     - Run in console: `localStorage.getItem('token')`
     - If null, go back to login and re-authenticate

   - **"Insufficient funds"**
     - Order size exceeds cash balance
     - Check account balance: SELECT balance FROM Account...

   - **Order not in database**
     - Check server logs for [Trade] prefix errors
     - Verify API route is reached

---

### Workflow 3: Analyze Performance

**Objective:** Verify analytics and dashboard pages

**Steps:**

1. From dashboard, click "Analysis" in sidebar
   - Route to `/analysis` page

2. Verify 4 tabs load:
   - ✅ Performance (Line/Area charts)
   - ✅ Risk Analysis (Risk metrics)
   - ✅ Allocation (Pie chart)
   - ✅ Trading Activity (Recent trades table)

3. **Check Performance Tab:**
   - Portfolio value chart shows historical data
   - Returns statistics calculated correctly
   - Sharpe ratio, volatility metrics display

4. **Check Risk Tab:**
   - VaR 95% calculated
   - Maximum drawdown computed
   - Risk score color-coded (green=low, amber=medium, red=high)

5. **Check Allocation Tab:**
   - Pie chart shows AAPL holding
   - Percentages add up to 100%
   - Sector breakdown displayed

6. **Troubleshooting:**
   - **No data in charts:** Orders might not be synced to analytics
   - **Charts empty:** Check `/api/analytics` response in Network tab
   - **Calculation errors:** Review analytics request payload

---

### Workflow 4: Check Order History

**Objective:** Verify execution page and order filtering

**Steps:**

1. From dashboard, click "Execution" in sidebar
   - Route to `/execution` page

2. Verify order history table shows:
   - ✅ Symbol column (AAPL)
   - ✅ Type column (BUY/SELL)
   - ✅ Quantity column
   - ✅ Price column
   - ✅ Status badge (FILLED=green)
   - ✅ Execution time

3. **Test Filtering:**
   - Filter by symbol "AAPL"
   - Should show only AAPL orders
   - Check URL includes: `?symbol=AAPL`

4. **Test Pagination:**
   - If > 20 orders, pagination shows
   - Click "Next" → loads more results
   - Click "Previous" → loads previous results

5. **Check Statistics Cards:**
   - Total Orders = count of all orders
   - Fill Rate = (filled orders / total) × 100
   - Total Spent = sum of buy order costs
   - Profit/Loss = total earned - total spent

6. **Troubleshooting:**
   - **No orders show:** Check database has Order records
   - **Statistics wrong:** Verify order calculations in API
   - **Filtering doesn't work:** Check query params in Network tab

---

### Workflow 5: Risk Management Controls

**Objective:** Verify risk controls and limit enforcement

**Steps:**

1. From dashboard, click "Controls" in sidebar
   - Route to `/controls` page

2. **Check Risk Limit Sliders:**
   - VaR Limit: 5000 (default)
   - Max Drawdown: -8.5% (default)
   - Max Position: 25% (default)
   - Drag sliders to change values

3. **Test Auto-Reduce Toggle:**
   - Toggle "Auto-Reduce on High Risk" ON/OFF
   - Verify state persists (refresh page)

4. **Test circuit Breaker:**
   - Toggle "Circuit Breaker" ON/OFF
   - When ON, trading halts if limits exceeded

5. **Trigger Risk Alert (Optional):**
   - Buy heavily concentrated position
   - Should see risk score increase
   - If > 75%, alert banner appears

6. **Troubleshooting:**
   - **Toggles don't persist:** Check localStorage saving
   - **Risk not calculated:** Verify analytics API

---

### Workflow 6: Real-Time Price Updates

**Objective:** Verify WebSocket and market data

**Steps:**

1. Open dashboard
   - WebSocket shows "Connected" status

2. Open DevTools Conso:
   - Filter for messages mentioning "price" or "PRICE"
   - Should see updates every 2 seconds

3. **Monitor Price Updates:**
   - Watch holdings table prices
   - P&L should update in real-time
   - Price ticker updates every 2 seconds

4. **Check WebSocket Connection:**
   - DevTools → Network tab → WS protocol
   - Should see messages exchanged:
     ```
     PRICE_UPDATE {symbol: "AAPL", price: 150.25}
     PORTFOLIO_UPDATE {balance: 89500}
     ```

5. **Kill Redis & Verify Fallback:**
   ```bash
   redis-cli shutdown
   # Prices should stop updating
   # WebSocket should disconnect (if relying on Redis pub/sub)
   redis-cli --daemonize yes  # Restart Redis
   ```

6. **Troubleshooting:**
   - **WebSocket not connected:** Check Redis is running
   - **No price updates:** Verify market_engine.py running
   - **Stale prices:** Check Redis `prices:<symbol>` TTL

---

### Workflow 7: Error Scenarios

**Objective:** Verify error handling and user feedback

**Steps:**

1. **Test Insufficient Funds:**
   - Try to buy 100,000 shares of AAPL
   - Expected: "Insufficient funds" error toast
   - Database: No order created

2. **Test Invalid Quantity:**
   - Try to buy 0 or negative shares
   - Expected: Validation error message
   - Form stays open

3. **Test Network Error:**
   - Open DevTools → Network → Throttle to "Offline"
   - Try to place order
   - Expected: "Network error" message
   - Restore network → error clears

4. **Test Missing Token:**
   - Open DevTools → console:
     ```javascript
     localStorage.removeItem('token');
     location.reload();
     ```
   - Expected: Redirect to login page
   - Can access public pages only

5. **Test Expired Token:**
   - Set token expiry to 1 second (dev only)
   - Wait 2 seconds, try to trade
   - Expected: 401 error, redirect to login

6. **Troubleshooting:**
   - **Error not shown:** Check toast notification provider
   - **Wrong error message:** Verify API response format

---

### Workflow 8: Performance & Load Testing

**Objective:** Verify system handles reasonable load

**Steps:**

1. **Measure Load Time:**
   - Open DevTools → Performance tab
   - Reload `/dashboard` page
   - Check First Contentful Paint (FCP) < 2s
   - Check Largest Contentful Paint (LCP) < 3s

2. **Test Many Orders:**
   - Place 50 orders (can automate via API)
   - Check order history page still responsive
   - Pagination should work smoothly

3. **Monitor Memory Usage:**
   - Watch browser memory in DevTools
   - Should not leak memory on page navigations
   - Stable after ~30 seconds of interaction

4. **Test WebSocket Stability:**
   - Connect for 30+ minutes
   - Check connection doesn't drop
   - Monitor for error messages

5. **Stress Test Trading:**
   - Execute 10 orders rapidly
   - Expected: All succeed (if sufficient funds)
   - Database transactions complete atomically

6. **Troubleshooting:**
   - **Slow load:** Check network tab for slow requests
   - **Memory leak:** Look for unclosed WebSocket subscriptions
   - **Failed trades under load:** Check database locks

---

## Create Test User (If Needed)

If test user doesn't exist, create it manually:

```bash
cd trading-platform-nextjs

# Access database
sqlite3 prisma/dev.db

# Create user with bcrypt-hashed password "test123"
INSERT INTO User (id, email, password, name, role, createdAt, updatedAt)
VALUES (
  'test-user-id-' || substr(hex(randomblob(8)), 1, 16),
  'test@trader.com',
  '$2b$10$cOuzLm.6PJuRiYNGjpcYv.3Az7xjWlrgU.aEQ2KD8Y2bUhuY6a25K',
  'Test Trader',
  'USER',
  datetime('now'),
  datetime('now')
);

# Create account with $100,000 balance
INSERT INTO Account (id, userId, balance, createdAt, updatedAt)
VALUES (
  'test-account-id-' || substr(hex(randomblob(8)), 1, 16),
  (SELECT id FROM User WHERE email='test@trader.com'),
  100000,
  datetime('now'),
  datetime('now')
);

# Verify
SELECT * FROM User WHERE email='test@trader.com';
.quit
```

## Automated Testing (Optional)

### API Testing with cURL

```bash
# 1. Login and capture token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@trader.com","password":"test123"}' \
  | jq -r '.token')

echo "Token: $TOKEN"

# 2. Get portfolio
curl -s -X GET http://localhost:3000/api/portfolio \
  -H "Authorization: Bearer $TOKEN" | jq .

# 3. Place order
curl -s -X POST http://localhost:3000/api/trade \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "AAPL",
    "quantity": 5,
    "type": "BUY",
    "price": 150.25
  }' | jq .

# 4. Check order history
curl -s -X GET "http://localhost:3000/api/orders?limit=10" \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### JavaScript Browser Console Testing

```javascript
// 1. Check token
const token = localStorage.getItem('token');
console.log('Token:', token ? '✅ Present' : '❌ Missing');

// 2. Fetch portfolio
const portfolio = await fetch('/api/portfolio', {
  headers: { Authorization: `Bearer ${token}` }
}).then(r => r.json());
console.log('Portfolio:', portfolio);

// 3. Place order
const order = await fetch('/api/trade', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    symbol: 'GOOGL',
    quantity: 3,
    type: 'BUY',
    price: 140.50
  })
}).then(r => r.json());
console.log('Order:', order);
```

## Debugging Tips

### Enable Verbose Logging

Add to Next.js `.env.local`:
```env
DEBUG=*
LOG_LEVEL=debug
```

### Check Server Logs

```bash
# In the Next.js terminal, look for:
[Auth] - Authentication operations
[Trade] - Trade execution
[Portfolio] - Portfolio updates
[WebSocket] - Connection events
```

### Database Inspection

```bash
# Open interactive database UI
npx prisma studio

# Or use SQLite CLI
sqlite3 trading-platform-nextjs/prisma/dev.db
.headers on
.mode column
SELECT * FROM "User" LIMIT 5;
SELECT * FROM "Order" ORDER BY createdAt DESC LIMIT 5;
```

### Network Inspection

1. Open DevTools → Network tab
2. Filter by type: XHR (API requests)
3. Click request → Review:
   - Request headers (Authorization)
   - Request body (parameters)
   - Response status (200, 401, 500, etc.)
   - Response data (success, error messages)

### WebSocket Inspection

1. Open DevTools → Network tab
2. Filter by "WS" protocol
3. Click WebSocket connection
4. Check Messages tab for real-time updates
5. Look for `PRICE_UPDATE`, `PORTFOLIO_UPDATE` messages

## Test Report Template

Use this template to document test results:

```
═══════════════════════════════════════════════════════
TEST REPORT: Zerodha Risk Platform
Date: [Date]
Tester: [Name]
═══════════════════════════════════════════════════════

ENVIRONMENT:
- Node.js: [version from `node -v`]
- npm: [version from `npm -v`]
- Redis: ✅ Running / ❌ Not running
- Market Engine: ✅ Running / ❌ Not running
- Database: ✅ Connected / ❌ Not connected

TEST RESULTS:
[ ] Workflow 1: Login & Dashboard      ✅ PASS / ❌ FAIL
[ ] Workflow 2: Buy Order              ✅ PASS / ❌ FAIL
[ ] Workflow 3: Analytics              ✅ PASS / ❌ FAIL
[ ] Workflow 4: Order History          ✅ PASS / ❌ FAIL
[ ] Workflow 5: Risk Controls          ✅ PASS / ❌ FAIL
[ ] Workflow 6: Real-Time Updates      ✅ PASS / ❌ FAIL
[ ] Workflow 7: Error Handling         ✅ PASS / ❌ FAIL

ISSUES FOUND:
1. [Description]
   - Steps to reproduce:
   - Expected behavior:
   - Actual behavior:
   - Severity: Critical / High / Medium / Low

NOTES:
[Additional observations]
```

---

**All tests passing?** The platform is ready for use or deployment. See [SETUP.md](SETUP.md) for deployment instructions.
