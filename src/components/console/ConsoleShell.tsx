"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { QuickActions } from "@/components/ui/quick-actions";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Analysis", href: "/analysis" },
  { label: "Controls", href: "/controls" },
  { label: "Execution", href: "/execution" },
  { label: "Settings", href: "/settings" },
];

interface ConsoleShellProps {
  children: ReactNode;
}

export default function ConsoleShell({ children }: ConsoleShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState("");
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    const name = localStorage.getItem("userName") || "Operator";
    setUserName(name);
  }, []);

  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      try {
        ws = new WebSocket("ws://localhost:3000/ws");
        ws.onopen = () => setConnected(true);
        ws.onerror = () => setConnected(false);
        ws.onclose = () => {
          setConnected(false);
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

  const getCurrentWorkspace = () => {
    const item = navItems.find(item => pathname === item.href);
    return item ? item.label : "Dashboard";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100">
      {/* Top Bar - Context Layer */}
      <header className="sticky top-0 z-50 border-b border-neutral-800 bg-[#0a0a0a]/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 h-14">
          <div className="flex items-center gap-8">
            <h1 className="text-sm font-medium text-neutral-100">
              Portfolio Risk Monitoring Console
            </h1>
            <span className="text-sm text-neutral-500">
              {getCurrentWorkspace()}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <QuickActions />
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-500' : 'bg-neutral-600'}`} />
              <span className="text-xs text-neutral-400">
                {connected ? 'Live' : 'Updating'}
              </span>
            </div>
            <ThemeToggle />
            <span className="text-xs text-neutral-500">
              {userName}
            </span>
          </div>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-3.5rem)] grid-cols-[200px_1fr]">
        {/* Side Navigation - Intent Layer */}
        <aside className="border-r border-neutral-800 bg-[#0a0a0a]">
          <nav className="px-3 py-6 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 text-sm font-normal transition-colors rounded ${
                    isActive
                      ? "bg-neutral-800 text-neutral-100"
                      : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Workspace */}
        <main className="bg-[#0a0a0a] px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
