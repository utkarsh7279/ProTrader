import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { getRiskMetrics } from "@/lib/risk";
import { RISK_LIMITS } from "@/lib/constants";
import { broadcast } from "@/lib/ws";

export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = verifyToken(token) as any;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { symbol, quantity, price, type } = await req.json();

  const account = await prisma.account.findFirst({
    where: { userId: user.userId }
  });

  if (!account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  const trade = await prisma.trade.create({
    data: {
      accountId: account.id,
      symbol,
      quantity,
      price,
      type,
    },
  });

  const risk = await getRiskMetrics(account.id);

  await prisma.riskScore.create({
    data: {
      accountId: account.id,
      score: risk.risk_score,
      var: risk.var,
      drawdown: risk.drawdown,
    },
  });

  if (risk.risk_score >= RISK_LIMITS.HIGH) {
    broadcast({
      type: "risk_alert",
      level: "HIGH",
      message: "High portfolio risk detected. Consider rebalancing."
    });
  }

  return NextResponse.json({ trade, risk });
}
