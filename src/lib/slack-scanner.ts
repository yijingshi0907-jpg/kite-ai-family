import { WebClient } from "@slack/web-api";
import { db } from "./db";

const SIGNING_KEYWORDS = ["sign", "signature", "contract", "agreement"];

const SIGNABLE_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/octet-stream",
];

function getSlackClient(): WebClient {
  if (!process.env.SLACK_BOT_TOKEN) {
    throw new Error("SLACK_BOT_TOKEN is not configured");
  }
  return new WebClient(process.env.SLACK_BOT_TOKEN);
}

export interface SlackScanResult {
  added: number;
  channelsScanned: string[];
}

/**
 * Scan configured Slack channels for messages with signable file attachments.
 * Only scans channels explicitly listed in settings or SLACK_CHANNEL_ID env var.
 * Never auto-joins channels.
 */
export async function pollSlack(userId: string): Promise<SlackScanResult> {
  const settings = await db.userSettings.findUnique({ where: { userId } });
  const keywords = settings?.keywordsList?.length ? settings.keywordsList : SIGNING_KEYWORDS;

  // Use channels from settings, or fall back to env var
  const channelIds: string[] =
    settings?.slackChannelIds?.length
      ? settings.slackChannelIds
      : process.env.SLACK_CHANNEL_ID
      ? [process.env.SLACK_CHANNEL_ID]
      : [];

  if (channelIds.length === 0) {
    throw new Error("No Slack channels configured. Add a channel ID in Settings.");
  }

  const client = getSlackClient();
  const oldest = String(Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60);
  let added = 0;
  const channelsScanned: string[] = [];

  for (const channelId of channelIds) {
    let messages;
    try {
      const result = await client.conversations.history({
        channel: channelId,
        oldest,
        limit: 200,
      });
      messages = result.messages ?? [];
    } catch (e: any) {
      const code = e?.data?.error ?? "";
      if (code === "not_in_channel") {
        throw new Error(`Bot is not in channel ${channelId}. Invite the bot first: /invite @YourBotName`);
      }
      if (code === "channel_not_found") {
        throw new Error(`Channel ${channelId} not found. Check the channel ID in Settings.`);
      }
      throw e;
    }

    channelsScanned.push(channelId);

    for (const msg of messages) {
      if (!msg.files?.length) continue;

      const messageText = (msg.text ?? "").toLowerCase();
      const messageHasKeyword = keywords.some((kw) => messageText.includes(kw.toLowerCase()));

      for (const file of msg.files) {
        if (!file.id || !file.name) continue;

        const fileNameLower = file.name.toLowerCase();
        const fileNameHasKeyword = keywords.some((kw) => fileNameLower.includes(kw.toLowerCase()));

        if (!messageHasKeyword && !fileNameHasKeyword) continue;

        const mimeType = file.mimetype ?? "";
        const isSignable =
          SIGNABLE_MIME_TYPES.some((t) => mimeType.includes(t)) ||
          fileNameLower.endsWith(".pdf") ||
          fileNameLower.endsWith(".doc") ||
          fileNameLower.endsWith(".docx");

        if (!isSignable) continue;

        const existing = await db.detectedDocument.findUnique({
          where: { userId_source_sourceId: { userId, source: "SLACK", sourceId: file.id } },
        });
        if (existing) continue;

        try {
          await db.detectedDocument.create({
            data: {
              userId,
              source: "SLACK",
              sourceId: file.id,
              fileName: file.name,
              fileUrl: file.permalink ?? null,
              subject: msg.text ? `#${channelId}: ${msg.text}` : `#${channelId} (matched by filename)`,
            },
          });
          added++;
        } catch (e: any) {
          if (e?.code !== "P2002") throw e;
        }
      }
    }
  }

  return { added, channelsScanned };
}

/**
 * Download a Slack file's bytes using the bot token.
 */
export async function downloadSlackFile(fileId: string): Promise<Buffer> {
  const client = getSlackClient();

  const info = await client.files.info({ file: fileId });
  const fileInfo = info.file as any;

  const downloadUrl = fileInfo?.url_private_download ?? fileInfo?.url_private;
  if (!downloadUrl) {
    throw new Error(`No download URL found for Slack file ${fileId}`);
  }

  const res = await fetch(downloadUrl, {
    headers: { Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to download Slack file: ${res.status} ${res.statusText}`);
  }

  return Buffer.from(await res.arrayBuffer());
}
