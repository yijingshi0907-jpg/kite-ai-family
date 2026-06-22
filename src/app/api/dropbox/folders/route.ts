import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { listDropboxFolders } from "@/lib/dropbox";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { dropboxToken: true },
  });

  if (!user?.dropboxToken) {
    return NextResponse.json({ error: "Dropbox not connected" }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path") ?? "";

  try {
    const folders = await listDropboxFolders(user.dropboxToken, path);
    return NextResponse.json({ folders });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
