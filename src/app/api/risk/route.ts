import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Redis from 'ioredis';

const redis = new Redis({
  host: 'localhost',
  port: 6379,
});

/**
 * GET /api/risk
 * 
 * Calculate real-time risk metrics for user's portfolio
 * Returns:
 * - riskScore: Overall portfolio risk (0-1 scale)
 * - var: Value at Risk (VaR) 95% confidence
 * - drawdown: Maximum drawdown percentage
 * - concentration: Portfolio concentration risk
 * - volatility: Portfolio volatility
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
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    // Get holdings
    const holdings = await prisma.holding.findMany({
      where: { accountId: account.id },
    });

    if (holdings.length === 0) {
      return NextResponse.json({
        riskScore: 0,
        var: 0,
        drawdown: 0,
        concentration: 0,
        volatility: 0,
        totalValue: account.balance,
        message: 'No holdings - zero risk',
      });
    }

    // Calculate current portfolio value
    let totalHoldingsValue = 0;
    let totalPnL = 0;
    const holdingValues: number[] = [];

    for (const holding of holdings) {
      const priceStr = await redis.get(`price:${holding.symbol}`);
      const currentPrice = priceStr ? parseFloat(priceStr) : holding.avgPrice;
      const holdingValue = currentPrice * holding.qty;
      const pnl = (currentPrice - holding.avgPrice) * holding.qty;

      totalHoldingsValue += holdingValue;
      totalPnL += pnl;
      holdingValues.push(holdingValue);
    }

    const totalPortfolioValue = account.balance + totalHoldingsValue;

    // Calculate concentration risk (Herfindahl index)
    const concentration = holdingValues.reduce((sum, value) => {
      const weight = value / totalHoldingsValue;
      return sum + weight * weight;
    }, 0);

    // Estimate volatility (simplified - based on diversification)
    // More holdings = lower volatility
    const diversificationFactor = Math.min(holdings.length / 10, 1);
    const baseVolatility = 0.25; // 25% base volatility
    const volatility = baseVolatility * (1 - diversificationFactor * 0.5);

    // Calculate VaR (95% confidence) using normal distribution approximation
    // VaR = Portfolio Value * Volatility * Z-score (1.645 for 95%)
    const var95 = totalPortfolioValue * volatility * 1.645;

    // Calculate max drawdown (simplified)
    const drawdownPercent = totalPnL < 0 
      ? (Math.abs(totalPnL) / (totalHoldingsValue + Math.abs(totalPnL))) * 100 
      : 0;

    // Calculate overall risk score (0-1)
    // Factors: concentration, volatility, leverage
    const leverage = totalHoldingsValue / totalPortfolioValue;
    let riskScore = 0;
    
    // Concentration risk contribution (0-0.4)
    riskScore += Math.min(concentration * 0.4, 0.4);
    
    // Volatility contribution (0-0.3)
    riskScore += Math.min((volatility / baseVolatility) * 0.3, 0.3);
    
    // Leverage contribution (0-0.3)
    riskScore += Math.min((leverage - 0.5) * 0.6, 0.3);

    riskScore = Math.max(0, Math.min(1, riskScore));

    // Determine risk level and generate alerts
    let riskLevel = 'LOW';
    let alertMessage = null;

    if (riskScore > 0.75) {
      riskLevel = 'HIGH';
      alertMessage = `⚠️ HIGH RISK: Portfolio risk score is ${(riskScore * 100).toFixed(1)}%. Consider diversifying or reducing leverage.`;
    } else if (riskScore > 0.5) {
      riskLevel = 'MEDIUM';
      alertMessage = `⚡ MEDIUM RISK: Portfolio risk score is ${(riskScore * 100).toFixed(1)}%. Monitor positions closely.`;
    }

    const riskMetrics = {
      riskScore: Math.round(riskScore * 100) / 100,
      riskLevel,
      var: Math.round(var95 * 100) / 100,
      drawdown: Math.round(drawdownPercent * 100) / 100,
      concentration: Math.round(concentration * 100) / 100,
      volatility: Math.round(volatility * 100) / 100,
      leverage: Math.round(leverage * 100) / 100,
      totalValue: Math.round(totalPortfolioValue * 100) / 100,
      holdingsValue: Math.round(totalHoldingsValue * 100) / 100,
      pnl: Math.round(totalPnL * 100) / 100,
      balance: account.balance,
      alert: alertMessage,
    };

    return NextResponse.json(riskMetrics);

  } catch (error: any) {
    console.error('Risk calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate risk metrics', details: error.message },
      { status: 500 }
    );
  }
}
