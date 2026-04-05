import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { postSigningLink } from "@/lib/slack";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { signingRequestId } = await req.json() as { signingRequestId: string };
  if (!signingRequestId) {
    return NextResponse.json({ error: "signingRequestId is required" }, { status: 400 });
  }

  const signingRequest = await db.signingRequest.findUnique({
    where: { id: signingRequestId },
  });

  if (!signingRequest || signingRequest.userId !== session.user.id) {
    return NextResponse.json({ error: "Signing request not found" }, { status: 404 });
  }

  if (!signingRequest.signingUrl) {
    return NextResponse.json({ error: "No signing URL available yet" }, { status: 400 });
  }

  const signers = (signingRequest.signers as Array<{ email: string; name: string }>) ?? [];
  const signerEmails = signers.map((s) => s.email);

  // Get user's configured Slack channel (from settings) or fall back to env
  const settings = await db.userSettings.findUnique({ where: { userId: session.user.id } });
  const channelId = settings?.slackChannelId ?? process.env.SLACK_CHANNEL_ID;

  try {
    const ts = await postSigningLink({
      documentName: signingRequest.documentName,
      signingUrl: signingRequest.signingUrl,
      signerEmails,
      channelId: channelId ?? undefined,
    });

    // Save Slack message timestamp for future tracking
    await db.signingRequest.update({
      where: { id: signingRequestId },
      data: { slackMessageTs: ts },
    });

    await db.signingEvent.create({
      data: {
        signingRequestId,
        eventType: "slack_notified",
        metadata: { channelId, ts },
      },
    });

    return NextResponse.json({ success: true, ts });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
