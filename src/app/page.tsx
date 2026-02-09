"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  CheckCircle,
  Gauge,
  Layers,
  Lock,
  RefreshCw,
  Settings,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

const spring = { type: "spring", stiffness: 120, damping: 18 } as const;

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = document.cookie.includes("userToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="w-full bg-background text-foreground">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, rgba(59, 130, 246, 0.16) 0%, transparent 45%), radial-gradient(circle at 80% 10%, rgba(99, 102, 241, 0.14) 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148, 163, 184, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.05) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.25'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs dense-title">ProTrader</p>
              <p className="text-sm text-slate-200">AI Risk Analytics</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <a className="hover:text-white transition" href="#features">Risk Engine</a>
            <a className="hover:text-white transition" href="#execution">Execution</a>
            <a className="hover:text-white transition" href="#security">Security</a>
            <a className="hover:text-white transition" href="#pricing">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Button onClick={() => router.push("/dashboard")} className="bg-blue-600 hover:bg-blue-700">
                Open Terminal
              </Button>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" className="border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900 text-slate-200">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-blue-600 hover:bg-blue-700">Start Free</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <section className="w-full py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center lg:justify-items-center">
          <motion.div className="text-center" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={spring}>
            <div className="inline-flex items-center gap-2 dense-card px-3 py-1.5 text-xs text-slate-300">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Live market risk monitoring · 200ms latency
            </div>
            <h1 className="mt-6 text-4xl lg:text-5xl font-semibold text-white leading-tight">
              AI Trading & Portfolio Risk Analytics
            </h1>
            <p className="mt-4 text-slate-300 text-lg leading-relaxed">
              Professional-grade risk intelligence for real-time portfolios. Optimize exposure, monitor drawdowns, and execute with institutional control.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/test">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="lg">🎯 Test Dashboard</Button>
              </Link>
              <Link href="/dashboard">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" size="lg">Launch Console</Button>
              </Link>
              <Link href="/components">
                <Button variant="outline" size="lg" className="border-zinc-700 bg-zinc-900/40 text-slate-200">View Components</Button>
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> SOC2 Ready</span>
              <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-blue-400" /> SEBI Compliant</span>
              <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-slate-300" /> JWT + RBAC</span>
            </div>
          </motion.div>

          <motion.div className="w-full max-w-xl mx-auto" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.1 }}>
            <Card className="dense-card border-zinc-800">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-white">Market Pulse</CardTitle>
                  <span className="text-xs text-emerald-400">● Live</span>
                </div>
                <CardDescription className="text-slate-400">Portfolio-wide risk snapshot</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "VaR (95%)", value: "$2.3M", trend: "+3.2%" },
                    { label: "Exposure", value: "$19.1M", trend: "-0.8%" },
                    { label: "PnL", value: "+$284K", trend: "+6.1%" },
                    { label: "Beta", value: "1.12", trend: "+0.03" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3">
                      <p className="text-xs text-slate-400 uppercase tracking-wider">{stat.label}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xl text-white font-semibold">{stat.value}</span>
                        <span className="text-xs text-emerald-400 flex items-center gap-1">
                          <ArrowUpRight className="w-3.5 h-3.5" /> {stat.trend}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/40">
                  <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between text-xs text-slate-400">
                    <span>Top Movers</span>
                    <span className="flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Volatility</span>
                  </div>
                  <div className="grid grid-cols-3 text-xs">
                    {[
                      { symbol: "NIFTY", price: "22,401", change: "+0.6%" },
                      { symbol: "BANK", price: "48,112", change: "-0.2%" },
                      { symbol: "RELIANCE", price: "2,861", change: "+1.3%" },
                    ].map((row) => (
                      <div key={row.symbol} className="px-4 py-3 border-r last:border-0 border-zinc-800">
                        <p className="text-slate-300 font-semibold">{row.symbol}</p>
                        <p className="text-slate-500">{row.price}</p>
                        <p className="text-emerald-400">{row.change}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="ticker">
        <div className="ticker-track text-xs text-slate-300">
          {[...Array(2)].flatMap(() => [
            { s: "AAPL", p: "189.42", c: "+0.41%" },
            { s: "TSLA", p: "245.31", c: "-0.18%" },
            { s: "INFY", p: "1,662.90", c: "+0.72%" },
            { s: "BTC", p: "64,201", c: "+1.6%" },
            { s: "ETH", p: "3,448", c: "+0.8%" },
            { s: "NIFTY", p: "22,401", c: "+0.6%" },
          ]).map((item, index) => (
            <div key={`${item.s}-${index}`} className="flex items-center gap-2">
              <span className="text-slate-500">{item.s}</span>
              <span className="text-slate-200 font-semibold">{item.p}</span>
              <span className="text-emerald-400">{item.c}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="w-full py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10 flex flex-col items-center text-center gap-4">
            <div>
              <p className="dense-title">Risk Engine</p>
              <h2 className="text-3xl font-semibold text-white mt-2">High-density analytics built for speed</h2>
              <p className="text-slate-400 mt-2 max-w-2xl mx-auto">
                From portfolio VaR to exposure across asset classes, every panel is designed for instant decision-making.
              </p>
            </div>
            <Link href="/analysis">
              <Button variant="outline" className="border-zinc-700 bg-zinc-900/40 text-slate-200">Explore Modules</Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: BarChart3, title: "Risk Aggregation", desc: "Real-time VaR, CVaR, and drawdown analytics across portfolios." },
              { icon: Gauge, title: "Stress Testing", desc: "Scenario simulation with macro shocks and liquidity constraints." },
              { icon: Layers, title: "Multi-Asset Coverage", desc: "Equities, futures, options, FX, and crypto with unified metrics." },
              { icon: RefreshCw, title: "Streaming Feeds", desc: "WebSocket price updates with sub-second refresh rates." },
              { icon: Settings, title: "Risk Controls", desc: "Custom limits, alerts, and auto-mitigations with audit trails." },
              { icon: Users, title: "Team Operations", desc: "Role-based access, approvals, and enterprise workflows." },
            ].map((item, index) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: index * 0.04 }} viewport={{ once: true }}>
                <Card className="dense-card border-zinc-800 h-full">
                  <CardHeader className="pb-2">
                    <item.icon className="w-6 h-6 text-blue-400" />
                    <CardTitle className="text-base text-white mt-3">{item.title}</CardTitle>
                    <CardDescription className="text-sm text-slate-400">{item.desc}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="execution" className="w-full py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10 items-center">
          <div className="text-center">
            <p className="dense-title">Execution Layer</p>
            <h3 className="text-3xl font-semibold text-white mt-2">Precision execution with guardrails</h3>
            <p className="text-slate-400 mt-3">
              Smart order routing, risk-aware fills, and execution analytics keep your desk compliant and efficient.
            </p>
            <div className="mt-6 space-y-3 text-sm text-slate-300">
              {[
                "Multi-venue smart routing with latency controls",
                "Risk-aware pre-trade checks and throttling",
                "Granular audit logs and regulatory reporting",
              ].map((item) => (
                <div key={item} className="flex items-start justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <Card className="dense-card border-zinc-800">
            <CardHeader>
              <CardTitle className="text-lg text-white">Order Controls</CardTitle>
              <CardDescription className="text-slate-400">Pre-trade validation & limit checks</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {[
                { label: "Max Order Size", value: "250,000" },
                { label: "Daily Loss Limit", value: "$1.2M" },
                { label: "Exposure Cap", value: "$25M" },
                { label: "Rejected Today", value: "14" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3">
                  <p className="text-xs text-slate-400 uppercase tracking-wider">{item.label}</p>
                  <p className="text-xl text-white font-semibold mt-2">{item.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="security" className="w-full py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-6">
          <Card className="dense-card border-zinc-800">
            <CardHeader>
              <Shield className="w-6 h-6 text-blue-400" />
              <CardTitle className="text-base text-white mt-3">Enterprise Security</CardTitle>
              <CardDescription className="text-sm text-slate-400">Encryption at rest & in transit, SOC2 aligned.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="dense-card border-zinc-800">
            <CardHeader>
              <Lock className="w-6 h-6 text-emerald-400" />
              <CardTitle className="text-base text-white mt-3">Compliance Ready</CardTitle>
              <CardDescription className="text-sm text-slate-400">RBAC, audit trails, SEBI reporting, and JWT policies.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="dense-card border-zinc-800">
            <CardHeader>
              <Zap className="w-6 h-6 text-indigo-400" />
              <CardTitle className="text-base text-white mt-3">Always On</CardTitle>
              <CardDescription className="text-sm text-slate-400">99.9% uptime with multi-region failover.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section id="pricing" className="w-full py-20 border-t border-border">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-semibold text-white">Deploy-ready in days, not months</h3>
          <p className="text-slate-400 mt-3">A complete stack for modern trading desks and fintech teams.</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link href={isLoggedIn ? "/dashboard" : "/signup"}>
              <Button className="bg-blue-600 hover:bg-blue-700" size="lg">Request Access</Button>
            </Link>
            <Link href="/api-docs">
              <Button variant="outline" size="lg" className="border-zinc-700 bg-zinc-900/40 text-slate-200">View API Docs</Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>© 2026 ProTrader AI Risk. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300">Status</a>
            <a href="#" className="hover:text-slate-300">Security</a>
            <a href="#" className="hover:text-slate-300">Terms</a>
            <a href="#" className="hover:text-slate-300">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
