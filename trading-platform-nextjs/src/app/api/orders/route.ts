import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/orders
 * 
 * Retrieves order history with advanced filtering and pagination
 * 
 * Query Parameters:
 * - limit: Number of orders per page (default: 20, max: 100)
 * - offset: Number of orders to skip (default: 0)
 * - symbol: Filter by symbol (e.g., "TCS")
 * - type: Filter by order type ("BUY" or "SELL")
 * - status: Filter by status ("FILLED", "PENDING", "REJECTED", "CANCELLED")
 * - sortBy: Sort field ("createdAt" or "price") (default: "createdAt")
 * - sortOrder: Sort order ("asc" or "desc") (default: "desc")
 * 
 * Example:
 * GET /api/orders?symbol=TCS&type=BUY&limit=10&offset=0&sortOrder=desc
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
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const symbol = searchParams.get('symbol');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

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

    // Build filter conditions
    const where: any = { accountId: account.id };
    if (symbol) where.symbol = symbol;
    if (type) where.type = type;
    if (status) where.status = status;

    // Get total count for pagination
    const total = await prisma.order.count({ where });

    // Get orders with filtering and pagination
    const orders = await prisma.order.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      take: limit,
      skip: offset,
    });

    // Calculate statistics
    const buyOrders = await prisma.order.count({
      where: { ...where, type: 'BUY', status: 'FILLED' },
    });

    const sellOrders = await prisma.order.count({
      where: { ...where, type: 'SELL', status: 'FILLED' },
    });

    const totalSpentResult = await prisma.order.aggregate({
      where: { ...where, type: 'BUY', status: 'FILLED' },
      _sum: { price: true, qty: true },
    });

    const totalEarnedResult = await prisma.order.aggregate({
      where: { ...where, type: 'SELL', status: 'FILLED' },
      _sum: { price: true, qty: true },
    });

    const totalSpentValue = totalSpentResult._sum?.price && totalSpentResult._sum?.qty 
      ? totalSpentResult._sum.price * totalSpentResult._sum.qty 
      : 0;
    
    const totalEarnedValue = totalEarnedResult._sum?.price && totalEarnedResult._sum?.qty 
      ? totalEarnedResult._sum.price * totalEarnedResult._sum.qty 
      : 0;

    return NextResponse.json(
      {
        status: 'success',
        data: {
          orders: orders.map((order) => ({
            id: order.id,
            symbol: order.symbol,
            type: order.type,
            qty: order.qty,
            price: order.price,
            totalValue: order.price * order.qty,
            status: order.status,
            createdAt: order.createdAt,
          })),
          pagination: {
            total,
            limit,
            offset,
            hasMore: offset + limit < total,
          },
          statistics: {
            totalOrders: total,
            filledBuyOrders: buyOrders,
            filledSellOrders: sellOrders,
            totalSpent: parseFloat(totalSpentValue.toFixed(2)),
            totalEarned: parseFloat(totalEarnedValue.toFixed(2)),
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Orders error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
