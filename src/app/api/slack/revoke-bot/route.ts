import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { WebClient } from "@slack/web-api";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const botClient = new WebClient(process.env.SLACK_BOT_TOKEN);

  // List all public channels (bot auto-joined these)
  const channels: Array<{ id: string; name: string }> = [];
  let cursor: string | undefined;

  do {
    const res = await botClient.conversations.list({
      exclude_archived: true,
      types: "public_channel",
      limit: 200,
      ...(cursor ? { cursor } : {}),
    });

    for (const ch of res.channels ?? []) {
      if (ch.id && ch.name) {
        channels.push({ id: ch.id, name: ch.name });
      }
    }

    cursor = res.response_metadata?.next_cursor || undefined;
  } while (cursor);

  // Leave all channels in parallel — catch errors per channel
  const left: string[] = [];
  const failed: string[] = [];

  await Promise.all(
    channels.map(async (ch) => {
      try {
        await botClient.conversations.leave({ channel: ch.id });
        left.push(ch.name);
      } catch (e: any) {
        const code = e?.data?.error ?? "";
        if (code === "not_in_channel") {
          // Bot wasn't in this channel — ignore
        } else if (code === "cant_leave_general") {
          left.push(`${ch.name} (general — can't leave)`);
        } else {
          failed.push(ch.name);
        }
      }
    })
  );

  return NextResponse.json({
    success: true,
    total: left.length,
    left,
    failed,
  });
}
