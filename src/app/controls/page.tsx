"use client";
import { useState, useEffect } from "react";
import ConsoleShell from "@/components/console/ConsoleShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Shield, AlertTriangle, Settings, Save, RefreshCw, Lock, Unlock } from "lucide-react";

// Default values
const DEFAULTS = {
  varLimit: "₹3,000",
  maxPosition: "₹5L",
  maxPortfolio: "30%",
  stopLossPercent: "-10%",
  autoReduce: false,
  circuitBreaker: true,
};

export default function ControlsPage() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState<string>("");
  
  // Risk limit states
  const [varLimit, setVarLimit] = useState(DEFAULTS.varLimit);
  const [maxPosition, setMaxPosition] = useState(DEFAULTS.maxPosition);
  const [maxPortfolio, setMaxPortfolio] = useState(DEFAULTS.maxPortfolio);
  const [stopLossPercent, setStopLossPercent] = useState(DEFAULTS.stopLossPercent);
  
  // Control switches
  const [autoReduce, setAutoReduce] = useState(DEFAULTS.autoReduce);
  const [circuitBreaker, setCircuitBreaker] = useState(DEFAULTS.circuitBreaker);

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("riskControls");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setVarLimit(parsed.varLimit ?? DEFAULTS.varLimit);
        setMaxPosition(parsed.maxPosition ?? DEFAULTS.maxPosition);
        setMaxPortfolio(parsed.maxPortfolio ?? DEFAULTS.maxPortfolio);
        setStopLossPercent(parsed.stopLossPercent ?? DEFAULTS.stopLossPercent);
        setAutoReduce(parsed.autoReduce ?? DEFAULTS.autoReduce);
        setCircuitBreaker(parsed.circuitBreaker ?? DEFAULTS.circuitBreaker);
      } catch (error) {
        console.error("Failed to load risk controls", error);
      }
    }
  }, []);

  const handleSave = () => {
    const controls = {
      varLimit,
      maxPosition,
      maxPortfolio,
      stopLossPercent,
      autoReduce,
      circuitBreaker,
    };
    localStorage.setItem("riskControls", JSON.stringify(controls));
    toast.success("Controls saved", {
      description: "Risk controls have been updated",
    });
  };

  const handleReset = () => {
    setVarLimit(DEFAULTS.varLimit);
    setMaxPosition(DEFAULTS.maxPosition);
    setMaxPortfolio(DEFAULTS.maxPortfolio);
    setStopLossPercent(DEFAULTS.stopLossPercent);
    setAutoReduce(DEFAULTS.autoReduce);
    setCircuitBreaker(DEFAULTS.circuitBreaker);
    localStorage.removeItem("riskControls");
    toast.success("Reset to defaults", {
      description: "All controls restored to default values",
    });
  };

  const confirmAction = () => {
    // Implementation would save to backend
    console.log("Saving controls:", { varLimit, maxPosition, maxPortfolio, stopLossPercent, autoReduce, circuitBreaker });
    setShowConfirmation(false);
    setPendingAction("");
  };

  return (
    <ConsoleShell>
      <div className="space-y-6 max-w-[1400px]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-100">Risk Controls</h2>
            <p className="text-sm text-neutral-500 mt-1">Configure position limits and risk parameters</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button onClick={handleSave} variant="success" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
        
        {/* Risk Limits */}
        <section className="border border-neutral-800 bg-neutral-950 rounded overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-800">
            <div className="text-xs text-neutral-500 uppercase tracking-wide">
              Risk Limits
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-neutral-500 uppercase tracking-wide block mb-2">
                    VaR Limit
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={varLimit}
                      onChange={(event) => setVarLimit(event.target.value)}
                      className="bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-neutral-100 w-32 focus:outline-none focus:border-neutral-600"
                    />
                    <span className="text-xs text-neutral-500">
                      Current: ₹2,450 (82%)
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-neutral-500 uppercase tracking-wide block mb-2">
                    Drawdown Threshold
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={stopLossPercent}
                      onChange={(event) => setStopLossPercent(event.target.value)}
                      className="bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-neutral-100 w-32 focus:outline-none focus:border-neutral-600"
                    />
                    <span className="text-xs text-neutral-500">
                      Current: -8.5% (85%)
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-neutral-500 uppercase tracking-wide block mb-2">
                    Sector Concentration Cap
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={maxPortfolio}
                      onChange={(event) => setMaxPortfolio(event.target.value)}
                      className="bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-neutral-100 w-32 focus:outline-none focus:border-neutral-600"
                    />
                    <span className="text-xs text-neutral-500">
                      Current: 24%
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-neutral-500 uppercase tracking-wide block mb-2">
                    Position Size Limit
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={maxPosition}
                      onChange={(event) => setMaxPosition(event.target.value)}
                      className="bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-neutral-100 w-32 focus:outline-none focus:border-neutral-600"
                    />
                    <span className="text-xs text-neutral-500">
                      Per instrument
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-neutral-800 flex justify-end">
              <button
                onClick={handleSave}
                className="bg-neutral-800 hover:bg-neutral-700 text-neutral-100 px-4 py-2 rounded text-sm transition-colors"
              >
                Update Limits
              </button>
            </div>
          </div>
        </section>

        {/* Exposure Caps */}
        <section className="border border-neutral-800 bg-neutral-950 rounded overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-800">
            <div className="text-xs text-neutral-500 uppercase tracking-wide">
              Exposure Caps
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="border border-neutral-800 rounded px-4 py-3">
                <div className="text-xs text-neutral-500 mb-2">
                  Total Gross Exposure
                </div>
                <div className="text-lg font-medium text-neutral-100">
                  ₹20 Cr
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  Current: ₹18.4 Cr (92%)
                </div>
              </div>
              <div className="border border-neutral-800 rounded px-4 py-3">
                <div className="text-xs text-neutral-500 mb-2">
                  Net Exposure Cap
                </div>
                <div className="text-lg font-medium text-neutral-100">
                  ₹10 Cr
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  Current: ₹7.2 Cr (72%)
                </div>
              </div>
              <div className="border border-neutral-800 rounded px-4 py-3">
                <div className="text-xs text-neutral-500 mb-2">
                  Leverage Limit
                </div>
                <div className="text-lg font-medium text-neutral-100">
                  3.0x
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  Current: 2.4x
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Alert Thresholds */}
        <section className="border border-neutral-800 bg-neutral-950 rounded overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-800">
            <div className="text-xs text-neutral-500 uppercase tracking-wide">
              Alert Thresholds
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-neutral-800/50">
                <span className="text-neutral-300">
                  VaR exceeds 80% of limit
                </span>
                <span className="text-neutral-500">Email + Dashboard</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-neutral-800/50">
                <span className="text-neutral-300">
                  Drawdown exceeds -8%
                </span>
                <span className="text-neutral-500">Email + SMS</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-neutral-800/50">
                <span className="text-neutral-300">
                  Single position exceeds ₹4L
                </span>
                <span className="text-neutral-500">Dashboard only</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-neutral-300">
                  Volatility spike detected
                </span>
                <span className="text-neutral-500">Email</span>
              </div>
            </div>
          </div>
        </section>

        {/* Auto-Mitigation Toggles */}
        <section className="border border-neutral-800 bg-neutral-950 rounded overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-800">
            <div className="text-xs text-neutral-500 uppercase tracking-wide">
              Auto-Mitigation
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-neutral-200">
                    Auto-reduce exposure on limit breach
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">
                    Automatically reduces positions when VaR exceeds 95%
                  </div>
                </div>
                <button 
                  onClick={() => setAutoReduce(!autoReduce)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    autoReduce ? 'bg-emerald-600' : 'bg-neutral-700'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-neutral-300 transition-transform ${
                    autoReduce ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-neutral-800/50">
                <div>
                  <div className="text-sm text-neutral-200">
                    Pause trading on circuit breaker
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">
                    Halts all new orders when drawdown exceeds threshold
                  </div>
                </div>
                <button 
                  onClick={() => setCircuitBreaker(!circuitBreaker)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    circuitBreaker ? 'bg-emerald-600' : 'bg-neutral-700'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-neutral-300 transition-transform ${
                    circuitBreaker ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded max-w-md w-full p-6">
            <div className="text-lg font-medium text-neutral-100 mb-2">
              Confirm Action
            </div>
            <div className="text-sm text-neutral-400 mb-6">
              {pendingAction} requires confirmation. This change will take effect immediately.
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-sm text-neutral-300 hover:text-neutral-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className="px-4 py-2 text-sm bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </ConsoleShell>
  );
}
