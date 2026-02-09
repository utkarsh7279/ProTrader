"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

interface TradeDialogProps {
  open: boolean;
  onClose: () => void;
  symbol?: string;
  currentPrice?: number;
  type?: "BUY" | "SELL";
}

const symbols = ["AAPL", "GOOGL", "MSFT", "TSLA", "TCS", "INFY", "RELIANCE", "HDFCBANK"];

export function TradeDialog({ open, onClose, symbol: initialSymbol, currentPrice, type: initialType }: TradeDialogProps) {
  const [symbol, setSymbol] = useState(initialSymbol || "AAPL");
  const [quantity, setQuantity] = useState("10");
  const [orderType, setOrderType] = useState<"BUY" | "SELL">(initialType || "BUY");
  const [priceType, setPriceType] = useState<"MARKET" | "LIMIT">("MARKET");
  const [limitPrice, setLimitPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const estimatedValue = parseFloat(quantity || "0") * (currentPrice || 0);

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      console.log('[TradeDialog] Token from localStorage:', token ? `${token.substring(0, 20)}...` : 'NULL');
      
      if (!token) {
        console.error('[TradeDialog] No token found - user not authenticated');
        toast.error("Authentication Required", {
          description: "Please log in to place orders",
          icon: <AlertCircle className="w-5 h-5" />,
        });
        setLoading(false);
        return;
      }
      
      console.log('[TradeDialog] Sending trade request with token');
      const response = await fetch("/api/trade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          symbol,
          type: orderType,
          qty: parseInt(quantity),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`${orderType} Order Placed`, {
          description: `${quantity} shares of ${symbol} at ${priceType === "MARKET" ? "market price" : `₹${limitPrice}`}`,
          icon: orderType === "BUY" ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />,
        });
        onClose();
        setQuantity("10");
        setLimitPrice("");
      } else {
        const errorMsg = data.error || "Failed to place order";
        toast.error("Order Failed", {
          description: errorMsg === "Unauthorized" ? "Session expired. Please log in again." : errorMsg,
          icon: <AlertCircle className="w-5 h-5" />,
        });
      }
    } catch (error) {
      toast.error("Network Error", {
        description: "Could not connect to server",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {orderType === "BUY" ? (
              <Badge variant="success" className="px-3 py-1">BUY</Badge>
            ) : (
              <Badge variant="destructive" className="px-3 py-1">SELL</Badge>
            )}
            <span>Place Order</span>
          </DialogTitle>
          <DialogDescription>
            Execute a trade with real-time risk validation
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Select value={symbol} onValueChange={setSymbol}>
                <SelectTrigger id="symbol">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {symbols.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={orderType} onValueChange={(v) => setOrderType(v as "BUY" | "SELL")}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BUY">Buy</SelectItem>
                  <SelectItem value="SELL">Sell</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="10"
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price-type">Order Type</Label>
              <Select value={priceType} onValueChange={(v) => setPriceType(v as "MARKET" | "LIMIT")}>
                <SelectTrigger id="price-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MARKET">Market</SelectItem>
                  <SelectItem value="LIMIT">Limit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {priceType === "LIMIT" && (
            <div className="space-y-2">
              <Label htmlFor="limit-price">Limit Price</Label>
              <Input
                id="limit-price"
                type="number"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                placeholder="0.00"
                step="0.01"
              />
            </div>
          )}

          <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">Current Price</span>
              <span className="text-neutral-100 font-medium">₹{currentPrice?.toFixed(2) || "0.00"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">Estimated Value</span>
              <span className="text-neutral-100 font-medium">₹{estimatedValue.toFixed(2)}</span>
            </div>
            {priceType === "LIMIT" && limitPrice && (
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Total at Limit</span>
                <span className="text-neutral-100 font-medium">
                  ₹{(parseFloat(quantity || "0") * parseFloat(limitPrice)).toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !quantity || (priceType === "LIMIT" && !limitPrice)}
            className={orderType === "BUY" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"}
          >
            {loading ? "Placing..." : `${orderType} ${quantity || 0} Shares`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
