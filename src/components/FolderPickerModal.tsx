"use client";

import { useState } from "react";

interface Props {
  documentName: string;
  detectedDocId: string;
  defaultFolder?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function FolderPickerModal({ documentName, detectedDocId, defaultFolder, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleOpen() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/signing/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ detectedDocId, folder: defaultFolder || undefined, signers: [] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create draft");
      if (data.claimUrl) {
        window.open(data.claimUrl, "_blank", "noopener,noreferrer");
      }
      onSuccess();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
        <div className="px-6 py-5">
          <h2 className="text-base font-semibold text-gray-900">Open in Dropbox Sign</h2>
          <p className="text-sm text-gray-500 mt-1 truncate">{documentName}</p>
          <p className="text-xs text-gray-400 mt-3">
            The document will open in Dropbox Sign where you can add signers and place signature fields.
          </p>
          {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2"
          >
            Cancel
          </button>
          <button
            onClick={handleOpen}
            disabled={loading}
            className="bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Preparing…" : "Open in Dropbox Sign"}
          </button>
        </div>
      </div>
    </div>
  );
}
