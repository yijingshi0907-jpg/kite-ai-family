import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = new URLSearchParams({
    client_id: process.env.DROPBOX_APP_KEY ?? "",
    redirect_uri: process.env.DROPBOX_REDIRECT_URI ?? "",
    response_type: "code",
    token_access_type: "offline",
    state: session.user.id,
  });

  return NextResponse.redirect(
    `https://www.dropbox.com/oauth2/authorize?${params.toString()}`
  );
}
