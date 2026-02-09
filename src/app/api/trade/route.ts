import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Redis from 'ioredis';

const redis = new Redis({
  host: 'localhost',
  port: 6379,
});

interface TradeRequest {
  symbol: string;
  type: 'BUY' | 'SELL';
  qty: number;
}

interface BucketRange {
  label: string;
  start: Date;
  end: Date;
}

const rangeConfig: Record<string, { days: number; buckets: number; labelPrefix: string }> = {
  "7d": { days: 7, buckets: 7, labelPrefix: "D" },
  "30d": { days: 30, buckets: 4, labelPrefix: "W" },
  "90d": { days: 90, buckets: 3, labelPrefix: "M" },
  "1y": { days: 365, buckets: 4, labelPrefix: "Q" },
};

const rangeLabelMap: Record<string, string> = {
  "7d": "last 7 days",
  "30d": "last 30 days",
  "90d": "last 90 days",
  "1y": "last year",
};

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const buildBuckets = (range: string, endDate: Date) => {
  const config = rangeConfig[range] || rangeConfig["7d"];
  const startDate = addDays(endDate, -config.days + 1);
  const bucketSize = Math.ceil(config.days / config.buckets);
  const buckets: BucketRange[] = [];

  for (let i = 0; i < config.buckets; i += 1) {
    const start = addDays(startDate, i * bucketSize);
    const end = addDays(startDate, (i + 1) * bucketSize);
    const label = config.buckets === 7
      ? dayLabels[start.getDay()]
      : `${config.labelPrefix}${i + 1}`;

    buckets.push({ label, start, end });
  }

  return { startDate, buckets };
};

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - invalid or missing token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';
    const endDate = new Date();
    const { startDate, buckets } = buildBuckets(range, endDate);

    const account = await prisma.account.findFirst({
      where: { userId: user.userId },
    });

    if (!account) {
      return NextResponse.json({
        range,
        label: rangeLabelMap[range] || 'selected range',
        buckets: buckets.map((bucket) => ({
          label: bucket.label,
          buys: 0,
          sells: 0,
        })),
        stats: {
          totalTrades: 0,
          buys: 0,
          sells: 0,
          avgTrade: 0,
          winRate: 0,
        },
      });
    }

    const orders = await prisma.order.findMany({
      where: {
        accountId: account.id,
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: 'asc' },
    });

    const bucketData = buckets.map((bucket) => ({
      label: bucket.label,
      buys: 0,
      sells: 0,
    }));

    let totalTrades = 0;
    let buys = 0;
    let sells = 0;
    let totalValue = 0;

    orders.forEach((order) => {
      totalTrades += 1;
      totalValue += order.price * order.qty;
      if (order.type === 'BUY') {
        buys += 1;
      } else if (order.type === 'SELL') {
        sells += 1;
      }

      const createdAt = order.createdAt;
      const bucketIndex = buckets.findIndex((bucket) => createdAt >= bucket.start && createdAt < bucket.end);
      if (bucketIndex >= 0) {
        if (order.type === 'BUY') {
          bucketData[bucketIndex].buys += 1;
        } else if (order.type === 'SELL') {
          bucketData[bucketIndex].sells += 1;
        }
      }
    });

    const avgTrade = totalTrades ? Math.round(totalValue / totalTrades) : 0;
    const winRate = totalTrades ? Math.round((buys / totalTrades) * 100) : 0;

    return NextResponse.json({
      range,
      label: rangeLabelMap[range] || 'selected range',
      buckets: bucketData,
      stats: {
        totalTrades,
        buys,
        sells,
        avgTrade,
        winRate,
      },
    });
  } catch (error) {
    console.error('Trade activity error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('[Trade] Incoming request to /api/trade');
    
    // Authenticate user
    const user = getUserFromRequest(request);
    console.log('[Trade] User authentication result:', user ? 'success' : 'failed');
    
    if (!user) {
      console.error('[Trade] Authentication failed - returning 401');
      return NextResponse.json(
        { error: 'Unauthorized - invalid or missing token' },
        { status: 401 }
      );
    }

    console.log('[Trade] User authenticated:', user.userId);

    // Parse request body
    const body: TradeRequest = await request.json();
    const { symbol, type, qty } = body;

    // Validation
    if (!symbol || !type || !qty || qty <= 0) {
      return NextResponse.json(
        { error: 'Invalid request: symbol, type (BUY/SELL), and qty required' },
        { status: 400 }
      );
    }

    if (!['BUY', 'SELL'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be BUY or SELL' },
        { status: 400 }
      );
    }

    // Get or create user account
    let account = await prisma.account.findFirst({
      where: { userId: user.userId },
    });

    if (!account) {
      // Create account with default balance of 100000
      account = await prisma.account.create({
        data: {
          userId: user.userId,
          balance: 100000,
        },
      });
    }

    // Get current price from Redis
    const priceStr = await redis.get(`price:${symbol}`);
    const price = priceStr ? parseFloat(priceStr) : null;

    if (!price) {
      return NextResponse.json(
        { error: `Price not available for ${symbol}` },
        { status: 400 }
      );
    }

    const totalCost = price * qty;

    if (type === 'BUY') {
      // Check balance
      if (account.balance < totalCost) {
        return NextResponse.json(
          { error: 'Insufficient balance' },
          { status: 400 }
        );
      }

      // Deduct balance
      await prisma.account.update({
        where: { id: account.id },
        data: { balance: account.balance - totalCost },
      });

      // Update or create holding
      const existingHolding = await prisma.holding.findFirst({
        where: { accountId: account.id, symbol },
      });

      if (existingHolding) {
        const newAvgPrice =
          (existingHolding.avgPrice * existingHolding.qty + price * qty) /
          (existingHolding.qty + qty);

        await prisma.holding.update({
          where: { id: existingHolding.id },
          data: {
            qty: existingHolding.qty + qty,
            avgPrice: newAvgPrice,
          },
        });
      } else {
        await prisma.holding.create({
          data: {
            accountId: account.id,
            symbol,
            qty,
            avgPrice: price,
          },
        });
      }
    } else {
      // SELL
      const holding = await prisma.holding.findFirst({
        where: { accountId: account.id, symbol },
      });

      if (!holding || holding.qty < qty) {
        return NextResponse.json(
          { error: 'Insufficient holdings' },
          { status: 400 }
        );
      }

      // Add balance
      await prisma.account.update({
        where: { id: account.id },
        data: { balance: account.balance + totalCost },
      });

      // Update holding
      if (holding.qty === qty) {
        await prisma.holding.delete({
          where: { id: holding.id },
        });
      } else {
        await prisma.holding.update({
          where: { id: holding.id },
          data: { qty: holding.qty - qty },
        });
      }
    }

    // Create order record
    const order = await prisma.order.create({
      data: {
        accountId: account.id,
        symbol,
        type,
        qty,
        price,
        status: 'FILLED',
      },
    });

    return NextResponse.json(
      {
        status: 'success',
        message: `${type} order executed successfully`,
        order: {
          id: order.id,
          symbol: order.symbol,
          type: order.type,
          qty: order.qty,
          price: order.price,
          totalValue: price * qty,
          status: order.status,
          createdAt: order.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Trade error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
