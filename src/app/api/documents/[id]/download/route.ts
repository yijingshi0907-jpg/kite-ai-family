import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getGoogleClient } from "@/lib/google";
import { google } from "googleapis";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const doc = await db.detectedDocument.findUnique({ where: { id } });
  if (!doc || doc.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const { buffer, filename, mimeType } = await fetchDocumentBytes(doc, session.user.id);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `inline; filename="${filename}"`,
        "Content-Length": String(buffer.length),
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

async function fetchDocumentBytes(
  doc: { source: string; sourceId: string; fileName: string; fileUrl: string | null },
  userId: string
): Promise<{ buffer: Buffer; filename: string; mimeType: string }> {
  const filename = doc.fileName;

  if (doc.source === "GMAIL") {
    const authClient = await getGoogleClient(userId);
    const gmail = google.gmail({ version: "v1", auth: authClient });

    const msg = await gmail.users.messages.get({
      userId: "me",
      id: doc.sourceId,
      format: "full",
    });

    const parts = msg.data.payload?.parts ?? [];
    const att = parts.find(
      (p) => p.filename === doc.fileName && p.body?.attachmentId
    );

    if (!att?.body?.attachmentId) {
      throw new Error("Attachment not found in Gmail message");
    }

    const attData = await gmail.users.messages.attachments.get({
      userId: "me",
      messageId: doc.sourceId,
      id: att.body.attachmentId,
    });

    const base64 = (attData.data.data ?? "").replace(/-/g, "+").replace(/_/g, "/");
    const buffer = Buffer.from(base64, "base64");
    const mimeType = att.mimeType ?? "application/octet-stream";
    return { buffer, filename, mimeType };
  }

  if (doc.source === "GOOGLE_DRIVE") {
    const authClient = await getGoogleClient(userId);
    const drive = google.drive({ version: "v3", auth: authClient });

    const meta = await drive.files.get({ fileId: doc.sourceId, fields: "mimeType,name" });
    const mimeType = meta.data.mimeType ?? "application/octet-stream";

    if (mimeType === "application/vnd.google-apps.document") {
      const res = await drive.files.export(
        { fileId: doc.sourceId, mimeType: "application/pdf" },
        { responseType: "arraybuffer" }
      );
      return { buffer: Buffer.from(res.data as ArrayBuffer), filename: `${filename}.pdf`, mimeType: "application/pdf" };
    } else {
      const res = await drive.files.get(
        { fileId: doc.sourceId, alt: "media" },
        { responseType: "arraybuffer" }
      );
      return { buffer: Buffer.from(res.data as ArrayBuffer), filename, mimeType };
    }
  }

  throw new Error(`Unsupported source: ${doc.source}`);
}
