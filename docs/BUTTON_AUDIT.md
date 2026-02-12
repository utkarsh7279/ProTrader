# Button Functionality Audit Checklist

This checklist verifies all interactive buttons and features are working correctly before deployment.

## 🎯 Authentication Buttons

### Login Page (`/login`)
- [ ] **Email Input** - Can type email address
- [ ] **Password Input** - Can type password
- [ ] **Login Button** - Submits form and redirects to dashboard
- [ ] **Forgot Password Link** - Visible (may be placeholder)
- [ ] **Signup Link** - Routes to `/signup` page
- [ ] **Error Handling** - Shows error toast for invalid credentials

### Signup Page (`/signup`)
- [ ] **Email Input** - Can type email
- [ ] **Password Input** - Can type password
- [ ] **Name Input** - Can type name
- [ ] **Signup Button** - Creates account and stores token
- [ ] **Login Link** - Routes back to `/login`
- [ ] **Validation** - Shows errors for weak passwords/blank fields

---

## 📊 Dashboard Buttons (`/dashboard`)

### Export & Order Buttons
- [ ] **Export Button** - Opens dropdown menu
  - [ ] **Export as CSV** - Downloads portfolio_YYYY-MM-DD.csv file
  - [ ] **Export as JSON** - Downloads portfolio_YYYY-MM-DD.json file
- [ ] **New Order Button** - Opens TradeDialog

### TradeDialog (Popup)
- [ ] **Symbol Dropdown** - Can select AAPL, GOOGL, MSFT, TSLA, TCS, INFY, RELIANCE, HDFCBANK
- [ ] **Quantity Input** - Can enter number (validation: positive integers)
- [ ] **Order Type Dropdown** 
  - [ ] **BUY** - Shows green badge
  - [ ] **SELL** - Shows red badge
- [ ] **Price Type** - Can select MARKET or LIMIT
- [ ] **Limit Price Input** - Shows when LIMIT selected
- [ ] **Place Order Button** - Executes order (if sufficient funds)
  - [ ] Success toast appears
  - [ ] Holdings table updates
  - [ ] Balance decreases for BUY orders
- [ ] **Dialog Close** - Works via X button or clicking outside

### Risk Alert
- [ ] **Risk Alert Button** - Shows when risk > 75%
- [ ] **RiskAlert Dialog** - Displays risk details

---

## 🔍 Analysis Page (`/analysis`)

### Tab Navigation
- [ ] **Performance Tab** - Loads performance chart and metrics
  - [ ] Chart renders without errors
  - [ ] Statistics display correctly
- [ ] **Risk Tab** - Shows risk metrics:
  - [ ] VaR calculation
  - [ ] Max drawdown
  - [ ] Risk score color-coded
- [ ] **Allocation Tab** - Pie chart shows portfolio allocation
  - [ ] Percentages add to 100%
  - [ ] Symbols labeled correctly
- [ ] **Activity Tab** - Shows recent trades table
  - [ ] Data populates from database
  - [ ] Timestamps display

---

## ⚙️ Controls Page (`/controls`)

### Risk Limit Controls
- [ ] **VaR Limit Slider** - Can drag to adjust value
  - [ ] Value updates in real-time
  - [ ] Persists after page refresh
- [ ] **Max Drawdown Input** - Can enter percentage
- [ ] **Max Position Input** - Can enter percentage
- [ ] **Auto-Reduce Toggle** - Can toggle ON/OFF
  - [ ] State persists in localStorage
- [ ] **Circuit Breaker Toggle** - Can toggle ON/OFF
  - [ ] State persists in localStorage

---

## 📝 Execution Page (`/execution`)

### Order History
- [ ] **Symbol Filter** - Can filter by symbol
  - [ ] Results update immediately
  - [ ] URL updates with query params
- [ ] **Type Filter** - Can filter BUY/SELL
- [ ] **Status Badge** - Shows FILLED/PENDING/REJECTED
- [ ] **Pagination** - Shows page numbers
  - [ ] "Previous" button works
  - [ ] "Next" button works
- [ ] **Statistics Cards** - Display calculated values
  - [ ] Total Orders
  - [ ] Fill Rate
  - [ ] Total Spent/Earned

---

## ⚙️ Settings Page (`/settings`)

### Account Settings
- [ ] **Name Input** - Can edit name
- [ ] **Email Display** - Shows current email
- [ ] **Verification Badge** - Shows verification status

### Notification Toggles
- [ ] **Email Alerts Toggle** - Can ON/OFF
- [ ] **SMS Alerts Toggle** - Can toggle
- [ ] **Trade Confirmations Toggle** - Can toggle
- [ ] **Risk Alerts Toggle** - Can toggle

### Display Preferences
- [ ] **Theme Selector** - Can select Dark/Light (if available)
- [ ] **Currency Selector** - Can select currency
- [ ] **Timezone Selector** - Can select timezone

### Security
- [ ] **Change Password Button** - Opens form
- [ ] **Logged In Sessions** - Shows session info
- [ ] **Logout Button** - Logs out and redirects to `/login`

---

## 🎨 Header & Navigation

### Console Shell Header
- [ ] **Logo/Title** - Displays "Portfolio Risk Monitoring Console"
- [ ] **Current Page Indicator** - Shows active page name
- [ ] **WebSocket Status Indicator**
  - [ ] Green dot when connected
  - [ ] Updates to gray when disconnected
- [ ] **Live/Updating Badge** - Shows connection status
- [ ] **Theme Toggle Button** (Sun/Moon icon)
  - [ ] Clicking toggles dark/light mode
  - [ ] Page reloads with new theme
  - [ ] Preference persists on reload
- [ ] **User Name Display** - Shows logged-in user name

### Sidebar Navigation
- [ ] **Dashboard Link** - Routes to `/dashboard` & highlights when active
- [ ] **Analysis Link** - Routes to `/analysis` & highlights when active
- [ ] **Controls Link** - Routes to `/controls` & highlights when active
- [ ] **Execution Link** - Routes to `/execution` & highlights when active
- [ ] **Settings Link** - Routes to `/settings` & highlights when active
- [ ] **All Links** - Display correct icons and labels

---

## 🚀 Special Features

### Real-Time Updates
- [ ] **WebSocket Connection** - Shows "Connected" message in toast
- [ ] **Price Updates** - Holdings prices update every 2 seconds
- [ ] **P&L Updates** - Profit/loss recalculates in real-time
- [ ] **Portfolio Refresh** - Auto-updates after trades

### Error Handling
- [ ] **Insufficient Funds Error** - Shows when trying to buy without balance
- [ ] **Network Error** - Shows when server unreachable
- [ ] **Unauthorized Error** - Redirects to login if token expired
- [ ] **Validation Errors** - Form doesn't submit with invalid data

---

## Quick Test Workflow

Run these steps in order to validate all features:

```
1. ✅ Login with test@trader.com / test123
2. ✅ Navigate to Dashboard
   - Verify Export button works (download CSV)
   - Click New Order
3. ✅ Place a BUY order
   - Select AAPL quantity 5
   - Click Place Order
   - See success toast
   - Holdings table updates
4. ✅ Toggle Theme
   - Click Sun/Moon icon in header
   - Page switches between dark/light
5. ✅ Place a SELL order
   - Click New Order
   - Select BUY type → change to SELL
   - Select AAPL quantity 2
   - Verify error if no holdings (or success if holding exists)
6. ✅ Check Analysis
   - Click Analysis in sidebar
   - Verify 4 tabs load
   - Check each tab has data
7. ✅ Check Execution
   - Click Execution
   - Verify order history shows
   - Test filters
8. ✅ Check Controls
   - Click Controls
   - Adjust sliders
   - Toggle switches
   - Refresh page - settings persist
9. ✅ Check Settings
   - Click Settings
   - Toggle notifications
   - Verify all options present
10. ✅ Logout
    - Click user name / Logout
    - Redirected to login
```

---

## Test Results Template

```
Test Date: [DATE]
Tester: [NAME]
Environment: Local / Staging / Production

BUTTON FUNCTIONALITY STATUS:
[✅] Authentication   - All login/signup buttons working
[✅] Dashboard        - Export, Orders, Trade Dialog functional
[✅] Analysis         - Tabs, charts, data loading
[✅] Controls         - Sliders, toggles, persistence
[✅] Execution        - Filters, pagination, statistics
[✅] Settings         - Toggles, preferences saved
[✅] Navigation       - All sidebar links working
[✅] Header           - Theme toggle, status indicators
[✅] Error Handling   - Invalid inputs handled gracefully
[✅] Real-Time        - WebSocket connected, prices updating

ISSUES FOUND:
1. [Severity: HIGH/MEDIUM/LOW]
   Title: [Button/Feature Name]
   Issue: [Description]
   Steps to Reproduce: [Steps]

SIGN-OFF:
[ ] All non-critical features working
[ ] All critical features verified
[ ] Ready for deployment
```

---

## Quick Fixes Reference

If buttons aren't working:

### Button Not Responding
- Check browser console for errors (F12)
- Verify server is running on port 3000
- Check network tab for failed API requests

### Toggle Not Persisting
- Check localStorage: `localStorage.getItem('theme')`
- Verify localStorage being set in component

### Export Not Downloading
- Check if token is valid
- Verify `/api/portfolio` endpoint returns data
- Check browser console for errors

### Dialog Not Closing
- Verify `onClose` prop is passed correctly
- Check if `setTradeDialogOpen(false)` is called

### Navigation Not Working
- Check if Next.js router is properly initialized
- Verify href paths match defined routes
- Check console for routing errors

---

**Ready to test?** Start with the Quick Test Workflow above and document any issues found.
