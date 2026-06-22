"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FolderPickerModal } from "@/components/FolderPickerModal";

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
  defaultFolder?: string;
}

export function DocumentsClient({ docs, defaultFolder }: Props) {
  const router = useRouter();
  const [dismissing, setDismissing] = useState<string | null>(null);
  const [scanning, setScanning] = useState<"gmail" | "drive" | "slack" | null>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [slackChannels, setSlackChannels] = useState<string[] | null>(null);
  const [signingDoc, setSigningDoc] = useState<Doc | null>(null);

  async function handleDismiss(id: string) {
    setDismissing(id);
    await fetch(`/api/documents/${id}/dismiss`, { method: "POST" });
    setDismissing(null);
    router.refresh();
  }

  async function handleScan(source: "gmail" | "drive" | "slack") {
    setScanning(source);
    setScanResult(null);
    setSlackChannels(null);
    const res = await fetch(`/api/monitor/${source}`, { method: "POST" });

    const data = await res.json();
    setScanning(null);
    if (res.ok) {
      setScanResult(`Found ${data.added} new document${data.added !== 1 ? "s" : ""}`);
      if (source === "slack" && data.channelsScanned) {
        setSlackChannels(data.channelsScanned);
      }
      router.refresh();
    } else {
      setScanResult(`Error: ${data.error}`);
    }
  }

  return (
    <div>
      {/* Folder picker modal */}
      {signingDoc && (
        <FolderPickerModal
          documentName={signingDoc.fileName}
          detectedDocId={signingDoc.id}
          defaultFolder={defaultFolder}
          onClose={() => setSigningDoc(null)}
          onSuccess={() => {
            setSigningDoc(null);
            setScanResult("✓ Dropbox Sign editor opened — add signers and send from there.");
            router.refresh();
          }}
        />
      )}

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
        <button
          onClick={() => handleScan("slack")}
          disabled={!!scanning}
          className="text-sm border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50 text-gray-600 disabled:opacity-50"
        >
          {scanning === "slack" ? "Scanning..." : "Scan Slack"}
        </button>
        {scanResult && <span className="text-sm text-gray-500">{scanResult}</span>}
      </div>

      {/* Slack channel list */}
      {slackChannels && (
        <div className="mb-5 bg-purple-50 border border-purple-100 rounded-lg px-4 py-3">
          <p className="text-xs font-medium text-purple-700 mb-2">
            Scanned {slackChannels.length} Slack channel{slackChannels.length !== 1 ? "s" : ""}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {slackChannels.map((ch) => (
              <span
                key={ch}
                className="px-2 py-0.5 bg-white border border-purple-200 text-purple-600 text-xs rounded-full font-mono"
              >
                #{ch}
              </span>
            ))}
          </div>
        </div>
      )}

      {docs.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-10 text-center">
          <p className="text-gray-500 text-sm">No documents detected yet.</p>
          <p className="text-gray-400 text-xs mt-1">
            Click &ldquo;Scan Gmail&rdquo;, &ldquo;Scan Drive&rdquo;, or &ldquo;Scan Slack&rdquo; to check for new documents.
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
                  Subject
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
                          : doc.source === "SLACK"
                          ? "bg-purple-50 text-purple-600"
                          : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      {doc.source === "GMAIL" ? "Gmail" : doc.source === "SLACK" ? "Slack" : "Drive"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <a
                      href={`/api/documents/${doc.id}/download`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate max-w-xs block"
                    >
                      {doc.fileName}
                    </a>
                  </td>
                  <td className="px-5 py-3 text-gray-500 hidden sm:table-cell max-w-xs truncate">
                    {doc.subject ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-gray-400 whitespace-nowrap hidden sm:table-cell">
                    {new Date(doc.detectedAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      {!doc.reviewed ? (
                        <button
                          onClick={() => setSigningDoc(doc)}
                          className="text-xs bg-blue-600 text-white px-2.5 py-1 rounded hover:bg-blue-700 whitespace-nowrap"
                        >
                          Open in Dropbox Sign
                        </button>
                      ) : (
                        <span className="text-xs text-green-600">Sent ✓</span>
                      )}
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
