import {
  SignatureRequestApi,
  SignatureRequestSendRequest,
  SubSignatureRequestSigner,
} from "@dropbox/sign";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

function getApi() {
  const api = new SignatureRequestApi();
  api.username = process.env.DROPBOX_SIGN_API_KEY ?? "";
  return api;
}

export interface Signer {
  email: string;
  name: string;
}

export interface SigningResult {
  signatureRequestId: string;
  signingUrl: string | null;
}

/**
 * Send a document to Dropbox Sign for signing.
 * Writes the file to a temp path (SDK requires a ReadStream).
 */
export async function createSigningRequest(
  documentName: string,
  fileBuffer: Buffer,
  signers: Signer[],
  subject?: string
): Promise<SigningResult> {
  const api = getApi();

  // Write buffer to temp file (SDK needs a ReadStream)
  const tmpPath = path.join(os.tmpdir(), `signing-${Date.now()}.pdf`);
  fs.writeFileSync(tmpPath, fileBuffer);

  try {
    const signerList: SubSignatureRequestSigner[] = signers.map((s, i) => ({
      emailAddress: s.email,
      name: s.name,
      order: i,
    }));

    const data: SignatureRequestSendRequest = {
      title: documentName,
      subject: subject ?? `Please sign: ${documentName}`,
      message: "Please review and sign this document at your earliest convenience.",
      signers: signerList,
      files: [fs.createReadStream(tmpPath)],
      testMode: process.env.NODE_ENV !== "production",
    };

    const response = await api.signatureRequestSend(data);
    const req = response.body.signatureRequest;

    return {
      signatureRequestId: req?.signatureRequestId ?? "",
      signingUrl: req?.signingUrl ?? null,
    };
  } finally {
    // Clean up temp file
    try { fs.unlinkSync(tmpPath); } catch {}
  }
}
