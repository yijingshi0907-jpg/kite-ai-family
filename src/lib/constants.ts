export const DROPBOX_SIGN_FOLDERS = [
  "Legal",
  "HR",
  "Finance",
  "Sales",
  "Operations",
  "Other",
] as const;

export type DropboxSignFolder = (typeof DROPBOX_SIGN_FOLDERS)[number];
