import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { driveMonitorFolder, keywordsList } = body as {
    driveMonitorFolder?: string;
    keywordsList?: string[];
  };

  const settings = await db.userSettings.upsert({
    where: { userId: session.user.id },
    update: {
      ...(driveMonitorFolder !== undefined && { driveMonitorFolder }),
      ...(keywordsList !== undefined && { keywordsList }),
    },
    create: {
      userId: session.user.id,
      driveMonitorFolder: driveMonitorFolder ?? null,
      keywordsList: keywordsList ?? ["sign", "contract", "agreement"],
    },
  });

  return NextResponse.json({ success: true, settings });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await db.userSettings.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json({ settings });
}
