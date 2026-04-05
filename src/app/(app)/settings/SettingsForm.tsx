"use client";

import { useState } from "react";

interface Props {
  initialDriveFolder: string;
  initialKeywords: string[];
  userEmail: string;
}

export function SettingsForm({ initialDriveFolder, initialKeywords, userEmail }: Props) {
  const [driveFolder, setDriveFolder] = useState(initialDriveFolder);
  const [keywords, setKeywords] = useState(initialKeywords.join(", "));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaved(false);

    const keywordsList = keywords
      .split(",")
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);

    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ driveMonitorFolder: driveFolder, keywordsList }),
    });

    setSaving(false);

    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      const data = await res.json();
      setError(data.error ?? "Failed to save");
    }
  }

  return (
    <>
      {/* Google Drive */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-base font-medium text-gray-900 mb-1">Google Drive Folder</h2>
        <p className="text-sm text-gray-500 mb-4">
          Files added to this folder will be monitored for signing keywords.
          Paste the folder ID from the Drive URL:{" "}
          <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
            drive.google.com/drive/folders/<strong>FOLDER_ID</strong>
          </code>
        </p>
        <input
          type="text"
          placeholder="e.g. 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms"
          value={driveFolder}
          onChange={(e) => setDriveFolder(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Keywords */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-base font-medium text-gray-900 mb-1">Detection Keywords</h2>
        <p className="text-sm text-gray-500 mb-4">
          Emails and Drive files containing these words (in subject AND body) will be flagged.
          Comma-separated.
        </p>
        <input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="sign, contract, agreement"
        />
        <div className="flex flex-wrap gap-2 mt-3">
          {keywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean)
            .map((kw) => (
              <span key={kw} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                {kw}
              </span>
            ))}
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
        {saved && <span className="text-sm text-green-600">✓ Saved</span>}
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>

      {/* Google Account */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-base font-medium text-gray-900 mb-1">Google Account</h2>
        <p className="text-sm text-gray-500 mb-2">
          Signed in as <span className="font-medium">{userEmail}</span>
        </p>
        <p className="text-xs text-gray-400">
          Gmail (read-only) and Google Drive (read-only) access granted via sign-in.
        </p>
      </div>
    </>
  );
}
