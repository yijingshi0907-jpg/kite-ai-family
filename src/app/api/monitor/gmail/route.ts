import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { pollGmail } from "@/lib/gmail";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const added = await pollGmail(session.user.id);
    return NextResponse.json({ success: true, added });
  } catch (error: any) {
    console.error("[monitor/gmail]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
