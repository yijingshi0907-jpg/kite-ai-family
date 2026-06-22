import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    driveMonitorFolder,
    keywordsList,
    slackChannelIds,
    dropboxSignFolder,
    dropboxSignRequesterEmail,
    dropboxSignCcEmail,
    dropboxSaveFolder,
  } = body as {
    driveMonitorFolder?: string;
    keywordsList?: string[];
    slackChannelIds?: string[];
    dropboxSignFolder?: string;
    dropboxSignRequesterEmail?: string;
    dropboxSignCcEmail?: string;
    dropboxSaveFolder?: string;
  };

  const settings = await db.userSettings.upsert({
    where: { userId: session.user.id },
    update: {
      ...(driveMonitorFolder !== undefined && { driveMonitorFolder }),
      ...(keywordsList !== undefined && { keywordsList }),
      ...(slackChannelIds !== undefined && { slackChannelIds }),
      ...(dropboxSignFolder !== undefined && { dropboxSignFolder: dropboxSignFolder || null }),
      ...(dropboxSignRequesterEmail !== undefined && { dropboxSignRequesterEmail: dropboxSignRequesterEmail || null }),
      ...(dropboxSignCcEmail !== undefined && { dropboxSignCcEmail: dropboxSignCcEmail || null }),
      ...(dropboxSaveFolder !== undefined && { dropboxSaveFolder: dropboxSaveFolder || null }),
    },
    create: {
      userId: session.user.id,
      driveMonitorFolder: driveMonitorFolder ?? null,
      keywordsList: keywordsList ?? ["sign", "contract", "agreement"],
      slackChannelIds: slackChannelIds ?? [],
      dropboxSignFolder: dropboxSignFolder ?? null,
      dropboxSignRequesterEmail: dropboxSignRequesterEmail ?? null,
      dropboxSignCcEmail: dropboxSignCcEmail ?? null,
      dropboxSaveFolder: dropboxSaveFolder ?? null,
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
