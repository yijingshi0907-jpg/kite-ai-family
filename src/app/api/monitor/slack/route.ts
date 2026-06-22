import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { pollSlack } from "@/lib/slack-scanner";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { added, channelsScanned } = await pollSlack(session.user.id);
    return NextResponse.json({ success: true, added, channelsScanned });
  } catch (error: any) {
    console.error("[monitor/slack]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
