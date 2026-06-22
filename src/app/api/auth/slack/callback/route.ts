import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createHmac } from "crypto";

function verifyState(state: string): string | null {
  try {
    const decoded = Buffer.from(state, "base64url").toString();
    const colonIdx = decoded.indexOf(":");
    const userId = decoded.slice(0, colonIdx);
    const sig = decoded.slice(colonIdx + 1);

    const hmac = createHmac("sha256", process.env.NEXTAUTH_SECRET!);
    hmac.update(userId);
    const expected = hmac.digest("hex");

    if (sig === expected) return userId;
    return null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const error = req.nextUrl.searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(
      `http://localhost:3000/settings?slack_error=${error ?? "no_code"}`
    );
  }

  // Verify state and extract userId — no session cookie needed
  const userId = state ? verifyState(state) : null;
  if (!userId) {
    return NextResponse.redirect(
      `http://localhost:3000/settings?slack_error=invalid_state`
    );
  }

  // Exchange code for token
  const redirectUri = process.env.SLACK_REDIRECT_URI ?? `${process.env.NEXTAUTH_URL}/api/auth/slack/callback`;
  const tokenRes = await fetch("https://slack.com/api/oauth.v2.access", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.SLACK_CLIENT_ID!,
      client_secret: process.env.SLACK_CLIENT_SECRET!,
      code,
      redirect_uri: redirectUri,
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.ok) {
    return NextResponse.redirect(
      `http://localhost:3000/settings?slack_error=${tokenData.error}`
    );
  }

  const userToken = tokenData.authed_user?.access_token;
  const teamId = tokenData.team?.id;

  if (userToken) {
    await db.user.update({
      where: { id: userId },
      data: { slackToken: userToken, slackTeamId: teamId ?? null },
    });
  }

  return NextResponse.redirect(`http://localhost:3000/settings?slack_connected=1`);
}
