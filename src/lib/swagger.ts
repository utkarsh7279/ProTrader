/**
 * OpenAPI/Swagger Documentation for Trading Platform API
 * 
 * This file defines the complete API specification in OpenAPI 3.0 format
 * Access at: http://localhost:3000/api-docs
 */

export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Zerodha Risk Platform API',
    version: '1.0.0',
    description: 'Complete trading platform API with real-time prices, portfolio management, and analytics',
    contact: {
      name: 'Trading Platform Support',
      url: 'http://localhost:3000',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string', format: 'email' },
          name: { type: 'string' },
          role: { type: 'string', enum: ['USER', 'ADMIN'] },
        },
      },
      Order: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          symbol: { type: 'string', example: 'TCS' },
          type: { type: 'string', enum: ['BUY', 'SELL'] },
          qty: { type: 'number' },
          price: { type: 'number' },
          totalValue: { type: 'number' },
          status: { type: 'string', enum: ['FILLED', 'PENDING', 'REJECTED', 'CANCELLED'] },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Holding: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          symbol: { type: 'string' },
          qty: { type: 'number' },
          avgPrice: { type: 'number' },
          currentPrice: { type: 'number' },
          currentValue: { type: 'number' },
          gainLoss: { type: 'number' },
          gainLossPercent: { type: 'number' },
        },
      },
      Portfolio: {
        type: 'object',
        properties: {
          balance: { type: 'number' },
          holdings: { type: 'array', items: { $ref: '#/components/schemas/Holding' } },
          summary: {
            type: 'object',
            properties: {
              totalInvested: { type: 'number' },
              totalCurrentValue: { type: 'number' },
              totalGainLoss: { type: 'number' },
              totalGainLossPercent: { type: 'number' },
              totalPortfolioValue: { type: 'number' },
            },
          },
          recentOrders: { type: 'array', items: { $ref: '#/components/schemas/Order' } },
        },
      },
    },
  },
  paths: {
    '/api': {
      get: {
        tags: ['System'],
        summary: 'API Health Check',
        description: 'Check if API is running and get available endpoints',
        responses: {
          '200': {
            description: 'API is running',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    message: { type: 'string' },
                    endpoints: { type: 'object' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register New User',
        description: 'Create a new user account and receive JWT token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'name'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 6 },
                  name: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: { type: 'string' },
                    user: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          '400': { description: 'Invalid input' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Login User',
        description: 'Authenticate user and receive JWT token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login successful',
          },
          '401': { description: 'Invalid credentials' },
        },
      },
    },
    '/api/trade': {
      post: {
        tags: ['Trading'],
        summary: 'Execute Trade',
        description: 'Execute BUY or SELL order for a stock symbol',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['symbol', 'type', 'qty'],
                properties: {
                  symbol: { type: 'string', example: 'TCS' },
                  type: { type: 'string', enum: ['BUY', 'SELL'] },
                  qty: { type: 'number', minimum: 1 },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Trade executed successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    message: { type: 'string' },
                    order: { $ref: '#/components/schemas/Order' },
                  },
                },
              },
            },
          },
          '400': { description: 'Invalid trade parameters' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/api/portfolio': {
      get: {
        tags: ['Portfolio'],
        summary: 'Get Portfolio',
        description: 'Retrieve complete portfolio with holdings and balance',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Portfolio retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    portfolio: { $ref: '#/components/schemas/Portfolio' },
                  },
                },
              },
            },
          },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/api/orders': {
      get: {
        tags: ['Orders'],
        summary: 'Get Order History',
        description: 'Retrieve order history with advanced filtering and pagination',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'symbol',
            in: 'query',
            description: 'Filter by stock symbol',
            schema: { type: 'string' },
          },
          {
            name: 'type',
            in: 'query',
            description: 'Filter by order type',
            schema: { type: 'string', enum: ['BUY', 'SELL'] },
          },
          {
            name: 'status',
            in: 'query',
            description: 'Filter by status',
            schema: { type: 'string', enum: ['FILLED', 'PENDING', 'REJECTED', 'CANCELLED'] },
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Number of records per page',
            schema: { type: 'integer', default: 20 },
          },
          {
            name: 'offset',
            in: 'query',
            description: 'Number of records to skip',
            schema: { type: 'integer', default: 0 },
          },
        ],
        responses: {
          '200': { description: 'Orders retrieved successfully' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/api/prices': {
      get: {
        tags: ['Market Data'],
        summary: 'Get Price History',
        description: 'Retrieve historical price data for charting',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'symbol',
            in: 'query',
            description: 'Stock symbol (required)',
            required: true,
            schema: { type: 'string' },
          },
          {
            name: 'interval',
            in: 'query',
            description: 'Time interval in hours',
            schema: { type: 'integer', default: 24 },
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Maximum data points',
            schema: { type: 'integer', default: 100 },
          },
        ],
        responses: {
          '200': { description: 'Price history retrieved successfully' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/api/analytics': {
      get: {
        tags: ['Analytics'],
        summary: 'Get Portfolio Analytics',
        description: 'Retrieve comprehensive portfolio performance metrics',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Analytics retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    analytics: {
                      type: 'object',
                      properties: {
                        performance: {
                          type: 'object',
                          properties: {
                            totalReturn: { type: 'number' },
                            returnPercentage: { type: 'number' },
                            realizedPnL: { type: 'number' },
                            unrealizedPnL: { type: 'number' },
                          },
                        },
                        trading: {
                          type: 'object',
                          properties: {
                            totalTrades: { type: 'integer' },
                            buyTrades: { type: 'integer' },
                            sellTrades: { type: 'integer' },
                            winRate: { type: 'number' },
                          },
                        },
                        riskMetrics: {
                          type: 'object',
                          properties: {
                            volatility: { type: 'number' },
                            sharpeRatio: { type: 'number' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          '401': { description: 'Unauthorized' },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
};
