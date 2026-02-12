# Design System & UI Reference

Complete guide to the Zerodha Risk Platform design system, component library, and visual standards.

## Design Philosophy

The platform uses a **professional risk monitoring console** approach:
- **Minimal visual clutter** - Focus on data and risk management
- **Dark theme** - Eye-friendly for extended trading sessions
- **Neutral color palette** - Emphasis on data visualization
- **Consistent spacing** - Structured layout for scanning efficiency
- **Accessibility first** - Keyboard navigation and screen reader support

## Color Palette

### Primary Colors (Neutral Scale)

```css
/* Background Colors */
--bg-primary:    #0a0a0a    /* Main background (neutral-950) */
--bg-secondary:  #171717    /* Card surfaces (neutral-950/16) */
--bg-tertiary:   #262626    /* Hover states (neutral-800) */

/* Text Colors */
--text-primary:   #f5f5f5   /* Main text (neutral-100) */
--text-secondary: #d4d4d4   /* Secondary text (neutral-300) */
--text-muted:     #a3a3a3   /* Muted text (neutral-400) */
--text-subtle:    #737373   /* Subtle text (neutral-500) */

/* Border Colors */
--border:        #262626    /* Card borders (neutral-800) */
--border-subtle: #404040    /* Subtle borders (neutral-700) */
```

### Semantic Colors

```css
/* Success / Positive */
--accent-positive:  #10b981  /* P&L gains, buy status (emerald-500) */
--light-positive:   #d1fae5  /* Positive background (emerald-100) */
--text-positive:    #047857  /* Positive text (emerald-700) */

/* Danger / Negative */
--accent-negative:  #ef4444  /* P&L losses, sell status (red-500) */
--light-negative:   #fee2e2  /* Negative background (red-100) */
--text-negative:    #991b1b  /* Negative text (red-900) */

/* Warning / Caution */
--accent-warning:   #f59e0b  /* Warnings (amber-500) */
--light-warning:    #fef3c7  /* Warning background (amber-100) */
--text-warning:     #92400e  /* Warning text (amber-900) */

/* Info / Neutral */
--accent-info:      #3b82f6  /* Information (blue-500) */
--light-info:       #dbeafe  /* Info background (blue-100) */
--text-info:        #1e40af  /* Info text (blue-900) */
```

### Status Indicators

```css
--status-live:     #10b981   /* System connected (emerald-500) */
--status-offline:  #737373   /* System disconnected (neutral-500) */
--status-low:      #10b981   /* Low risk (emerald-500) */
--status-medium:   #f59e0b   /* Medium risk (amber-500) */
--status-high:     #ef4444   /* High risk (red-500) */
```

## Typography

### Font Stack

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
font-feature-settings: 'cv11', 'ss01';
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

### Font Weights

```css
--font-light:       300  /* Rare, large decorative text */
--font-normal:      400  /* Body text, descriptions */
--font-medium:      500  /* Headings, emphasis */
--font-semibold:    600  /* Data labels, numbers */
--font-bold:        700  /* Reserved for special emphasis */
```

### Font Sizes & Line Heights

```css
/* Display / Headers */
h1: 2rem   (32px)  line-height: 2.5rem  (40px)   -- Page title
h2: 1.5rem (24px)  line-height: 2rem    (32px)   -- Section header
h3: 1.25rem(20px)  line-height: 1.75rem (28px)   -- Subsection

/* Body */
body:      1rem    (16px)  line-height: 1.5rem   (24px)   -- Default text
small:     0.875rem(14px)  line-height: 1.25rem  (20px)   -- Helper text
code:      0.875rem(14px)  monospace                       -- Code/data

/* Labels */
label:     0.875rem(14px)  font-weight: 500               -- Form labels
badge:     0.75rem (12px)  font-weight: 600               -- Status badges
```

## Spacing System

```css
/* 4px base unit (8px would be too large) */
--space-0:   0px
--space-1:   4px      /* Tight spacing */
--space-2:   8px      /* Compact */
--space-3:   12px     /* Default */
--space-4:   16px     /* Comfortable */
--space-5:   20px     /* Generous */
--space-6:   24px     /* Large sections */
--space-8:   32px     /* Major sections */
--space-10:  40px     /* Page-level spacing */
```

## Component Library (shadcn/ui)

### Button Variants

#### Primary (Default)
Used for main actions.
```tsx
<Button>Execute Trade</Button>
// Background: blue-600, Text: white
// Hover: blue-700
```

#### Secondary
Used for alternative actions.
```tsx
<Button variant="secondary">Cancel</Button>
// Background: neutral-700, Text: white
// Hover: neutral-800
```

#### Destructive
Used for dangerous actions (DELETE, SELL all).
```tsx
<Button variant="destructive">Liquidate Position</Button>
// Background: red-600, Text: white
// Hover: red-700
```

#### Outline
Used for less prominent actions.
```tsx
<Button variant="outline">More Options</Button>
// Background: transparent, Border: blue-600
// Hover: blue-50
```

#### Ghost
Used for minimal/text-like buttons.
```tsx
<Button variant="ghost">Help</Button>
// Background: transparent
// Hover: neutral-100
```

#### Success
Used for positive confirmations.
```tsx
<Button variant="success">Confirm Buy</Button>
// Background: emerald-600, Text: white
// Hover: emerald-700
```

### Button Sizes

```tsx
<Button size="sm">Small</Button>      <!-- 8px py, 12px px -->
<Button size="md">Default</Button>    <!-- 10px py, 16px px -->
<Button size="lg">Large</Button>      <!-- 12px py, 24px px -->
<Button size="icon">🔔</Button>       <!-- Square button for icons -->
```

### Badge Variants

#### Status Badges
```tsx
<Badge variant="success">FILLED</Badge>      // Green
<Badge variant="warning">PENDING</Badge>     // Amber
<Badge variant="destructive">REJECTED</Badge> // Red
<Badge variant="secondary">CANCELLED</Badge> // Gray
```

#### Risk Level Badges
```tsx
<Badge className="bg-emerald-100 text-emerald-900">LOW RISK</Badge>
<Badge className="bg-amber-100 text-amber-900">MEDIUM RISK</Badge>
<Badge className="bg-red-100 text-red-900">HIGH RISK</Badge>
```

### Card Component

```tsx
<Card>
  <CardHeader>
    <CardTitle>Portfolio Summary</CardTitle>
    <CardDescription>Your current holdings and balance</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content here */}
  </CardContent>
</Card>
```

### Dialog Component

Used for modals and forms (e.g., trade dialog).

```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger>
    <Button>Buy</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Place Order</DialogTitle>
    </DialogHeader>
    {/* Form content */}
  </DialogContent>
</Dialog>
```

### Input & Label

```tsx
<div className="space-y-2">
  <Label htmlFor="quantity">Quantity</Label>
  <Input
    id="quantity"
    type="number"
    placeholder="Enter number of shares"
    min="1"
  />
</div>
```

### Table Component

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Symbol</TableHead>
      <TableHead>Price</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>AAPL</TableCell>
      <TableCell>$150.25</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## Custom Components

### TradeDialog
Order placement modal with validation and error handling.

```tsx
<TradeDialog
  symbol="AAPL"
  currentPrice={150.25}
  onOrderPlaced={(order) => console.log(order)}
  onError={(error) => console.error(error)}
/>
```

## Layout Patterns

### Main Dashboard Layout

```
┌─────────────────────────────────────────────────────────┐
│ Header: Portfolio Risk Monitoring Console   [● Live]    │
├──────────────────┬──────────────────────────────────────┤
│ Sidebar Nav      │ Main Content Area                    │
│ ├─ Dashboard     │ ┌────────────────────────────────┐  │
│ ├─ Analysis      │ │ Risk Status Card               │  │
│ ├─ Execution     │ │ Risk: 2.4/10 [GREEN]           │  │
│ ├─ Controls      │ └────────────────────────────────┘  │
│ └─ Settings      │                                      │
│                  │ ┌──────┬──────┬──────┐               │
│                  │ │ VaR  │ Drdn │ Exp  │               │
│                  │ │ 2450 │ -8.5%│ 45%  │               │
│                  │ └──────┴──────┴──────┘               │
│                  │                                      │
│                  │ Holdings                             │
│                  │ ┌─────────────────────────────────┐ │
│                  │ │ AAPL  │ 10  │ 1500 │ +52 (+3%) │ │
│                  │ │ GOOGL │ 5   │ 750  │ -25 (-3%) │ │
│                  │ └─────────────────────────────────┘ │
└──────────────────┴──────────────────────────────────────┘
```

### Analysis Page Tabs

```
┌─────────────────────────────────────────────┐
│ ┌──────┬───────┬──────────┬────────────┐    │
│ │ PerfM│ Risk  │Allocation│Trading Act │    │ [Tabs]
│ └──────┴───────┴──────────┴────────────┘    │
├─────────────────────────────────────────────┤
│ Performance Metrics                          │
│ ├─ Line Chart: Portfolio Value Over Time    │
│ ├─ Area Chart: Cumulative Returns           │
│ ├─ Statistics: Total Return, Sharpe, etc    │
│ └─ Daily/Weekly/Monthly breakdown           │
└─────────────────────────────────────────────┘
```

## Responsive Design

### Breakpoints

```css
/* Tailwind CSS breakpoints */
xs: 0px                  /* Mobile */
sm: 640px                /* Tablet */
md: 768px                /* Small laptop */
lg: 1024px               /* Desktop */
xl: 1280px               /* Large desktop */
2xl: 1536px              /* Extra large */
```

### Mobile Considerations
- Stack navigation vertically
- Full-width cards
- Larger touch targets (48px minimum)
- Simplified charts
- Hide non-essential UI elements

## Accessibility Standards

### WCAG 2.1 AA Compliance

- **Color Contrast:** Minimum 4.5:1 for text
- **Focus States:** Visible keyboard navigation
- **Labels:** All inputs have associated labels
- **Screen Reader:** Semantic HTML and ARIA
- **Motion:** Respect `prefers-reduced-motion`

### Keyboard Navigation

- `Tab` - Move focus forward
- `Shift+Tab` - Move focus backward
- `Enter` - Click/activate focused element
- `Escape` - Close dialogs/menus
- `Space` - Activate buttons

## Dark Mode Implementation

```tsx
// Global settings use system preference
<html className={isDarkMode ? "dark" : ""}>
  {/* Content automatically respects CSS variables */}
</html>
```

CSS variables automatically switch:
```css
/* Light mode */
background-color: var(--bg-primary);  /* white → #0a0a0a */
color: var(--text-primary);            /* black → #f5f5f5 */
```

## Animation & Transitions

### Micro-interactions

```css
/* Smooth transitions for interactive elements */
transition: background-color 200ms ease,
            color 200ms ease,
            border-color 200ms ease;

/* Avoid animation for reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Page Transitions

```tsx
// Fade in on mount
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

## Icon System

Using `lucide-react` icons (24px by default):

```tsx
import { TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

<TrendingUp className="w-6 h-6 text-emerald-500" />
<AlertCircle className="w-6 h-6 text-amber-500" />
<CheckCircle className="w-6 h-6 text-emerald-500" />
```

## Data Visualization

### Chart Colors

Using consistent colors across all charts:

```tsx
// Recharts configuration
const chartConfig = {
  positive: '#10b981',  // Green (gains)
  negative: '#ef4444',  // Red (losses)
  neutral: '#3b82f6',   // Blue (neutral)
  grid: '#262626',      // Border color
  text: '#a3a3a3',      // Label text
};
```

### Number Formatting

```tsx
// Currency
$1,234.56

// Percentages
+3.45% (green), -2.10% (red)

// Large numbers
1.2M, 850K, 45.3B

// Decimal places
4 decimal places for prices (e.g., $150.2500)
2 decimal places for amounts (e.g., $1,234.50)
```

## Best Practices

### DO ✅
- Use semantic colors for status (green=good, red=bad)
- Maintain compact spacing for data density
- Provide clear visual hierarchy
- Use icons for quick scanning
- Include descriptive labels
- Test with screen readers
- Support keyboard navigation

### DON'T ❌
- Mix accent colors randomly
- Clutter with unnecessary visual elements
- Use color alone to convey meaning
- Forget about mobile/responsive views
- Create small touch targets (<40px)
- Use auto-playing animations
- Rely on hover-only states

## Component Usage Examples

### Risk Alert Banner

```tsx
<div className="bg-red-100 border border-red-300 rounded-lg p-4">
  <div className="flex items-center gap-3">
    <AlertCircle className="w-5 h-5 text-red-600" />
    <div>
      <h3 className="font-semibold text-red-900">
        High Risk Alert
      </h3>
      <p className="text-sm text-red-700">
        Your portfolio risk has exceeded 75%
      </p>
    </div>
  </div>
</div>
```

### Data Card

```tsx
<Card>
  <CardHeader className="pb-2">
    <CardTitle className="text-sm font-medium">
      Value at Risk (95%)
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-semibold">
      ₹2,450.00
    </div>
    <p className="text-xs text-muted-foreground mt-1">
      Maximum expected loss
    </p>
  </CardContent>
</Card>
```

---

**Next Steps:** Check [SETUP.md](SETUP.md) to get started with the platform.
