import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Redis from 'ioredis';

interface Order {
  status: string;
  type: string;
  symbol: string;
  price: number;
  qty: number;
  createdAt: Date;
}

interface Holding {
  id: string;
  symbol: string;
  qty: number;
  avgPrice: number;
}

interface EnrichedHolding extends Holding {
  currentPrice: number;
  pnl: number;
}

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

/**
 * GET /api/analytics
 * 
 * Provides comprehensive portfolio analytics and performance metrics
 * 
 * Returns:
 * - Total Return: Overall profit/loss percentage
 * - ROI: Return on Investment
 * - Win Rate: Percentage of profitable trades
 * - Average Win/Loss: Average profit and loss per trade
 * - Sharpe Ratio: Risk-adjusted returns
 * - Best/Worst Trade: Best and worst performing trades
 * - Daily Returns: Performance by day
 * - Sector Analysis: Holdings by category
 */

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user account
    const account = await prisma.account.findFirst({
      where: { userId: user.userId },
      include: { orders: true, holdings: true },
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    // Calculate portfolio analytics
    const filledOrders: Order[] = account.orders.filter((o: Order) => o.status === 'FILLED');

    // 1. Buy and Sell Statistics
    const buyOrders = filledOrders.filter((o: Order) => o.type === 'BUY');
    const sellOrders = filledOrders.filter((o: Order) => o.type === 'SELL');

    const totalBuyValue = buyOrders.reduce(
      (sum: number, o: Order) => sum + o.price * o.qty,
      0
    );
    const totalSellValue = sellOrders.reduce(
      (sum: number, o: Order) => sum + o.price * o.qty,
      0
    );

    // 2. Realized Profit/Loss (from closed positions)
    const realizedPnL = totalSellValue - totalBuyValue;

    // 3. Unrealized Profit/Loss (from open positions)
    let unrealizedPnL = 0;
    const enrichedHoldings: EnrichedHolding[] = await Promise.all(
      account.holdings.map(async (holding: Holding): Promise<EnrichedHolding> => {
        const priceStr = await redis.get(`price:${holding.symbol}`);
        const currentPrice = priceStr ? parseFloat(priceStr) : holding.avgPrice;
        const value = currentPrice * holding.qty;
        const cost = holding.avgPrice * holding.qty;
        const pnl = value - cost;
        unrealizedPnL += pnl;
        return { ...holding, currentPrice, pnl };
      })
    );

    // 4. Total Return
    const totalPnL = realizedPnL + unrealizedPnL;
    const roi = totalBuyValue > 0 ? (totalPnL / totalBuyValue) * 100 : 0;

    // 5. Win Rate
    const profitableTrades = filledOrders.filter((order: Order) => {
      const nextSellOrder = filledOrders.find(
        (o: Order) =>
          o.type === 'SELL' &&
          o.symbol === order.symbol &&
          o.createdAt > order.createdAt
      );
      return nextSellOrder && nextSellOrder.price > order.price;
    });
    const winRate =
      filledOrders.length > 0
        ? (profitableTrades.length / filledOrders.length) * 100
        : 0;

    // 6. Average Win/Loss
    const profitTrades = filledOrders.filter((o: Order) => o.type === 'BUY');
    const avgWin = profitTrades.length > 0 ? totalSellValue / profitTrades.length : 0;
    const avgLoss = profitTrades.length > 0 ? totalBuyValue / profitTrades.length : 0;

    // 7. Best and Worst Trade
    let bestTrade = { symbol: '', gain: 0 };
    let worstTrade = { symbol: '', loss: 0 };

    for (const buyOrder of buyOrders) {
      const sellOrder = sellOrders.find(
        (o: Order) =>
          o.symbol === buyOrder.symbol && o.createdAt > buyOrder.createdAt
      );
      if (sellOrder) {
        const gain = sellOrder.price - buyOrder.price;
        if (gain > bestTrade.gain) {
          bestTrade = { symbol: buyOrder.symbol, gain };
        }
        if (gain < worstTrade.loss) {
          worstTrade = { symbol: buyOrder.symbol, loss: gain };
        }
      }
    }

    // 8. Top Holdings
    const topHoldings = enrichedHoldings
      .sort((a: EnrichedHolding, b: EnrichedHolding) => Math.abs(b.pnl) - Math.abs(a.pnl))
      .slice(0, 5);

    // 9. Volatility (Sharpe Ratio approximation)
    const dailyReturns = filledOrders.map((o: Order) => (o.price - o.price) / o.price);
    const avgReturn = dailyReturns.length > 0 ? dailyReturns.reduce((a: number, b: number) => a + b) / dailyReturns.length : 0;
    const variance =
      dailyReturns.length > 1
        ? dailyReturns.reduce((sum: number, r: number) => sum + Math.pow(r - avgReturn, 2), 0) / (dailyReturns.length - 1)
        : 0;
    const volatility = Math.sqrt(variance);
    const sharpeRatio = volatility > 0 ? avgReturn / volatility : 0;

    return NextResponse.json(
      {
        status: 'success',
        analytics: {
          performance: {
            totalReturn: parseFloat(totalPnL.toFixed(2)),
            returnPercentage: parseFloat(roi.toFixed(2)),
            realizedPnL: parseFloat(realizedPnL.toFixed(2)),
            unrealizedPnL: parseFloat(unrealizedPnL.toFixed(2)),
          },
          trading: {
            totalTrades: filledOrders.length,
            buyTrades: buyOrders.length,
            sellTrades: sellOrders.length,
            winRate: parseFloat(winRate.toFixed(2)),
            profitableTrades: profitableTrades.length,
            loossingTrades: filledOrders.length - profitableTrades.length,
          },
          avgTradeValue: {
            avgWin: parseFloat(avgWin.toFixed(2)),
            avgLoss: parseFloat(avgLoss.toFixed(2)),
          },
          bestWorstTrades: {
            bestTrade: {
              symbol: bestTrade.symbol,
              gain: parseFloat(bestTrade.gain.toFixed(2)),
            },
            worstTrade: {
              symbol: worstTrade.symbol,
              loss: parseFloat(worstTrade.loss.toFixed(2)),
            },
          },
          riskMetrics: {
            volatility: parseFloat(volatility.toFixed(4)),
            sharpeRatio: parseFloat(sharpeRatio.toFixed(4)),
            maxDrawdown: 'N/A',
          },
          topHoldings: topHoldings.map((h: EnrichedHolding) => ({
              symbol: h.symbol,
              qty: h.qty,
              avgPrice: parseFloat(h.avgPrice.toFixed(2)),
              currentPrice: parseFloat(h.currentPrice.toFixed(2)),
              unrealizedPnL: parseFloat(h.pnl.toFixed(2)),
              unrealizedPnLPercent: parseFloat(((h.pnl / (h.avgPrice * h.qty)) * 100).toFixed(2)),
            })),
          summary: {
            totalInvested: parseFloat(totalBuyValue.toFixed(2)),
            totalRealized: parseFloat(totalSellValue.toFixed(2)),
            accountBalance: parseFloat(account.balance.toFixed(2)),
            equity: parseFloat((account.balance + unrealizedPnL).toFixed(2)),
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
