"use client";
import { useEffect, useState } from "react";
import ConsoleShell from "@/components/console/ConsoleShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TradeDialog } from "@/components/ui/trade-dialog";
import { RiskAlert } from "@/components/ui/risk-alert";
import { ExportPortfolio } from "@/components/export-portfolio";
import { toast } from "sonner";
import { TrendingUp, TrendingDown, Plus, Activity, ShieldAlert } from "lucide-react";

interface PriceData {
  [key: string]: string;
}

interface HoldingRow {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
}

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [prices, setPrices] = useState<PriceData>({});
  const [tradeDialogOpen, setTradeDialogOpen] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<string>("AAPL");
  const [selectedType, setSelectedType] = useState<"BUY" | "SELL">("BUY");
  const [riskAlertOpen, setRiskAlertOpen] = useState(false);
  const [riskScore, setRiskScore] = useState(24);
  const [realHoldings, setRealHoldings] = useState<HoldingRow[]>([]);
  const [balance, setBalance] = useState(0);
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
        setBalance(data.balance);
        setRealHoldings(data.holdings.map((h: any) => ({
          symbol: h.symbol,
          quantity: h.qty,
          avgPrice: h.avgPrice,
          currentPrice: parseFloat(prices[h.symbol] || String(h.avgPrice))
        })));
      }
    } catch (error) {
      console.error("Failed to fetch portfolio:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      try {
        ws = new WebSocket("ws://localhost:3000/ws");
        ws.onopen = () => {
          toast.success("Connected", {
            description: "Live market data streaming",
            icon: <Activity className="w-5 h-5" />,
          });
        };
        ws.onmessage = (msg: MessageEvent) => {
          try {
            const data = JSON.parse(msg.data);
            if (data.type === "price_update") {
              setPrices(data.data);
            }
          } catch (err) {
            console.error("Parse error:", err);
          }
        };
        ws.onerror = () => {};
        ws.onclose = () => {
          reconnectTimeout = setTimeout(connect, 3000);
        };
      } catch (err) {
        reconnectTimeout = setTimeout(connect, 3000);
      }
    };

    connect();
    return () => {
      if (ws) ws.close();
      clearTimeout(reconnectTimeout);
    };
  }, []);

  const openTradeDialog = (symbol: string, type: "BUY" | "SELL") => {
    setSelectedSymbol(symbol);
    setSelectedType(type);
    setTradeDialogOpen(true);
  };

  const handleTradeComplete = () => {
    setTradeDialogOpen(false);
    fetchPortfolio(); // Refresh after trade
  };

  // Mock holdings (fallback)
  const mockHoldings: HoldingRow[] = [
    { symbol: "AAPL", quantity: 120, avgPrice: 172.50, currentPrice: parseFloat(prices["AAPL"] || "175.20") },
    { symbol: "GOOGL", quantity: 85, avgPrice: 138.20, currentPrice: parseFloat(prices["GOOGL"] || "140.15") },
    { symbol: "MSFT", quantity: 95, avgPrice: 365.80, currentPrice: parseFloat(prices["MSFT"] || "370.45") },
    { symbol: "TSLA", quantity: 50, avgPrice: 245.00, currentPrice: parseFloat(prices["TSLA"] || "242.30") },
    { symbol: "TCS", quantity: 200, avgPrice: 3420.00, currentPrice: parseFloat(prices["TCS"] || "3445.50") },
    { symbol: "RELIANCE", quantity: 150, avgPrice: 2650.00, currentPrice: parseFloat(prices["RELIANCE"] || "2668.20") },
  ];

  // Use real holdings if available, otherwise use mock
  const holdings: HoldingRow[] = realHoldings.length > 0 ? realHoldings.map(h => ({
    ...h,
    currentPrice: parseFloat(prices[h.symbol] || String(h.avgPrice))
  })) : mockHoldings;

  const calculateUnrealizedPnL = (holding: HoldingRow) => {
    return (holding.currentPrice - holding.avgPrice) * holding.quantity;
  };

  const totalUnrealizedPnL = holdings.reduce((sum, h) => sum + calculateUnrealizedPnL(h), 0);
  const totalValue = holdings.reduce((sum, h) => sum + (h.currentPrice * h.quantity), 0);

  if (!mounted) return null;

  return (
    <ConsoleShell>
      <div className="space-y-8 max-w-[1400px]">
        
        {/* Quick Actions Bar */}
        <section className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-100">Portfolio Overview</h2>
            <p className="text-sm text-neutral-500 mt-1">Real-time positions and risk metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <ExportPortfolio />
            <Button 
              onClick={() => openTradeDialog("AAPL", "BUY")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Order
            </Button>
          </div>
        </section>
        
        {/* Layer 1: Risk Status Section */}
        <section className="border border-neutral-800 bg-neutral-950 rounded-lg overflow-hidden">
          <div className="px-6 py-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-medium text-neutral-100">
                    Low
                  </div>
                  <Badge variant="success">Healthy</Badge>
                </div>
                <div className="text-sm text-neutral-500 mt-1">
                  Risk score: {riskScore} / 100
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span className="text-xs text-neutral-400">Live monitoring</span>
              </div>
            </div>
            <div className="text-sm text-neutral-400">
              Unchanged over last 30 minutes · VaR trending stable
            </div>
            {riskScore > 75 && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => setRiskAlertOpen(true)}
                className="flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" />
                View Risk Alert
              </Button>
            )}
          </div>
        </section>

        {/* Layer 2: Core Risk Metrics */}
        <section className="grid grid-cols-3 gap-4">
          <div className="border border-neutral-800 bg-neutral-950 rounded px-5 py-4">
            <div className="text-xs text-neutral-500 uppercase tracking-wide">
              Value at Risk (95%)
            </div>
            <div className="text-xl font-medium text-neutral-100 mt-3">
              ₹2,450
            </div>
            <div className="text-xs text-neutral-600 mt-2">
              1-day holding period
            </div>
          </div>
          <div className="border border-neutral-800 bg-neutral-950 rounded px-5 py-4">
            <div className="text-xs text-neutral-500 uppercase tracking-wide">
              Maximum Drawdown
            </div>
            <div className="text-xl font-medium text-neutral-100 mt-3">
              -8.5%
            </div>
            <div className="text-xs text-neutral-600 mt-2">
              30-day trailing
            </div>
          </div>
          <div className="border border-neutral-800 bg-neutral-950 rounded px-5 py-4">
            <div className="text-xs text-neutral-500 uppercase tracking-wide">
              Total Exposure
            </div>
            <div className="text-xl font-medium text-neutral-100 mt-3">
              ₹{(totalValue / 100000).toFixed(2)}L
            </div>
            <div className="text-xs text-neutral-600 mt-2">
              Across {holdings.length} positions
            </div>
          </div>
        </section>

        {/* Layer 3: Holdings Table */}
        <section className="border border-neutral-800 bg-neutral-950 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
            <div className="text-xs text-neutral-500 uppercase tracking-wide">
              Holdings
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {holdings.length} Positions
              </Badge>
              <Badge variant={totalUnrealizedPnL >= 0 ? "success" : "destructive"} className="text-xs">
                {totalUnrealizedPnL >= 0 ? "+" : ""}₹{totalUnrealizedPnL.toFixed(2)} P&L
              </Badge>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="px-6 py-3 text-left text-xs font-normal text-neutral-500">
                    Symbol
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-normal text-neutral-500">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-normal text-neutral-500">
                    Avg Price
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-normal text-neutral-500">
                    Live Price
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-normal text-neutral-500">
                    Unrealized P&L
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-normal text-neutral-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((holding) => {
                  const pnl = calculateUnrealizedPnL(holding);
                  const pnlPercent = ((holding.currentPrice - holding.avgPrice) / holding.avgPrice) * 100;
                  return (
                    <tr 
                      key={holding.symbol} 
                      className="border-b border-neutral-800/50 hover:bg-neutral-900/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-neutral-100">{holding.symbol}</span>
                          <Badge variant={pnl >= 0 ? "success" : "destructive"} className="text-xs">
                            {pnlPercent >= 0 ? "+" : ""}{pnlPercent.toFixed(1)}%
                          </Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-400 text-right">
                        {holding.quantity}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-400 text-right">
                        ₹{holding.avgPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-300 text-right font-medium">
                        ₹{holding.currentPrice.toFixed(2)}
                      </td>
                      <td className={`px-6 py-4 text-sm text-right font-medium ${
                        pnl >= 0 ? 'text-emerald-500' : 'text-red-500'
                      }`}>
                        {pnl >= 0 ? '+' : ''}₹{pnl.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openTradeDialog(holding.symbol, "BUY")}
                            className="text-xs h-8 border-emerald-800 text-emerald-400 hover:bg-emerald-950 hover:text-emerald-300"
                          >
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Buy
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openTradeDialog(holding.symbol, "SELL")}
                            className="text-xs h-8 border-red-800 text-red-400 hover:bg-red-950 hover:text-red-300"
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
        </section>

      </div>

      {/* Dialogs */}
      <TradeDialog
        open={tradeDialogOpen}
        onClose={handleTradeComplete}
        symbol={selectedSymbol}
        currentPrice={parseFloat(prices[selectedSymbol] || "0")}
        type={selectedType}
      />

      <RiskAlert
        open={riskAlertOpen}
        onClose={() => setRiskAlertOpen(false)}
        riskScore={riskScore}
        details="Your portfolio shows high concentration risk. Consider diversifying across more symbols to reduce volatility exposure."
      />
    </ConsoleShell>
  );
}
