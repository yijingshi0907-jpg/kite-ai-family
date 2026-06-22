import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { exchangeDropboxCode } from "@/lib/dropbox";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // userId embedded in state
  const error = searchParams.get("error");

  if (error || !code || !state) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/settings?dropbox_error=${encodeURIComponent(error ?? "missing_params")}`
    );
  }

  try {
    const { accessToken, refreshToken } = await exchangeDropboxCode(code);

    await db.user.update({
      where: { id: state },
      data: {
        dropboxToken: accessToken,
        dropboxRefresh: refreshToken,
      },
    });

    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/settings?dropbox_connected=1`
    );
  } catch (e: any) {
    console.error("Dropbox callback error:", e.message);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/settings?dropbox_error=${encodeURIComponent(e.message)}`
    );
  }
}
