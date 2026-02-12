"use client";

import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const [portfolio, setPortfolio] = useState<any>(null);
  const [risk, setRisk] = useState<any>(null);
  const [prices, setPrices] = useState<any>({});

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/portfolio", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setPortfolio);

    fetch("/api/risk", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setRisk);

    const ws = new WebSocket("ws://localhost:8001/ws");
    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.type === "price_update") setPrices(data.data);
    };
  }, []);

  if (!portfolio || !risk) return <div>Loading dashboard...</div>;

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Portfolio Analytics Dashboard</h1>

      {/* KPI CARDS */}
      <div className="grid grid-cols-3 gap-6">
        <KPI title="Balance" value={`₹${portfolio.balance.toFixed(2)}`} />
        <KPI title="Risk Score" value={risk.riskScore.toFixed(2)} />
        <KPI title="Holdings" value={portfolio.holdings.length} />
      </div>

      {/* RISK METRICS */}
      <div className="grid grid-cols-3 gap-6">
        <Metric title="VaR (95%)" value={risk.var95.toFixed(4)} />
        <Metric title="Volatility" value={risk.volatility.toFixed(4)} />
        <Metric title="Max Drawdown" value={risk.maxDrawdown.toFixed(4)} />
      </div>

      {/* HOLDINGS */}
      <HoldingsTable holdings={portfolio.holdings} prices={prices} />
    </div>
  );
}

function KPI({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h3 className="text-sm font-semibold text-gray-600">{title}</h3>
      <p className="text-3xl font-bold text-blue-600 mt-2">{value}</p>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      <p className="text-2xl font-bold text-purple-600 mt-2">{value}</p>
    </div>
  );
}

function HoldingsTable({ holdings, prices }: { holdings: any[]; prices: any }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Current Holdings</h2>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Symbol</th>
            <th className="text-right p-2">Quantity</th>
            <th className="text-right p-2">Avg Price</th>
            <th className="text-right p-2">Current Price</th>
            <th className="text-right p-2">P&L</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((h: any) => {
            const currentPrice = parseFloat(prices[h.symbol] || h.avgPrice);
            const pnl = ((currentPrice - h.avgPrice) / h.avgPrice * 100).toFixed(2);
            const pnlColor = parseFloat(pnl) >= 0 ? "text-green-600" : "text-red-600";
            
            return (
              <tr key={h.symbol} className="border-b hover:bg-gray-50">
                <td className="p-2 font-semibold">{h.symbol}</td>
                <td className="text-right p-2">{h.quantity}</td>
                <td className="text-right p-2">₹{h.avgPrice.toFixed(2)}</td>
                <td className="text-right p-2">₹{currentPrice.toFixed(2)}</td>
                <td className={`text-right p-2 font-bold ${pnlColor}`}>{pnl}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
