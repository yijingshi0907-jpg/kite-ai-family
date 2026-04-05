import { WebClient } from "@slack/web-api";

let slackClient: WebClient | null = null;

function getSlackClient(): WebClient {
  if (!slackClient) {
    if (!process.env.SLACK_BOT_TOKEN) {
      throw new Error("SLACK_BOT_TOKEN is not configured");
    }
    slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);
  }
  return slackClient;
}

export interface SlackSigningMessage {
  documentName: string;
  signingUrl: string;
  signerEmails: string[];
  channelId?: string;
}

/**
 * Post a signing link notification to a Slack channel.
 * Returns the message timestamp (ts) for tracking.
 */
export async function postSigningLink({
  documentName,
  signingUrl,
  signerEmails,
  channelId,
}: SlackSigningMessage): Promise<string | null> {
  const channel = channelId ?? process.env.SLACK_CHANNEL_ID;
  if (!channel) {
    throw new Error("No Slack channel configured. Set SLACK_CHANNEL_ID or pass channelId.");
  }

  const client = getSlackClient();

  const signerList = signerEmails.join(", ");

  const result = await client.chat.postMessage({
    channel,
    text: `📄 *${documentName}* needs signatures`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `📄 *${documentName}* needs to be signed`,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Signers:*\n${signerList}`,
          },
        ],
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "✍️ Sign Document" },
            url: signingUrl,
            style: "primary",
          },
        ],
      },
    ],
  });

  return (result.ts as string) ?? null;
}
