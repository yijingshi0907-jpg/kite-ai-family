"use client";

import { useEffect, useState } from "react";

interface Folder {
  path: string;
  name: string;
}

interface Props {
  isConnected: boolean;
  initialSaveFolder: string;
  flashSuccess?: boolean;
  flashError?: string;
}

export function DropboxConnect({ isConnected: initialConnected, initialSaveFolder, flashSuccess, flashError }: Props) {
  const [connected, setConnected] = useState(initialConnected);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [saveFolder, setSaveFolder] = useState(initialSaveFolder);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(flashError ?? "");
  const [success, setSuccess] = useState(flashSuccess ? "Dropbox connected!" : "");

  useEffect(() => {
    if (connected) loadFolders();
  }, [connected]);

  async function loadFolders(path = "") {
    setLoading(true);
    try {
      const res = await fetch(`/api/dropbox/folders?path=${encodeURIComponent(path)}`);
      const data = await res.json();
      if (res.ok) setFolders(data.folders);
      else setError(data.error);
    } catch {
      setError("Failed to load folders");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveFolder(path: string) {
    setSaveFolder(path);
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dropboxSaveFolder: path }),
      });
      setSuccess("Save folder updated");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Dropbox Storage</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Auto-save completed signed documents to a Dropbox folder.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {connected ? (
            <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full font-medium">
              ✓ Connected
            </span>
          ) : (
            <a
              href="/api/auth/dropbox"
              className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 font-medium"
            >
              Connect Dropbox
            </a>
          )}
        </div>
      </div>

      {connected && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Save signed documents to
          </label>
          {loading ? (
            <p className="text-xs text-gray-400">Loading folders…</p>
          ) : (
            <select
              value={saveFolder}
              onChange={(e) => handleSaveFolder(e.target.value)}
              disabled={saving}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:opacity-50"
            >
              <option value="">— No auto-save —</option>
              {folders.map((f) => (
                <option key={f.path} value={f.path}>
                  📁 {f.name}
                </option>
              ))}
            </select>
          )}
          <p className="text-xs text-gray-400 mt-1.5">
            When all signers complete, the PDF is automatically uploaded here.
          </p>
        </div>
      )}

      {success && <p className="text-xs text-green-600 mt-3">{success}</p>}
      {error && <p className="text-xs text-red-600 mt-3">{error}</p>}
    </div>
  );
}
