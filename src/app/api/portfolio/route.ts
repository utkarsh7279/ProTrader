import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = verifyToken(token as string) as any;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const account = await prisma.account.findFirst({
    where: { userId: user.userId }
  });

  if (!account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  const holdings = await prisma.holding.findMany({
    where: { accountId: account.id }
  });

  return NextResponse.json({
    balance: account.balance,
    holdings: holdings
  });
}
