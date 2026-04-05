import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { pollDrive } from "@/lib/drive";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const added = await pollDrive(session.user.id);
    return NextResponse.json({ success: true, added });
  } catch (error: any) {
    console.error("[monitor/drive]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
