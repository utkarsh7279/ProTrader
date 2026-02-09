"use client";

import { useState, useEffect } from "react";
import ConsoleShell from "@/components/console/ConsoleShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  BarChart, 
  Bar,
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Activity, RefreshCw } from "lucide-react";

interface PortfolioData {
  balance: number;
  holdings: Array<{
    symbol: string;
    qty: number;
    avgPrice: number;
  }>;
}

type TabType = "performance" | "risk" | "allocation" | "activity";

const tabs = [
  { id: "performance" as TabType, label: "Performance" },
  { id: "risk" as TabType, label: "Risk Analysis" },
  { id: "allocation" as TabType, label: "Allocation" },
  { id: "activity" as TabType, label: "Trading Activity" },
];

interface ActivityBucket {
  label: string;
  buys: number;
  sells: number;
}

interface ActivityStats {
  totalTrades: number;
  buys: number;
  sells: number;
  avgTrade: number;
  winRate: number;
}

export default function AnalysisPage() {
  const [activeTab, setActiveTab] = useState<TabType>("performance");
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [timeRange, setTimeRange] = useState("7d");
  const [activityRange, setActivityRange] = useState("7d");
  const [activityBuckets, setActivityBuckets] = useState<ActivityBucket[]>([]);
  const [activityStats, setActivityStats] = useState<ActivityStats>({
    totalTrades: 0,
    buys: 0,
    sells: 0,
    avgTrade: 0,
    winRate: 0,
  });
  const [activityLabel, setActivityLabel] = useState("selected range");
  const [activityRefreshing, setActivityRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch("/api/portfolio", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setPortfolio(data);
      }
    } catch (error) {
      console.error("Failed to fetch portfolio:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mock historical performance data
  const performanceData = [
    { date: "Jan 01", value: 95000, pnl: -5000 },
    { date: "Jan 08", value: 98000, pnl: -2000 },
    { date: "Jan 15", value: 102000, pnl: 2000 },
    { date: "Jan 22", value: 105000, pnl: 5000 },
    { date: "Jan 29", value: 108000, pnl: 8000 },
    { date: "Feb 05", value: 112000, pnl: 12000 },
    { date: "Today", value: 115000, pnl: 15000 },
  ];

  // Asset allocation data
  const allocationData = portfolio?.holdings.map(h => ({
    name: h.symbol,
    value: h.qty * h.avgPrice,
    qty: h.qty
  })) || [
    { name: "AAPL", value: 25000, qty: 120 },
    { name: "GOOGL", value: 18000, qty: 85 },
    { name: "MSFT", value: 22000, qty: 95 },
    { name: "TSLA", value: 15000, qty: 50 },
  ];

  // P&L by symbol
  const symbolPnLData = allocationData.map((item, idx) => ({
    symbol: item.name,
    pnl: [1200, -450, 890, 320][idx % 4],
    return: [7.2, -2.1, 4.5, 2.8][idx % 4]
  }));

  // Trading activity data
  const activityRangeLabel = {
    "7d": "last 7 days",
    "30d": "last 30 days",
    "90d": "last 90 days",
    "1y": "last year",
  }[activityRange] || "selected range";

  const fetchActivity = async (range: string) => {
    setActivityRefreshing(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setActivityRefreshing(false);
        return;
      }

      const response = await fetch(`/api/trade?range=${range}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to load trading activity");
      }

      const data = await response.json();
      setActivityBuckets(data.buckets || []);
      setActivityStats(data.stats || {
        totalTrades: 0,
        buys: 0,
        sells: 0,
        avgTrade: 0,
        winRate: 0,
      });
      setActivityLabel(data.label || activityRangeLabel);
    } catch (error) {
      toast.error("Activity refresh failed", {
        description: error instanceof Error ? error.message : "Unable to load activity",
      });
    } finally {
      setActivityRefreshing(false);
    }
  };

  const handleActivityRefresh = () => {
    fetchActivity(activityRange).then(() => {
      toast.success("Activity refreshed", {
        description: "Latest activity metrics loaded",
      });
    });
  };

  useEffect(() => {
    fetchActivity(activityRange);
  }, [activityRange]);

  const volumeData = activityBuckets;
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

  const totalValue = allocationData.reduce((sum, item) => sum + item.value, 0);
  const totalPnL = symbolPnLData.reduce((sum, item) => sum + item.pnl, 0);
  const avgReturn = symbolPnLData.reduce((sum, item) => sum + item.return, 0) / symbolPnLData.length;

  return (
    <ConsoleShell>
      <div className="space-y-6 max-w-[1600px]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-100">Portfolio Analysis</h2>
            <p className="text-sm text-neutral-500 mt-1">Comprehensive performance metrics and insights</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchPortfolio} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-neutral-800">
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-b-2 border-neutral-100 text-neutral-100"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Performance Tab */}
        {activeTab === "performance" && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-neutral-950 border-neutral-800">
                <CardHeader className="pb-2">
                  <CardDescription className="text-neutral-400">Total Value</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    ${totalValue.toLocaleString()}
                  </div>
                  <Badge variant="success" className="mt-2">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12.5% All Time
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-neutral-950 border-neutral-800">
                <CardHeader className="pb-2">
                  <CardDescription className="text-neutral-400">Total P&L</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
                  </div>
                  <Badge variant={totalPnL >= 0 ? "success" : "destructive"} className="mt-2">
                    {avgReturn >= 0 ? '+' : ''}{avgReturn.toFixed(2)}% Avg Return
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-neutral-950 border-neutral-800">
                <CardHeader className="pb-2">
                  <CardDescription className="text-neutral-400">Positions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {allocationData.length}
                  </div>
                  <Badge variant="outline" className="mt-2">
                    {allocationData.filter((_, i) => symbolPnLData[i]?.pnl > 0).length} Profitable
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-neutral-950 border-neutral-800">
                <CardHeader className="pb-2">
                  <CardDescription className="text-neutral-400">Sharpe Ratio</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    1.82
                  </div>
                  <Badge variant="success" className="mt-2">
                    Good Risk-Adjusted
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Portfolio Value Over Time */}
              <Card className="bg-neutral-950 border-neutral-800">
                <CardHeader>
                  <CardTitle className="text-white">Portfolio Value</CardTitle>
                  <CardDescription>Historical performance over {timeRange}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                      <XAxis dataKey="date" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#3b82f6" 
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* P&L by Symbol */}
              <Card className="bg-neutral-950 border-neutral-800">
                <CardHeader>
                  <CardTitle className="text-white">P&L by Symbol</CardTitle>
                  <CardDescription>Profit/Loss per position</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={symbolPnLData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                      <XAxis dataKey="symbol" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}
                      />
                      <Bar dataKey="pnl" fill="#3b82f6">
                        {symbolPnLData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? '#10b981' : '#ef4444'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Performance Table */}
            <Card className="bg-neutral-950 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-white">Performance Breakdown</CardTitle>
                <CardDescription>Detailed metrics per symbol</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-800">
                        <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Symbol</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-neutral-400">Value</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-neutral-400">P&L</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-neutral-400">Return %</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-neutral-400">Allocation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allocationData.map((item, idx) => {
                        const pnl = symbolPnLData[idx]?.pnl || 0;
                        const returnPct = symbolPnLData[idx]?.return || 0;
                        const allocation = (item.value / totalValue) * 100;

                        return (
                          <tr key={item.name} className="border-b border-neutral-800/50 hover:bg-neutral-900/50 transition-colors">
                            <td className="py-3 px-4 text-white font-medium">{item.name}</td>
                            <td className="py-3 px-4 text-right text-neutral-300">
                              ${item.value.toLocaleString()}
                            </td>
                            <td className={`py-3 px-4 text-right font-medium ${pnl >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                              {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                            </td>
                            <td className={`py-3 px-4 text-right ${returnPct >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                              {returnPct >= 0 ? '+' : ''}{returnPct.toFixed(2)}%
                            </td>
                            <td className="py-3 px-4 text-right text-neutral-400">
                              {allocation.toFixed(1)}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Risk Analysis Tab */}
        {activeTab === "risk" && (
          <div className="space-y-6">
            <section className="border border-neutral-800 bg-neutral-950 rounded px-6 py-5">
              <div className="text-sm text-neutral-500 mb-1">
                Current Risk Posture
              </div>
              <div className="text-xl font-medium text-neutral-100">
                Portfolio risk remains within acceptable bounds
              </div>
              <div className="text-sm text-neutral-400 mt-3">
                VaR has decreased 3.2% over the last 6 hours. Volatility stable. No threshold breaches detected.
              </div>
            </section>

            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-neutral-950 border-neutral-800">
                <CardHeader className="pb-2">
                  <CardDescription>Value at Risk (95%)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-neutral-100">$2,450</div>
                  <Badge variant="success" className="mt-2">-3.2% today</Badge>
                </CardContent>
              </Card>

              <Card className="bg-neutral-950 border-neutral-800">
                <CardHeader className="pb-2">
                  <CardDescription>Portfolio Beta</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-neutral-100">1.15</div>
                  <Badge variant="outline" className="mt-2">Moderate volatility</Badge>
                </CardContent>
              </Card>

              <Card className="bg-neutral-950 border-neutral-800">
                <CardHeader className="pb-2">
                  <CardDescription>Max Drawdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">-8.2%</div>
                  <Badge variant="warning" className="mt-2">Last 30 days</Badge>
                </CardContent>
              </Card>
            </div>

            <div className="border border-neutral-800 bg-neutral-950 rounded overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-800">
                <h3 className="text-white font-medium">Stress Scenarios</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-800">
                    <th className="px-6 py-3 text-left text-xs font-normal text-neutral-500">
                      Scenario
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-normal text-neutral-500">
                      Probability
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-normal text-neutral-500">
                      Projected Impact
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-normal text-neutral-500">
                      Post-Stress VaR
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-neutral-800/50">
                    <td className="px-6 py-3 text-sm text-neutral-200">
                      Interest Rate +100 bps
                    </td>
                    <td className="px-6 py-3 text-sm text-neutral-400 text-right">
                      15%
                    </td>
                    <td className="px-6 py-3 text-sm text-red-500 text-right">
                      -2.3%
                    </td>
                    <td className="px-6 py-3 text-sm text-neutral-300 text-right">
                      $2,506
                    </td>
                  </tr>
                  <tr className="border-b border-neutral-800/50">
                    <td className="px-6 py-3 text-sm text-neutral-200">
                      Equity Market -5%
                    </td>
                    <td className="px-6 py-3 text-sm text-neutral-400 text-right">
                      20%
                    </td>
                    <td className="px-6 py-3 text-sm text-red-500 text-right">
                      -1.4%
                    </td>
                    <td className="px-6 py-3 text-sm text-neutral-300 text-right">
                      $2,484
                    </td>
                  </tr>
                  <tr className="border-b border-neutral-800/50">
                    <td className="px-6 py-3 text-sm text-neutral-200">
                      Volatility Surge +20%
                    </td>
                    <td className="px-6 py-3 text-sm text-neutral-400 text-right">
                      8%
                    </td>
                    <td className="px-6 py-3 text-sm text-red-500 text-right">
                      -1.9%
                    </td>
                    <td className="px-6 py-3 text-sm text-neutral-300 text-right">
                      $2,497
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Allocation Tab */}
        {activeTab === "allocation" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Asset Allocation Pie Chart */}
              <Card className="bg-neutral-950 border-neutral-800">
                <CardHeader>
                  <CardTitle className="text-white">Asset Allocation</CardTitle>
                  <CardDescription>Distribution by holdings value</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Attribution Breakdown */}
              <Card className="bg-neutral-950 border-neutral-800">
                <CardHeader>
                  <CardTitle className="text-white">Risk Attribution</CardTitle>
                  <CardDescription>By asset class and factor</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="text-xs text-neutral-500 uppercase tracking-wide mb-4">
                      By Asset Class
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-neutral-300">Equities</span>
                        <span className="text-sm font-medium text-neutral-100">42%</span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600" style={{ width: "42%" }} />
                      </div>
                    </div>
                    <div className="space-y-3 mt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-neutral-300">Fixed Income</span>
                        <span className="text-sm font-medium text-neutral-100">33%</span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-600" style={{ width: "33%" }} />
                      </div>
                    </div>
                    <div className="space-y-3 mt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-neutral-300">Other</span>
                        <span className="text-sm font-medium text-neutral-100">25%</span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-600" style={{ width: "25%" }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === "activity" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-neutral-100">Trading Activity</h3>
                <p className="text-sm text-neutral-500">Review orders by time range</p>
              </div>
              <div className="flex items-center gap-3">
                <Select value={activityRange} onValueChange={setActivityRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7 Days</SelectItem>
                    <SelectItem value="30d">30 Days</SelectItem>
                    <SelectItem value="90d">90 Days</SelectItem>
                    <SelectItem value="1y">1 Year</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleActivityRefresh} variant="outline" size="sm" disabled={activityRefreshing}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${activityRefreshing ? "animate-spin" : ""}`} />
                  {activityRefreshing ? "Refreshing" : "Refresh"}
                </Button>
              </div>
            </div>

            <Card className="bg-neutral-950 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-white">Trading Activity</CardTitle>
                <CardDescription>Buy vs Sell orders for {activityLabel}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={volumeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                    <XAxis dataKey="label" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}
                    />
                    <Legend />
                    <Bar dataKey="buys" fill="#10b981" name="Buy Orders" />
                    <Bar dataKey="sells" fill="#ef4444" name="Sell Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-neutral-950 border-neutral-800">
                <CardHeader className="pb-2">
                  <CardDescription>Total Trades ({activityRange})</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-neutral-100">{activityStats.totalTrades}</div>
                  <p className="text-xs text-neutral-500 mt-2">
                    {activityStats.buys} buys, {activityStats.sells} sells
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-neutral-950 border-neutral-800">
                <CardHeader className="pb-2">
                  <CardDescription>Avg Trade Size</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-neutral-100">${activityStats.avgTrade.toLocaleString()}</div>
                  <Badge variant="outline" className="mt-2">Based on {activityLabel}</Badge>
                </CardContent>
              </Card>

              <Card className="bg-neutral-950 border-neutral-800">
                <CardHeader className="pb-2">
                  <CardDescription>Buy Ratio</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-500">{activityStats.winRate}%</div>
                  <Badge variant="success" className="mt-2">Based on {activityLabel}</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

      </div>
    </ConsoleShell>
  );
}
