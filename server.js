const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { WebSocketServer } = require('ws');
const Redis = require('ioredis');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Redis client for getting prices
const redis = new Redis({
  host: 'localhost',
  port: 6379,
});

const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'TCS', 'INFY', 'RELIANCE', 'HDFCBANK'];

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    const parsedUrl = parse(req.url, true);
    await handle(req, res, parsedUrl);
  });

  // WebSocket Server
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws) => {
    console.log('✅ WebSocket client connected');

    // Broadcast price updates every 2 seconds from Redis
    const interval = setInterval(async () => {
      try {
        const prices = {};
        
        for (const symbol of symbols) {
          const price = await redis.get(`price:${symbol}`);
          if (price) {
            prices[symbol] = price;
          }
        }

        if (Object.keys(prices).length > 0) {
          const message = {
            type: 'price_update',
            data: prices,
            timestamp: new Date().toISOString()
          };
          
          if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify(message));
          }
        }
      } catch (err) {
        console.error('Error fetching prices from Redis:', err);
      }
    }, 2000);

    ws.on('close', () => {
      console.log('❌ WebSocket client disconnected');
      clearInterval(interval);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clearInterval(interval);
    });
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`🚀 Next.js ready on http://${hostname}:${port}`);
    console.log(`🔌 WebSocket ready on ws://${hostname}:${port}/ws`);
    console.log(`📊 Broadcasting prices from Redis every 2 seconds`);
  });
});
