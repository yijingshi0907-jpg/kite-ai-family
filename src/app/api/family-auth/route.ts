import { NextRequest, NextResponse } from "next/server";

const PASSCODE = process.env.FAMILY_PASSCODE ?? "20260606";

export async function POST(req: NextRequest) {
  const { passcode } = await req.json();
  if (passcode !== PASSCODE) {
    return NextResponse.json({ error: "密码错误" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set("family_auth", PASSCODE, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 90, // 90 days
    path: "/",
    sameSite: "lax",
  });
  return res;
}
