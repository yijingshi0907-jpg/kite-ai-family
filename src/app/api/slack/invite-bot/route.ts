import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { WebClient } from "@slack/web-api";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user?.slackToken) {
    return NextResponse.json(
      { error: "Slack account not connected. Connect it in Settings first." },
      { status: 400 }
    );
  }

  // User client (to list/invite in private channels)
  const userClient = new WebClient(user.slackToken);

  // Bot client (to get the bot's user ID)
  const botClient = new WebClient(process.env.SLACK_BOT_TOKEN);

  // Get bot's user ID
  const botInfo = await botClient.auth.test();
  const botUserId = botInfo.user_id as string;

  // List all private channels the user is in
  const privateChannels: Array<{ id: string; name: string }> = [];
  let cursor: string | undefined;

  do {
    const res = await userClient.conversations.list({
      exclude_archived: true,
      types: "private_channel",
      limit: 200,
      ...(cursor ? { cursor } : {}),
    });

    for (const ch of res.channels ?? []) {
      if (ch.id && ch.name) {
        privateChannels.push({ id: ch.id, name: ch.name });
      }
    }

    cursor = res.response_metadata?.next_cursor || undefined;
  } while (cursor);

  // Invite the bot to each private channel
  const invited: string[] = [];
  const alreadyIn: string[] = [];
  const failed: string[] = [];

  for (const ch of privateChannels) {
    try {
      await userClient.conversations.invite({
        channel: ch.id,
        users: botUserId,
      });
      invited.push(ch.name);
    } catch (e: any) {
      const code = e?.data?.error ?? "";
      if (code === "already_in_channel") {
        alreadyIn.push(ch.name);
      } else {
        failed.push(ch.name);
      }
    }
  }

  return NextResponse.json({
    success: true,
    total: privateChannels.length,
    invited,
    alreadyIn,
    failed,
  });
}
