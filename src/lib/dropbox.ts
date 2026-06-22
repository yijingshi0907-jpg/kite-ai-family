import { Dropbox } from "dropbox";

export function getDropboxClient(accessToken: string) {
  return new Dropbox({ accessToken });
}

export interface DropboxFolder {
  path: string;
  name: string;
}

/** List all folders (non-recursive) at the given path, defaulting to root. */
export async function listDropboxFolders(
  accessToken: string,
  path = ""
): Promise<DropboxFolder[]> {
  const dbx = getDropboxClient(accessToken);
  const res = await dbx.filesListFolder({ path, include_non_downloadable_files: false });
  return res.result.entries
    .filter((e) => e[".tag"] === "folder")
    .map((e) => ({ path: e.path_display ?? e.path_lower ?? "", name: e.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Upload a buffer to Dropbox at the given path, overwriting if exists. */
export async function uploadToDropbox(
  accessToken: string,
  destPath: string,
  contents: Buffer
): Promise<void> {
  const dbx = getDropboxClient(accessToken);
  await dbx.filesUpload({
    path: destPath,
    contents,
    mode: { ".tag": "overwrite" },
    autorename: true,
  });
}

/** Exchange authorization code for tokens. */
export async function exchangeDropboxCode(code: string): Promise<{
  accessToken: string;
  refreshToken: string | null;
  accountId: string;
}> {
  const params = new URLSearchParams({
    code,
    grant_type: "authorization_code",
    client_id: process.env.DROPBOX_APP_KEY ?? "",
    client_secret: process.env.DROPBOX_APP_SECRET ?? "",
    redirect_uri: process.env.DROPBOX_REDIRECT_URI ?? "",
  });

  const res = await fetch("https://api.dropboxapi.com/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Dropbox token exchange failed: ${err}`);
  }

  const data = await res.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? null,
    accountId: data.account_id,
  };
}
