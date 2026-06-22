import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createHmac } from "crypto";

function createState(userId: string): string {
  const hmac = createHmac("sha256", process.env.NEXTAUTH_SECRET!);
  hmac.update(userId);
  const sig = hmac.digest("hex");
  return Buffer.from(`${userId}:${sig}`).toString("base64url");
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clientId = process.env.SLACK_CLIENT_ID!;
  const redirectUri = process.env.SLACK_REDIRECT_URI ?? `${process.env.NEXTAUTH_URL}/api/auth/slack/callback`;
  const state = createState(session.user.id);

  const slackAuthUrl = new URL("https://slack.com/oauth/v2/authorize");
  slackAuthUrl.searchParams.set("client_id", clientId);
  slackAuthUrl.searchParams.set("user_scope", "groups:read,groups:write");
  slackAuthUrl.searchParams.set("redirect_uri", redirectUri);
  slackAuthUrl.searchParams.set("state", state);

  return NextResponse.redirect(slackAuthUrl.toString());
}
