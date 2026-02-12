import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = verifyToken(token) as any;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const account = await prisma.account.findFirst({
    where: { userId: user.userId }
  });

  const risk = await prisma.riskScore.findFirst({
    where: { accountId: account!.id },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(risk);
}
