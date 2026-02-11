import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

interface DecodedToken {
  userId: string;
}

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  const token = auth?.split(" ")[1];

  const decoded = verifyToken(token as string);
  if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { userId } = decoded as DecodedToken;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { accounts: true },
  });

  return NextResponse.json(user);
}
