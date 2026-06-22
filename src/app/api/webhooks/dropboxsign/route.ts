import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { uploadToDropbox } from "@/lib/dropbox";
import { SignatureRequestApi } from "@dropbox/sign";

// Dropbox Sign sends a JSON body wrapped in "json=" form field
export async function POST(req: NextRequest) {
  const text = await req.text();

  // Dropbox Sign sends: json=<url-encoded-json>
  let payload: any;
  if (text.startsWith("json=")) {
    payload = JSON.parse(decodeURIComponent(text.slice(5)));
  } else {
    payload = JSON.parse(text);
  }

  // Always respond with "Hello API Event Received" (Dropbox Sign requirement)
  const ack = new NextResponse("Hello API Event Received", { status: 200 });

  const event = payload?.event;
  if (!event) return ack;

  const eventType = event.event_type;

  // Only act on fully completed signatures
  if (eventType !== "signature_request_all_signed") return ack;

  const sigReqData = payload?.signature_request;
  const dropboxSignId = sigReqData?.signature_request_id;
  if (!dropboxSignId) return ack;

  // Find the signing request in our DB
  const signingRequest = await db.signingRequest.findUnique({
    where: { dropboxSignId },
    include: { user: { select: { dropboxToken: true, id: true } } },
  });

  if (!signingRequest) return ack;

  // Update status to COMPLETED
  await db.signingRequest.update({
    where: { id: signingRequest.id },
    data: { status: "COMPLETED", completedAt: new Date() },
  });

  await db.signingEvent.create({
    data: { signingRequestId: signingRequest.id, eventType: "completed" },
  });

  // Save to Dropbox if user has connected Dropbox + configured a save folder
  const dropboxToken = signingRequest.user?.dropboxToken;
  if (!dropboxToken) return ack;

  const settings = await db.userSettings.findUnique({
    where: { userId: signingRequest.userId },
    select: { dropboxSaveFolder: true },
  });

  const saveFolder = settings?.dropboxSaveFolder;
  if (!saveFolder) return ack;

  try {
    // Download the signed PDF from Dropbox Sign
    const api = new SignatureRequestApi();
    api.username = process.env.DROPBOX_SIGN_API_KEY ?? "";
    const dlRes = await api.signatureRequestFiles(dropboxSignId, "pdf");
    const pdfBuffer = dlRes as unknown as Buffer;

    // Upload to Dropbox
    const fileName = signingRequest.documentName.replace(/[^a-zA-Z0-9._\- ]/g, "_");
    const destPath = `${saveFolder.replace(/\/$/, "")}/${fileName}`;
    await uploadToDropbox(dropboxToken, destPath, pdfBuffer);

    await db.signingEvent.create({
      data: {
        signingRequestId: signingRequest.id,
        eventType: "saved_to_dropbox",
        metadata: { path: destPath },
      },
    });
  } catch (e: any) {
    console.error("Failed to save to Dropbox:", e.message);
  }

  return ack;
}
