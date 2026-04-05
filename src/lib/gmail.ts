import { google } from "googleapis";
import { getGoogleClient } from "./google";
import { db } from "./db";

const SIGNING_KEYWORDS = ["sign", "contract", "agreement"];

/**
 * Poll Gmail for emails containing signing keywords in subject AND body,
 * with attachments. Saves new DetectedDocuments to DB. Returns count added.
 */
export async function pollGmail(userId: string): Promise<number> {
  const auth = await getGoogleClient(userId);
  const gmail = google.gmail({ version: "v1", auth });

  // Get user's custom keywords from settings (fall back to defaults)
  const settings = await db.userSettings.findUnique({ where: { userId } });
  const keywords = settings?.keywordsList?.length
    ? settings.keywordsList
    : SIGNING_KEYWORDS;

  // Gmail query: matches subject OR body (no prefix = full-text search)
  // has:attachment ensures there's a file to sign
  const query = `has:attachment (${keywords.join(" OR ")})`;

  const listRes = await gmail.users.messages.list({
    userId: "me",
    q: query,
    maxResults: 50,
  });

  const messages = listRes.data.messages ?? [];
  let added = 0;

  for (const msg of messages) {
    if (!msg.id) continue;

    // Skip if already detected
    const existing = await db.detectedDocument.findUnique({
      where: { userId_source_sourceId: { userId, source: "GMAIL", sourceId: msg.id } },
    });
    if (existing) continue;

    // Fetch full message to check subject + body + attachments
    const fullMsg = await gmail.users.messages.get({
      userId: "me",
      id: msg.id,
      format: "full",
    });

    const headers = fullMsg.data.payload?.headers ?? [];
    const subject = headers.find((h) => h.name?.toLowerCase() === "subject")?.value ?? "";
    const snippet = fullMsg.data.snippet ?? "";

    // Secondary filter: keyword must appear in subject OR snippet (body preview)
    const combinedText = (subject + " " + snippet).toLowerCase();
    const hasKeyword = keywords.some((kw) => combinedText.includes(kw.toLowerCase()));
    if (!hasKeyword) continue;

    // Find PDF/doc attachments
    const parts = fullMsg.data.payload?.parts ?? [];
    const attachments = parts.filter(
      (p) =>
        p.filename &&
        p.filename.length > 0 &&
        (p.mimeType?.includes("pdf") ||
          p.mimeType?.includes("word") ||
          p.mimeType?.includes("document") ||
          p.mimeType?.includes("octet-stream"))
    );

    if (attachments.length === 0) continue;

    // Save one DetectedDocument per attachment
    for (const att of attachments) {
      if (!att.filename) continue;

      // Build attachment URL (download via Gmail API)
      const attachmentId = att.body?.attachmentId;
      const fileUrl = attachmentId
        ? `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}/attachments/${attachmentId}`
        : undefined;

      try {
        await db.detectedDocument.create({
          data: {
            userId,
            source: "GMAIL",
            sourceId: msg.id,
            fileName: att.filename,
            fileUrl: fileUrl ?? null,
            subject: subject || null,
          },
        });
        added++;
      } catch (e: any) {
        // Unique constraint violation = already exists, skip
        if (e?.code !== "P2002") throw e;
      }
    }
  }

  return added;
}
