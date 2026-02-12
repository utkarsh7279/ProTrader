import redis
import time
import random

# Connect to Redis
r = redis.Redis(host='localhost', port=6379, decode_responses=True)

symbols = ["AAPL", "GOOGL", "MSFT", "TSLA", "TCS", "INFY", "RELIANCE", "HDFCBANK"]

prices = {
    "AAPL": 150.00,
    "GOOGL": 140.00,
    "MSFT": 320.00,
    "TSLA": 180.00,
    "TCS": 3500,
    "INFY": 1600,
    "RELIANCE": 2800,
    "HDFCBANK": 1500
}

print("🚀 Starting market engine...")
print(f"📊 Tracking symbols: {', '.join(symbols)}")

while True:
    for sym in symbols:
        change = (random.random() - 0.5) * 10
        prices[sym] += change
        # Ensure price doesn't go below 50
        prices[sym] = max(prices[sym], 50)
        r.set(f"price:{sym}", f"{prices[sym]:.2f}")
    
    print(f"✅ Updated prices: {', '.join([f'{s}: ${p:.2f}' for s, p in prices.items()])}")
    time.sleep(2)
