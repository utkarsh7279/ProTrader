import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/prices
 * 
 * Retrieves historical price data for charting and analysis
 * 
 * Query Parameters:
 * - symbol: Stock symbol (required, e.g., "TCS")
 * - interval: Time interval in hours (default: 24, shows last 24 hours)
 * - limit: Maximum number of data points (default: 100)
 * 
 * Response includes:
 * - Current price
 * - High/Low prices
 * - Volume
 * - Historical trend data
 * 
 * Example:
 * GET /api/prices?symbol=TCS&interval=24&limit=100
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

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol');
    const interval = parseInt(searchParams.get('interval') || '24');
    const limit = parseInt(searchParams.get('limit') || '100');

    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol is required' },
        { status: 400 }
      );
    }

    // Calculate time range
    const now = new Date();
    const startTime = new Date(now.getTime() - interval * 60 * 60 * 1000);

    // Get historical prices
    const prices = await prisma.priceHistory.findMany({
      where: {
        symbol: symbol.toUpperCase(),
        timestamp: {
          gte: startTime,
          lte: now,
        },
      },
      orderBy: { timestamp: 'asc' },
      take: limit,
    });

    if (prices.length === 0) {
      return NextResponse.json(
        { error: `No price data available for ${symbol}` },
        { status: 404 }
      );
    }

    // Calculate price statistics
    const pricesOnly = prices.map((p) => p.price);
    const currentPrice = pricesOnly[pricesOnly.length - 1];
    const openPrice = pricesOnly[0];
    const highPrice = Math.max(...pricesOnly);
    const lowPrice = Math.min(...pricesOnly);
    const avgPrice = pricesOnly.reduce((a, b) => a + b, 0) / pricesOnly.length;
    const priceChange = currentPrice - openPrice;
    const priceChangePercent = (priceChange / openPrice) * 100;

    return NextResponse.json(
      {
        status: 'success',
        symbol: symbol.toUpperCase(),
        interval: `${interval} hours`,
        data: {
          current: {
            price: parseFloat(currentPrice.toFixed(2)),
            open: parseFloat(openPrice.toFixed(2)),
            high: parseFloat(highPrice.toFixed(2)),
            low: parseFloat(lowPrice.toFixed(2)),
            avg: parseFloat(avgPrice.toFixed(2)),
            change: parseFloat(priceChange.toFixed(2)),
            changePercent: parseFloat(priceChangePercent.toFixed(2)),
          },
          history: prices.map((p) => ({
            price: parseFloat(p.price.toFixed(2)),
            timestamp: p.timestamp.toISOString(),
            high: p.high ? parseFloat(p.high.toFixed(2)) : p.price,
            low: p.low ? parseFloat(p.low.toFixed(2)) : p.price,
            volume: p.volume,
          })),
          stats: {
            dataPoints: prices.length,
            startTime: startTime.toISOString(),
            endTime: now.toISOString(),
            trend: priceChangePercent > 0 ? 'UP' : 'DOWN',
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Prices error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
