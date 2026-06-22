import {
  UnclaimedDraftApi,
  UnclaimedDraftCreateRequest,
  SubUnclaimedDraftSigner,
} from "@dropbox/sign";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

function getApi() {
  const api = new UnclaimedDraftApi();
  api.username = process.env.DROPBOX_SIGN_API_KEY ?? "";
  return api;
}

export interface Signer {
  email: string;
  name: string;
}

export interface EnterpriseOptions {
  folder?: string;
  requesterEmail?: string;
  ccEmails?: string[];
}

export interface EmbeddedDraftResult {
  signatureRequestId: string;
  claimUrl: string;
}

/**
 * Create an unclaimed draft in Dropbox Sign.
 * Returns a claimUrl the requester opens in the Dropbox Sign web UI
 * to place signature fields, configure signers, and send.
 * Does NOT require DROPBOX_SIGN_CLIENT_ID.
 */
export async function createEmbeddedDraft(
  documentName: string,
  fileBuffer: Buffer,
  signers: Signer[],
  subject?: string,
  enterprise?: EnterpriseOptions
): Promise<EmbeddedDraftResult> {
  const api = getApi();

  const tmpPath = path.join(os.tmpdir(), `signing-${Date.now()}.pdf`);
  fs.writeFileSync(tmpPath, fileBuffer);

  try {
    const signerList: SubUnclaimedDraftSigner[] = signers.map((s, i) => ({
      emailAddress: s.email,
      name: s.name,
      order: i,
    }));

    const metadata: Record<string, string> = {};
    if (enterprise?.folder) metadata.folder = enterprise.folder;
    if (enterprise?.requesterEmail) metadata.requesterEmail = enterprise.requesterEmail;

    const data: UnclaimedDraftCreateRequest = {
      type: UnclaimedDraftCreateRequest.TypeEnum.RequestSignature,
      subject: subject ?? `Please sign: ${documentName}`,
      message: "Please review and sign this document at your earliest convenience.",
      signers: signerList,
      files: [fs.createReadStream(tmpPath)],
      testMode: process.env.NODE_ENV !== "production",
      ...(enterprise?.ccEmails?.length ? { ccEmailAddresses: enterprise.ccEmails } : {}),
      ...(Object.keys(metadata).length ? { metadata } : {}),
    };

    const response = await api.unclaimedDraftCreate(data);
    const draft = response.body.unclaimedDraft;

    return {
      signatureRequestId: draft?.signatureRequestId ?? "",
      claimUrl: draft?.claimUrl ?? "",
    };
  } finally {
    try { fs.unlinkSync(tmpPath); } catch {}
  }
}
