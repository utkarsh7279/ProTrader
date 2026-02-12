"use client";

import { useState, useEffect } from "react";
import ConsoleShell from "@/components/console/ConsoleShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart2, TrendingUp, Clock, CheckCircle2, XCircle, RefreshCw } from "lucide-react";

interface Order {
  id: number;
  symbol: string;
  type: "BUY" | "SELL";
  qty: number;
  price: number;
  status: "PENDING" | "FILLED" | "REJECTED" | "CANCELLED";
  createdAt: string;
}

export default function ExecutionPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const params = filter !== "all" ? `?status=${filter}` : "";
      const response = await fetch(`/api/orders${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else {
        // Use mock data
        setOrders(mockOrders);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders(mockOrders);
    } finally {
      setLoading(false);
    }
  };

  const mockOrders: Order[] = [
    { id: 1, symbol: "AAPL", type: "BUY", qty: 50, price: 178.32, status: "FILLED", createdAt: new Date(Date.now() - 3600000).toISOString() },
    { id: 2, symbol: "GOOGL", type: "SELL", qty: 25, price: 142.15, status: "FILLED", createdAt: new Date(Date.now() - 7200000).toISOString() },
    { id: 3, symbol: "MSFT", type: "BUY", qty: 100, price: 420.50, status: "FILLED", createdAt: new Date(Date.now() - 10800000).toISOString() },
    { id: 4, symbol: "TSLA", type: "SELL", qty: 30, price: 245.75, status: "REJECTED", createdAt: new Date(Date.now() - 14400000).toISOString() },
    { id: 5, symbol: "NVDA", type: "BUY", qty: 75, price: 625.80, status: "FILLED", createdAt: new Date(Date.now() - 18000000).toISOString() },
  ];

  const displayOrders = orders.length > 0 ? orders : mockOrders;
  const filteredOrders = filter === "all" ? displayOrders : displayOrders.filter((order) => order.status === filter);

  // Calculate statistics
  const totalOrders = filteredOrders.length;
  const filledOrders = filteredOrders.filter(o => o.status === "FILLED").length;
  const rejectedOrders = filteredOrders.filter(o => o.status === "REJECTED").length;
  const fillRate = totalOrders > 0 ? ((filledOrders / totalOrders) * 100).toFixed(1) : "0";

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "FILLED":
        return <Badge variant="success">Filled</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>;
      case "CANCELLED":
        return <Badge variant="outline">Cancelled</Badge>;
      case "PENDING":
        return <Badge variant="warning">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC",
    }).format(date);
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "UTC",
    }).format(date);
  };

  return (
    <ConsoleShell>
      <div className="space-y-6 max-w-[1600px]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-100">Order Execution</h2>
            <p className="text-sm text-neutral-500 mt-1">View order history and execution statistics</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="FILLED">Filled Only</SelectItem>
                <SelectItem value="REJECTED">Rejected Only</SelectItem>
                <SelectItem value="PENDING">Pending Only</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchOrders} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Execution Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-neutral-950 border-neutral-800">
            <CardHeader className="pb-2">
              <CardDescription className="text-neutral-400 flex items-center gap-2">
                <BarChart2 className="w-4 h-4" />
                Total Orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{totalOrders}</div>
              <p className="text-xs text-neutral-500 mt-2">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card className="bg-neutral-950 border-neutral-800">
            <CardHeader className="pb-2">
              <CardDescription className="text-neutral-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Filled Orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-500">{filledOrders}</div>
              <p className="text-xs text-neutral-500 mt-2">Successfully executed</p>
            </CardContent>
          </Card>

          <Card className="bg-neutral-950 border-neutral-800">
            <CardHeader className="pb-2">
              <CardDescription className="text-neutral-400 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Rejected Orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">{rejectedOrders}</div>
              <p className="text-xs text-neutral-500 mt-2">Failed executions</p>
            </CardContent>
          </Card>

          <Card className="bg-neutral-950 border-neutral-800">
            <CardHeader className="pb-2">
              <CardDescription className="text-neutral-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Fill Rate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">{fillRate}%</div>
              <Badge variant={parseFloat(fillRate) > 90 ? "success" : "warning"} className="mt-2">
                {parseFloat(fillRate) > 90 ? "Excellent" : "Good"}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Order History Table */}
        <Card className="bg-neutral-950 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">Order History</CardTitle>
            <CardDescription>Complete execution log with timestamps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-800">
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Order ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Time</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Symbol</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Type</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-neutral-400">Qty</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-neutral-400">Price</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-neutral-400">Total</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-neutral-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-neutral-800/50 hover:bg-neutral-900/50 transition-colors">
                      <td className="py-3 px-4 text-neutral-400 font-mono text-sm">#{order.id.toString().padStart(6, '0')}</td>
                      <td className="py-3 px-4">
                        <div className="text-white text-sm">{formatTime(order.createdAt)}</div>
                        <div className="text-neutral-500 text-xs">{formatDate(order.createdAt)}</div>
                      </td>
                      <td className="py-3 px-4 text-white font-medium">{order.symbol}</td>
                      <td className="py-3 px-4">
                        <Badge variant={order.type === "BUY" ? "success" : "destructive"}>
                          {order.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right text-neutral-300">{order.qty}</td>
                      <td className="py-3 px-4 text-right text-neutral-300">
                        ${order.price.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right text-white font-medium">
                        ${(order.qty * order.price).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {getStatusBadge(order.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </ConsoleShell>
  );
}
