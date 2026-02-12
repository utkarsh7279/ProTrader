"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TradeDialog } from "@/components/ui/trade-dialog";
import { toast } from "sonner";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity,
  AlertTriangle,
  Shield,
  BarChart3,
  Zap
} from "lucide-react";

interface PriceData {
  [key: string]: string;
}

interface ApiHolding {
  symbol: string;
  qty: number;
  avgPrice: number;
}

interface ApiPortfolio {
  balance: number;
  holdings: ApiHolding[];
}

interface Portfolio {
  balance: number;
  holdings: Holding[];
  totalValue: number;
  totalPnL: number;
}

interface Holding {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
}

export default function TestDashboard() {
  const [mounted, setMounted] = useState(false);
  const [prices, setPrices] = useState<PriceData>({});
  const [tradeDialogOpen, setTradeDialogOpen] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");
  const [selectedType, setSelectedType] = useState<"BUY" | "SELL">("BUY");
  const [realPortfolio, setRealPortfolio] = useState<ApiPortfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchPortfolio();
  }, []);

  // Fetch real portfolio data
  const fetchPortfolio = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch("/api/portfolio", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRealPortfolio(data);
      }
    } catch (error) {
      console.error("Failed to fetch portfolio:", error);
    } finally {
      setLoading(false);
    }
  };

  // WebSocket connection for live prices
  useEffect(() => {
    if (!mounted) return;

    let ws: WebSocket;
    const connect = () => {
      try {
        ws = new WebSocket("ws://localhost:3000/ws");
        ws.onopen = () => {
          console.log("WebSocket connected");
        };
        ws.onmessage = (msg) => {
          try {
            const data = JSON.parse(msg.data);
            if (data.type === "price_update") {
              setPrices(data.data);
            }
          } catch (err) {
            console.error("Parse error:", err);
          }
        };
        ws.onerror = () => setTimeout(connect, 3000);
        ws.onclose = () => setTimeout(connect, 3000);
      } catch (err) {
        setTimeout(connect, 3000);
      }
    };
    connect();
    return () => ws?.close();
  }, [mounted]);

  // Mock portfolio data (fallback)
  const mockPortfolio: Portfolio = {
    balance: 50000,
    totalValue: 0,
    totalPnL: 0,
    holdings: [
      { symbol: "AAPL", quantity: 50, avgPrice: 170.00, currentPrice: parseFloat(prices["AAPL"] || "175.20") },
      { symbol: "GOOGL", quantity: 30, avgPrice: 138.50, currentPrice: parseFloat(prices["GOOGL"] || "140.15") },
      { symbol: "MSFT", quantity: 40, avgPrice: 365.00, currentPrice: parseFloat(prices["MSFT"] || "370.45") },
      { symbol: "TSLA", quantity: 25, avgPrice: 245.00, currentPrice: parseFloat(prices["TSLA"] || "242.30") },
    ]
  };

  // Use real portfolio if available, otherwise use mock
  const portfolio: Portfolio = realPortfolio ? {
    balance: realPortfolio.balance,
    totalValue: 0,
    totalPnL: 0,
    holdings: realPortfolio.holdings.map(h => ({
      symbol: h.symbol,
      quantity: h.qty,
      avgPrice: h.avgPrice,
      currentPrice: parseFloat(prices[h.symbol] || String(h.avgPrice))
    }))
  } : mockPortfolio;

  portfolio.totalValue = portfolio.holdings.reduce((sum, h) => sum + (h.currentPrice * h.quantity), 0);
  portfolio.totalPnL = portfolio.holdings.reduce((sum, h) => sum + ((h.currentPrice - h.avgPrice) * h.quantity), 0);

  const openTrade = (symbol: string, type: "BUY" | "SELL") => {
    setSelectedSymbol(symbol);
    setSelectedType(type);
    setTradeDialogOpen(true);
  };

  const handleTradeComplete = () => {
    setTradeDialogOpen(false);
    fetchPortfolio(); // Refresh portfolio after trade
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Trading Dashboard</h1>
            <p className="text-neutral-400 mt-1">Real-time portfolio monitoring</p>
          </div>
          <Button onClick={() => openTrade("AAPL", "BUY")} className="bg-blue-600 hover:bg-blue-700">
            <Zap className="w-4 h-4 mr-2" />
            New Trade
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-neutral-950 border-neutral-800">
            <CardHeader className="pb-2">
              <CardDescription className="text-neutral-400">Cash Balance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-white">
                    ${portfolio.balance.toLocaleString()}
                  </div>
                  <Badge variant="outline" className="mt-2">Available</Badge>
                </div>
                <DollarSign className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-950 border-neutral-800">
            <CardHeader className="pb-2">
              <CardDescription className="text-neutral-400">Total Value</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-white">
                    ${portfolio.totalValue.toLocaleString(undefined, {maximumFractionDigits: 0})}
                  </div>
                  <Badge variant="success" className="mt-2">
                    {portfolio.holdings.length} Holdings
                  </Badge>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-950 border-neutral-800">
            <CardHeader className="pb-2">
              <CardDescription className="text-neutral-400">Total P&L</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-2xl font-bold ${portfolio.totalPnL >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {portfolio.totalPnL >= 0 ? '+' : ''}${portfolio.totalPnL.toFixed(2)}
                  </div>
                  <Badge variant={portfolio.totalPnL >= 0 ? "success" : "destructive"} className="mt-2">
                    {((portfolio.totalPnL / portfolio.totalValue) * 100).toFixed(2)}%
                  </Badge>
                </div>
                <Activity className={`w-8 h-8 ${portfolio.totalPnL >= 0 ? 'text-emerald-500' : 'text-red-500'}`} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-950 border-neutral-800">
            <CardHeader className="pb-2">
              <CardDescription className="text-neutral-400">Risk Level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-white">Low</div>
                  <Badge variant="success" className="mt-2">24/100</Badge>
                </div>
                <Shield className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Holdings Table */}
        <Card className="bg-neutral-950 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">Your Holdings</CardTitle>
            <CardDescription>Current positions and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-800">
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Symbol</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-neutral-400">Qty</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-neutral-400">Avg Price</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-neutral-400">Current Price</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-neutral-400">P&L</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-neutral-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.holdings.map((holding) => {
                    const pnl = (holding.currentPrice - holding.avgPrice) * holding.quantity;
                    const pnlPercent = ((holding.currentPrice - holding.avgPrice) / holding.avgPrice) * 100;
                    
                    return (
                      <tr key={holding.symbol} className="border-b border-neutral-800/50 hover:bg-neutral-900/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{holding.symbol}</span>
                            <Badge variant={pnl >= 0 ? "success" : "destructive"} className="text-xs">
                              {pnlPercent >= 0 ? "+" : ""}{pnlPercent.toFixed(1)}%
                            </Badge>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right text-neutral-300">{holding.quantity}</td>
                        <td className="py-4 px-4 text-right text-neutral-400">${holding.avgPrice.toFixed(2)}</td>
                        <td className="py-4 px-4 text-right font-medium text-white">${holding.currentPrice.toFixed(2)}</td>
                        <td className={`py-4 px-4 text-right font-semibold ${pnl >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                          {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => openTrade(holding.symbol, "BUY")}
                              className="text-xs border-emerald-700 text-emerald-400 hover:bg-emerald-950"
                            >
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Buy
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => openTrade(holding.symbol, "SELL")}
                              className="text-xs border-red-700 text-red-400 hover:bg-red-950"
                            >
                              <TrendingDown className="w-3 h-3 mr-1" />
                              Sell
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Live Prices */}
        <Card className="bg-neutral-950 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">Live Market Prices</CardTitle>
            <CardDescription>Real-time price updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(prices).slice(0, 8).map(([symbol, price]) => (
                <div key={symbol} className="border border-neutral-800 bg-neutral-900 rounded-lg p-4">
                  <div className="text-sm text-neutral-400">{symbol}</div>
                  <div className="text-xl font-bold text-white mt-1">${parseFloat(price).toFixed(2)}</div>
                  <Button 
                    size="sm" 
                    className="w-full mt-3 bg-blue-600 hover:bg-blue-700"
                    onClick={() => openTrade(symbol, "BUY")}
                  >
                    Trade
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trade Dialog */}
      <TradeDialog
        open={tradeDialogOpen}
        onClose={handleTradeComplete}
        symbol={selectedSymbol}
        currentPrice={parseFloat(prices[selectedSymbol] || "0")}
        type={selectedType}
      />
    </div>
  );
}
