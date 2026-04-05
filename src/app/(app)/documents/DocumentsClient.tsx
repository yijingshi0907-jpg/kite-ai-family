"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Doc {
  id: string;
  source: string;
  fileName: string;
  subject: string | null;
  fileUrl: string | null;
  detectedAt: Date;
  reviewed: boolean;
  dismissed: boolean;
}

interface Props {
  docs: Doc[];
}

export function DocumentsClient({ docs }: Props) {
  const router = useRouter();
  const [dismissing, setDismissing] = useState<string | null>(null);
  const [scanning, setScanning] = useState<"gmail" | "drive" | null>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);

  async function handleDismiss(id: string) {
    setDismissing(id);
    await fetch(`/api/documents/${id}/dismiss`, { method: "POST" });
    setDismissing(null);
    router.refresh();
  }

  async function handleScan(source: "gmail" | "drive") {
    setScanning(source);
    setScanResult(null);
    const res = await fetch(`/api/monitor/${source}`, { method: "POST" });
    const data = await res.json();
    setScanning(null);
    if (res.ok) {
      setScanResult(`Found ${data.added} new document${data.added !== 1 ? "s" : ""}`);
      router.refresh();
    } else {
      setScanResult(`Error: ${data.error}`);
    }
  }

  return (
    <div>
      {/* Scan buttons */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => handleScan("gmail")}
          disabled={!!scanning}
          className="text-sm border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50 text-gray-600 disabled:opacity-50"
        >
          {scanning === "gmail" ? "Scanning..." : "Scan Gmail"}
        </button>
        <button
          onClick={() => handleScan("drive")}
          disabled={!!scanning}
          className="text-sm border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50 text-gray-600 disabled:opacity-50"
        >
          {scanning === "drive" ? "Scanning..." : "Scan Drive"}
        </button>
        {scanResult && <span className="text-sm text-gray-500">{scanResult}</span>}
      </div>

      {docs.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-10 text-center">
          <p className="text-gray-500 text-sm">No documents detected yet.</p>
          <p className="text-gray-400 text-xs mt-1">
            Click &ldquo;Scan Gmail&rdquo; or &ldquo;Scan Drive&rdquo; to check for new documents.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Source</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">File</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 hidden sm:table-cell">
                  Subject / Context
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 hidden sm:table-cell">
                  Detected
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {docs.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                        doc.source === "GMAIL"
                          ? "bg-red-50 text-red-600"
                          : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      {doc.source === "GMAIL" ? "Gmail" : "Drive"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {doc.fileUrl ? (
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate max-w-xs block"
                      >
                        {doc.fileName}
                      </a>
                    ) : (
                      <span className="text-gray-700 truncate max-w-xs block">{doc.fileName}</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-gray-500 hidden sm:table-cell max-w-xs truncate">
                    {doc.subject ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-gray-400 whitespace-nowrap hidden sm:table-cell">
                    {new Date(doc.detectedAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button className="text-xs text-blue-600 hover:underline whitespace-nowrap">
                        Send for signing
                      </button>
                      <button
                        onClick={() => handleDismiss(doc.id)}
                        disabled={dismissing === doc.id}
                        className="text-xs text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      >
                        {dismissing === doc.id ? "..." : "Dismiss"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
