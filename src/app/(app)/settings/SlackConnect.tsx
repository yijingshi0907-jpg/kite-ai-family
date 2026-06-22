"use client";

import { useState } from "react";

interface Props {
  isConnected: boolean;
  flashSuccess?: boolean;
  flashError?: string;
}

interface InviteResult {
  total: number;
  invited: string[];
  alreadyIn: string[];
  failed: string[];
}

interface RevokeResult {
  total: number;
  left: string[];
  failed: string[];
}

export function SlackConnect({ isConnected, flashSuccess, flashError }: Props) {
  const [inviting, setInviting] = useState(false);
  const [result, setResult] = useState<InviteResult | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [revoking, setRevoking] = useState(false);
  const [revokeResult, setRevokeResult] = useState<RevokeResult | null>(null);
  const [revokeError, setRevokeError] = useState<string | null>(null);

  async function handleRevokeBot() {
    if (!confirm("Remove the bot from all Slack channels it joined? You can re-invite it later.")) return;
    setRevoking(true);
    setRevokeResult(null);
    setRevokeError(null);

    const res = await fetch("/api/slack/revoke-bot", { method: "POST", signal: AbortSignal.timeout(120000) });
    const data = await res.json();
    setRevoking(false);

    if (res.ok) {
      setRevokeResult(data);
    } else {
      setRevokeError(data.error);
    }
  }

  async function handleInviteBot() {
    setInviting(true);
    setResult(null);
    setInviteError(null);

    const res = await fetch("/api/slack/invite-bot", { method: "POST" });
    const data = await res.json();
    setInviting(false);

    if (res.ok) {
      setResult(data);
    } else {
      setInviteError(data.error);
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-base font-medium text-gray-900">Slack Account</h2>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-gray-300"}`} />
          <span className="text-xs text-gray-500">{isConnected ? "Connected" : "Not connected"}</span>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Connect your personal Slack account to let the bot automatically join all your private channels.
      </p>

      {flashSuccess && (
        <div className="mb-3 text-sm text-green-600 bg-green-50 border border-green-100 rounded-md px-3 py-2">
          ✓ Slack account connected successfully!
        </div>
      )}
      {flashError && (
        <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
          Failed to connect Slack: {flashError}
        </div>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <a
          href="/api/auth/slack"
          className="inline-flex items-center gap-2 border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
            <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
          </svg>
          {isConnected ? "Reconnect Slack" : "Connect Slack Account"}
        </a>

        {isConnected && (
          <button
            onClick={handleInviteBot}
            disabled={inviting || revoking}
            className="inline-flex items-center gap-2 bg-purple-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {inviting ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Inviting...
              </>
            ) : (
              "Invite Bot to All Private Channels"
            )}
          </button>
        )}

        <button
          onClick={handleRevokeBot}
          disabled={revoking || inviting}
          className="inline-flex items-center gap-2 border border-red-200 text-red-600 rounded-md px-4 py-2 text-sm font-medium hover:bg-red-50 disabled:opacity-50 transition-colors"
        >
          {revoking ? (
            <>
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Removing...
            </>
          ) : (
            "Remove Bot from All Channels"
          )}
          {revoking && <span className="text-xs opacity-70">(may take up to 60s…)</span>}
        </button>
      </div>

      {inviteError && <p className="mt-3 text-sm text-red-600">{inviteError}</p>}
      {revokeError && <p className="mt-3 text-sm text-red-600">{revokeError}</p>}

      {revokeResult && (
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-700 font-medium">
            Bot removed from {revokeResult.left.length} of {revokeResult.total} channel{revokeResult.total !== 1 ? "s" : ""}
          </p>
          <div className="flex flex-wrap gap-1">
            {revokeResult.left.map((ch) => (
              <span key={ch} className="px-2 py-0.5 bg-gray-50 border border-gray-200 text-gray-500 text-xs rounded-full font-mono">
                #{ch}
              </span>
            ))}
          </div>
          {revokeResult.failed.length > 0 && (
            <p className="text-xs text-red-600">
              Failed to leave: {revokeResult.failed.map((c) => `#${c}`).join(", ")}
            </p>
          )}
        </div>
      )}

      {result && (
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-700 font-medium">
            Done — scanned {result.total} private channel{result.total !== 1 ? "s" : ""}
          </p>

          {result.invited.length > 0 && (
            <div>
              <p className="text-xs text-green-700 font-medium mb-1">
                ✓ Invited to {result.invited.length} channel{result.invited.length !== 1 ? "s" : ""}
              </p>
              <div className="flex flex-wrap gap-1">
                {result.invited.map((ch) => (
                  <span key={ch} className="px-2 py-0.5 bg-green-50 border border-green-200 text-green-700 text-xs rounded-full font-mono">
                    #{ch}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.alreadyIn.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">
                Already in {result.alreadyIn.length} channel{result.alreadyIn.length !== 1 ? "s" : ""}
              </p>
              <div className="flex flex-wrap gap-1">
                {result.alreadyIn.map((ch) => (
                  <span key={ch} className="px-2 py-0.5 bg-gray-50 border border-gray-200 text-gray-500 text-xs rounded-full font-mono">
                    #{ch}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.failed.length > 0 && (
            <div>
              <p className="text-xs text-red-600 font-medium mb-1">
                Failed for {result.failed.length} channel{result.failed.length !== 1 ? "s" : ""}
              </p>
              <div className="flex flex-wrap gap-1">
                {result.failed.map((ch) => (
                  <span key={ch} className="px-2 py-0.5 bg-red-50 border border-red-200 text-red-600 text-xs rounded-full font-mono">
                    #{ch}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
