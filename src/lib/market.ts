import Redis from "ioredis";

const redis = new Redis();

const symbols = ["TCS", "INFY", "RELIANCE", "HDFCBANK"];

const prices: Record<string, number> = {
  TCS: 3500,
  INFY: 1600,
  RELIANCE: 2800,
  HDFCBANK: 1500
};

export function startMarketEngine() {
  setInterval(async () => {
    for (const sym of symbols) {
      const change = (Math.random() - 0.5) * 10;
      prices[sym] += change;
      await redis.set(`price:${sym}`, prices[sym].toFixed(2));
    }
  }, 1000); // every second
}