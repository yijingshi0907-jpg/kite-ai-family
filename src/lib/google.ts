import { google } from "googleapis";
import { db } from "./db";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

/**
 * Get an authenticated Google OAuth2 client for a given user.
 * Reads tokens from the Account table and refreshes if expired.
 */
export async function getGoogleClient(userId: string) {
  const account = await db.account.findFirst({
    where: { userId, provider: "google" },
  });

  if (!account?.access_token) {
    throw new Error("No Google account linked for this user");
  }

  oauth2Client.setCredentials({
    access_token: account.access_token,
    refresh_token: account.refresh_token ?? undefined,
    expiry_date: account.expires_at ? account.expires_at * 1000 : undefined,
  });

  // Auto-refresh if expired
  if (account.expires_at && Date.now() > account.expires_at * 1000) {
    const { credentials } = await oauth2Client.refreshAccessToken();
    // Persist updated tokens
    await db.account.update({
      where: { id: account.id },
      data: {
        access_token: credentials.access_token ?? account.access_token,
        expires_at: credentials.expiry_date
          ? Math.floor(credentials.expiry_date / 1000)
          : account.expires_at,
      },
    });
    oauth2Client.setCredentials(credentials);
  }

  return oauth2Client;
}
