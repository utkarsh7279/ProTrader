"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Zap, 
  TrendingUp, 
  Shield, 
  BarChart3, 
  Settings, 
  Bell,
  Clock,
  Target
} from "lucide-react";
import { toast } from "sonner";

export function QuickActions() {
  const handleAction = (title: string) => {
    toast.success("Action queued", {
      description: title,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Zap className="w-4 h-4" />
          Quick Actions
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-500" />
            Quick Actions
          </DialogTitle>
          <DialogDescription>
            Common trading and portfolio management shortcuts
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-3 py-4">
          <ActionCard
            icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
            title="Market Order"
            description="Execute at current price"
            badge="Fast"
            onClick={() => handleAction("Market Order")}
          />
          <ActionCard
            icon={<Target className="w-5 h-5 text-blue-500" />}
            title="Limit Order"
            description="Set your target price"
            badge="Precise"
            onClick={() => handleAction("Limit Order")}
          />
          <ActionCard
            icon={<Shield className="w-5 h-5 text-yellow-500" />}
            title="Stop Loss"
            description="Protect your positions"
            badge="Safety"
            onClick={() => handleAction("Stop Loss")}
          />
          <ActionCard
            icon={<BarChart3 className="w-5 h-5 text-purple-500" />}
            title="Portfolio Rebalance"
            description="Optimize allocation"
            badge="Pro"
            onClick={() => handleAction("Portfolio Rebalance")}
          />
          <ActionCard
            icon={<Bell className="w-5 h-5 text-red-500" />}
            title="Price Alerts"
            description="Get notified on changes"
            badge="Alert"
            onClick={() => handleAction("Price Alerts")}
          />
          <ActionCard
            icon={<Clock className="w-5 h-5 text-indigo-500" />}
            title="Scheduled Orders"
            description="Set and forget trades"
            badge="Auto"
            onClick={() => handleAction("Scheduled Orders")}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge: string;
  onClick?: () => void;
}

function ActionCard({ icon, title, description, badge, onClick }: ActionCardProps) {
  return (
    <button
      className="text-left border border-neutral-800 bg-neutral-950 rounded-lg p-4 hover:bg-neutral-900 transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
      onClick={onClick}
      type="button"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="p-2 rounded-md bg-neutral-900">
          {icon}
        </div>
        <Badge variant="outline" className="text-xs">
          {badge}
        </Badge>
      </div>
      <h3 className="font-medium text-sm text-neutral-100 mb-1">{title}</h3>
      <p className="text-xs text-neutral-500">{description}</p>
    </button>
  );
}
