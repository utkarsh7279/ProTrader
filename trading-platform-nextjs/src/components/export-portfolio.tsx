"use client";

import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface PortfolioData {
  balance: number;
  holdings: Array<{
    symbol: string;
    quantity: number;
    avgPrice: number;
    currentPrice: number;
  }>;
  totalValue?: number;
}

export function ExportPortfolio() {
  const exportToCSV = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      // Fetch portfolio data
      const response = await fetch("/api/portfolio", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch portfolio");

      const data: PortfolioData = await response.json();

      // Generate CSV content
      let csv = "Portfolio Export Report\n";
      csv += `Generated: ${new Date().toLocaleString()}\n\n`;
      csv += `Account Balance: ₹${data.balance.toFixed(2)}\n\n`;
      csv += "Holdings:\n";
      csv += "Symbol,Quantity,Avg Price,Current Price,Value,P&L\n";

      data.holdings.forEach((holding) => {
        const value = holding.quantity * holding.currentPrice;
        const cost = holding.quantity * holding.avgPrice;
        const pnl = value - cost;
        csv += `${holding.symbol},${holding.quantity},₹${holding.avgPrice.toFixed(2)},₹${holding.currentPrice.toFixed(2)},₹${value.toFixed(2)},₹${pnl.toFixed(2)}\n`;
      });

      // Create and download file
      const element = document.createElement("a");
      element.setAttribute(
        "href",
        `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`
      );
      element.setAttribute("download", `portfolio_${new Date().toISOString().split("T")[0]}.csv`);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      toast.success("Portfolio exported", {
        description: "CSV file downloaded successfully",
        icon: <Download className="w-5 h-5" />,
      });
    } catch (error) {
      toast.error("Export failed", {
        description: error instanceof Error ? error.message : "Could not export portfolio",
      });
    }
  };

  const exportJSON = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await fetch("/api/portfolio", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch portfolio");

      const data = await response.json();
      const jsonString = JSON.stringify(data, null, 2);

      const element = document.createElement("a");
      element.setAttribute(
        "href",
        `data:application/json;charset=utf-8,${encodeURIComponent(jsonString)}`
      );
      element.setAttribute("download", `portfolio_${new Date().toISOString().split("T")[0]}.json`);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      toast.success("Portfolio exported", {
        description: "JSON file downloaded successfully",
        icon: <Download className="w-5 h-5" />,
      });
    } catch (error) {
      toast.error("Export failed", {
        description: error instanceof Error ? error.message : "Could not export portfolio",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToCSV} className="cursor-pointer">
          <span>Export as CSV</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportJSON} className="cursor-pointer">
          <span>Export as JSON</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
