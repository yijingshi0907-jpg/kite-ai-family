import { google } from "googleapis";
import { getGoogleClient } from "./google";
import { db } from "./db";

const SIGNING_KEYWORDS = ["sign", "contract", "agreement"];
const LOOKBACK_HOURS = 24;

/**
 * Poll a Google Drive folder for new files, filter by signing keywords in filename,
 * save as DetectedDocuments. Returns count added.
 */
export async function pollDrive(userId: string): Promise<number> {
  const settings = await db.userSettings.findUnique({ where: { userId } });

  if (!settings?.driveMonitorFolder) {
    return 0; // No folder configured
  }

  const auth = await getGoogleClient(userId);
  const drive = google.drive({ version: "v3", auth });

  const keywords = settings.keywordsList?.length ? settings.keywordsList : SIGNING_KEYWORDS;
  const since = new Date(Date.now() - LOOKBACK_HOURS * 60 * 60 * 1000).toISOString();

  const res = await drive.files.list({
    q: `'${settings.driveMonitorFolder}' in parents and modifiedTime > '${since}' and trashed = false`,
    fields: "files(id, name, mimeType, webViewLink, modifiedTime)",
    pageSize: 50,
  });

  const files = res.data.files ?? [];
  let added = 0;

  for (const file of files) {
    if (!file.id || !file.name) continue;

    // Filter: filename must contain a signing keyword
    const nameLower = file.name.toLowerCase();
    const hasKeyword = keywords.some((kw) => nameLower.includes(kw.toLowerCase()));
    if (!hasKeyword) continue;

    // Skip non-document types
    const isDoc =
      file.mimeType?.includes("pdf") ||
      file.mimeType?.includes("word") ||
      file.mimeType?.includes("document") ||
      file.mimeType?.includes("spreadsheet") ||
      file.mimeType === "application/vnd.google-apps.document";
    if (!isDoc) continue;

    try {
      await db.detectedDocument.create({
        data: {
          userId,
          source: "GOOGLE_DRIVE",
          sourceId: file.id,
          fileName: file.name,
          fileUrl: file.webViewLink ?? null,
          subject: null,
        },
      });
      added++;
    } catch (e: any) {
      if (e?.code !== "P2002") throw e;
    }
  }

  return added;
}
