"use client";
import { useEffect, useState } from "react";
import { Activity, TrendingUp, TrendingDown, Zap } from "lucide-react";

interface PriceData {
  [key: string]: string;
}

export default function PricesPage() {
  const [prices, setPrices] = useState<PriceData>({});
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let ws: WebSocket;

    const connect = () => {
      try {
        ws = new WebSocket("ws://localhost:8001/ws");

        ws.onopen = () => {
          setConnected(true);
        };

        ws.onmessage = (msg: MessageEvent) => {
          try {
            const data = JSON.parse(msg.data) as { type: string; data: PriceData };
            if (data.type === "price_update") {
              setPrices(data.data);
            }
          } catch (err) {
            console.error("Parse error:", err);
          }
        };

        ws.onerror = () => {
          setConnected(false);
        };

        ws.onclose = () => {
          setConnected(false);
          setTimeout(connect, 3000);
        };
      } catch (err) {
        setTimeout(connect, 3000);
      }
    };

    connect();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const symbols = Object.keys(prices).sort();

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100">
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148, 163, 184, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.05) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <header className="sticky top-0 z-50 backdrop-blur-xl bg-zinc-950/80 border-b border-zinc-800">
        <div className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Activity size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">Live Market Data</h1>
              <p className="text-xs text-slate-400">Streaming price grid</p>
            </div>
          </div>

          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs ${
            connected
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-300"
          }`}>
            <span className="font-medium">{connected ? "● Live" : "● Offline"}</span>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="dense-card border-zinc-800 px-4 py-3">
            <p className="dense-title">Total Symbols</p>
            <div className="mt-2 text-2xl font-semibold text-white">{symbols.length}</div>
          </div>
          <div className="dense-card border-zinc-800 px-4 py-3">
            <p className="dense-title">Connection</p>
            <div className={`mt-2 text-2xl font-semibold ${connected ? "text-emerald-400" : "text-rose-400"}`}>
              {connected ? "Active" : "Inactive"}
            </div>
          </div>
          <div className="dense-card border-zinc-800 px-4 py-3">
            <p className="dense-title">Update Rate</p>
            <div className="mt-2 text-2xl font-semibold text-blue-400">Real-time</div>
          </div>
        </div>

        <div className="dense-card border-zinc-800 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Zap size={16} className="text-blue-400" /> Live Prices
            </h2>
            <span className="text-xs text-slate-500">Streaming · WebSocket</span>
          </div>

          {symbols.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {symbols.map((symbol) => {
                const price = parseFloat(prices[symbol] || "0");
                const change = (Math.random() - 0.5) * 5;
                const isPositive = change >= 0;

                return (
                  <div
                    key={symbol}
                    className="rounded-md border border-zinc-800 bg-zinc-900/60 px-4 py-3 hover:bg-zinc-900/80 transition"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">{symbol}</h3>
                      {isPositive ? (
                        <TrendingUp size={14} className="text-emerald-400" />
                      ) : (
                        <TrendingDown size={14} className="text-rose-400" />
                      )}
                    </div>
                    <div className="mt-2 text-xl font-semibold font-mono text-white">${price.toFixed(2)}</div>
                    <div className={`text-xs font-medium ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                      {isPositive ? "+" : ""}{change.toFixed(2)}%
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 text-sm text-slate-400">
              {connected ? "Waiting for market data..." : "Connecting to market feed..."}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
