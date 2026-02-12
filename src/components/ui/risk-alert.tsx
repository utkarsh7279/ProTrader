"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

interface RiskAlertProps {
  open: boolean;
  onClose: () => void;
  riskScore: number;
  details: string;
}

export function RiskAlert({ open, onClose, riskScore, details }: RiskAlertProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-red-600/20">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <AlertDialogTitle className="text-xl">High Risk Alert</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base pt-2">
            Your portfolio risk score is <span className="font-semibold text-red-500">{riskScore}%</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4 space-y-3">
          <div className="rounded-lg border border-red-900/50 bg-red-950/30 p-4">
            <p className="text-sm text-neutral-300">{details}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-neutral-100">Recommended Actions:</p>
            <ul className="list-disc list-inside text-sm text-neutral-400 space-y-1">
              <li>Consider diversifying your portfolio across more symbols</li>
              <li>Reduce concentration in high-risk positions</li>
              <li>Review your position sizing strategy</li>
              <li>Monitor volatility metrics closely</li>
            </ul>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Acknowledge</AlertDialogCancel>
          <AlertDialogAction className="bg-blue-600 hover:bg-blue-700">
            View Risk Analysis
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
