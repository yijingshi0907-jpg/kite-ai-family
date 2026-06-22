import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createEmbeddedDraft, type Signer } from "@/lib/dropboxsign";
import { getGoogleClient } from "@/lib/google";
import { google } from "googleapis";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { detectedDocId, signers, folder } = body as {
    detectedDocId: string;
    signers?: Signer[];
    folder?: string;
  };

  if (!detectedDocId) {
    return NextResponse.json({ error: "detectedDocId is required" }, { status: 400 });
  }

  // Load detected document
  const doc = await db.detectedDocument.findUnique({ where: { id: detectedDocId } });
  if (!doc || doc.userId !== session.user.id) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  // Load user settings for enterprise options
  const userSettings = await db.userSettings.findUnique({ where: { userId: session.user.id } });
  const resolvedFolder = folder || userSettings?.dropboxSignFolder || undefined;

  // Download the document bytes
  let fileBuffer: Buffer;
  try {
    fileBuffer = await downloadDocument(doc, session.user.id);
  } catch (e: any) {
    return NextResponse.json({ error: `Failed to download document: ${e.message}` }, { status: 500 });
  }

  // Create embedded draft in Dropbox Sign
  let draftResult;
  try {
    draftResult = await createEmbeddedDraft(doc.fileName, fileBuffer, signers ?? [], doc.subject ?? undefined, {
      folder: resolvedFolder,
      requesterEmail: userSettings?.dropboxSignRequesterEmail ?? undefined,
      ccEmails: userSettings?.dropboxSignCcEmail ? [userSettings.dropboxSignCcEmail] : undefined,
    });
  } catch (e: any) {
    const detail = e?.body?.error?.errorMsg ?? e?.body?.error ?? e?.message ?? String(e);
    console.error("Dropbox Sign error:", JSON.stringify(e?.body ?? e?.message));
    return NextResponse.json({ error: `Dropbox Sign error: ${detail}` }, { status: 500 });
  }

  // Save SigningRequest to DB as PENDING_REVIEW until user sends from Dropbox Sign
  const signingRequest = await db.signingRequest.create({
    data: {
      userId: session.user.id,
      detectedDocId: doc.id,
      documentName: doc.fileName,
      dropboxSignId: draftResult.signatureRequestId,
      signingUrl: draftResult.claimUrl,
      status: "PENDING_REVIEW",
      signers: (signers ?? []) as unknown as import("@prisma/client").Prisma.InputJsonValue,
    },
  });

  // Record event
  await db.signingEvent.create({
    data: {
      signingRequestId: signingRequest.id,
      eventType: "draft_created",
    },
  });

  // Mark document as reviewed
  await db.detectedDocument.update({
    where: { id: doc.id },
    data: { reviewed: true },
  });

  return NextResponse.json({
    success: true,
    signingRequestId: signingRequest.id,
    claimUrl: draftResult.claimUrl,
  });
}

/**
 * Download document bytes based on source (GMAIL or GOOGLE_DRIVE).
 */
async function downloadDocument(
  doc: { source: string; sourceId: string; fileUrl: string | null; fileName: string },
  userId: string
): Promise<Buffer> {
  const authClient = await getGoogleClient(userId);

  if (doc.source === "GMAIL") {
    // sourceId = message ID; fileUrl contains attachment download URL pattern
    const gmail = google.gmail({ version: "v1", auth: authClient });

    // Get message to find attachment ID
    const msg = await gmail.users.messages.get({ userId: "me", id: doc.sourceId, format: "full" });
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
    return Buffer.from(base64, "base64");
  }

  if (doc.source === "GOOGLE_DRIVE") {
    const drive = google.drive({ version: "v3", auth: authClient });

    // Export Google Docs as PDF, download other files directly
    const meta = await drive.files.get({ fileId: doc.sourceId, fields: "mimeType" });
    const mimeType = meta.data.mimeType ?? "";

    if (mimeType === "application/vnd.google-apps.document") {
      const res = await drive.files.export(
        { fileId: doc.sourceId, mimeType: "application/pdf" },
        { responseType: "arraybuffer" }
      );
      return Buffer.from(res.data as ArrayBuffer);
    } else {
      const res = await drive.files.get(
        { fileId: doc.sourceId, alt: "media" },
        { responseType: "arraybuffer" }
      );
      return Buffer.from(res.data as ArrayBuffer);
    }
  }

  throw new Error(`Unsupported document source: ${doc.source}`);
}
