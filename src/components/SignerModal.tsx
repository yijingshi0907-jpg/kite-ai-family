"use client";

import { useState } from "react";
import { DROPBOX_SIGN_FOLDERS } from "@/lib/constants";

interface Signer {
  email: string;
  name: string;
}

interface Props {
  documentName: string;
  detectedDocId: string;
  defaultFolder?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function SignerModal({ documentName, detectedDocId, defaultFolder, onClose, onSuccess }: Props) {
  const [signers, setSigners] = useState<Signer[]>([{ email: "", name: "" }]);
  const [folder, setFolder] = useState(defaultFolder ?? "");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  function addSigner() {
    if (signers.length < 5) setSigners([...signers, { email: "", name: "" }]);
  }

  function removeSigner(i: number) {
    setSigners(signers.filter((_, idx) => idx !== i));
  }

  function updateSigner(i: number, field: keyof Signer, value: string) {
    setSigners(signers.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));
  }

  async function handleSend() {
    const valid = signers.every((s) => s.email.trim() && s.name.trim());
    if (!valid) {
      setError("Please fill in all signer names and emails.");
      return;
    }

    setSending(true);
    setError("");

    try {
      // Step 1: Send to Dropbox Sign
      const sendRes = await fetch("/api/signing/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ detectedDocId, signers, folder: folder || undefined }),
      });

      const sendData = await sendRes.json();
      if (!sendRes.ok) {
        throw new Error(sendData.error ?? "Failed to send document");
      }

      // Open the Dropbox Sign editor in a new tab for the user to prepare and send
      if (sendData.claimUrl) {
        window.open(sendData.claimUrl, "_blank", "noopener,noreferrer");
      }

      onSuccess();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Send for Signing</h2>
          <p className="text-sm text-gray-500 mt-0.5 truncate">{documentName}</p>
        </div>

        <div className="px-6 py-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Folder</label>
            <select
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No folder</option>
              {DROPBOX_SIGN_FOLDERS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <p className="text-sm text-gray-600">Enter the signer(s) details:</p>

          {signers.map((signer, i) => (
            <div key={i} className="flex gap-2 items-start">
              <div className="flex-1 space-y-1">
                <input
                  type="text"
                  placeholder="Full name"
                  value={signer.name}
                  onChange={(e) => updateSigner(i, "name", e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={signer.email}
                  onChange={(e) => updateSigner(i, "email", e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {signers.length > 1 && (
                <button
                  onClick={() => removeSigner(i)}
                  className="mt-1 text-gray-400 hover:text-red-500 text-lg leading-none"
                >
                  ×
                </button>
              )}
            </div>
          ))}

          {signers.length < 5 && (
            <button
              onClick={addSigner}
              className="text-sm text-blue-600 hover:underline"
            >
              + Add another signer
            </button>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={sending}
            className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending}
            className="bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {sending ? "Preparing..." : "Open in Dropbox Sign"}
          </button>
        </div>
      </div>
    </div>
  );
}
