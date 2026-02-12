export async function GET() {
  return Response.json({
    status: "ok",
    message: "API is running",
    timestamp: new Date().toISOString(),
    documentation: "Visit http://localhost:3000/api-docs for interactive API documentation",
    endpoints: {
      system: {
        health: "GET /api",
        documentation: "GET /api-docs (Interactive Swagger UI)"
      },
      auth: {
        register: "POST /api/auth/register (body: { email, password, name })",
        login: "POST /api/auth/login (body: { email, password })",
        verify: "GET /api/auth/verify"
      },
      user: {
        me: "GET /api/me"
      },
      trading: {
        executeTrade: "POST /api/trade (body: { symbol, type: 'BUY'|'SELL', qty })",
        portfolio: "GET /api/portfolio",
        orders: "GET /api/orders (query: ?symbol=TCS&type=BUY&limit=20&offset=0)"
      },
      market: {
        prices: "GET /api/prices (query: ?symbol=TCS&interval=24&limit=100)"
      },
      analytics: {
        portfolio: "GET /api/analytics"
      }
    }
  });
}