import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function SettingsPage() {
  const session = await auth();
  const settings = session?.user?.id
    ? await db.userSettings.findUnique({ where: { userId: session.user.id } })
    : null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Configure your integrations and monitoring preferences.</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Slack */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-base font-medium text-gray-900 mb-1">Slack</h2>
          <p className="text-sm text-gray-500 mb-4">
            Connect Slack to receive signing links and monitor channels for documents.
          </p>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-gray-300" />
            <span className="text-sm text-gray-500">Not connected</span>
            <button className="ml-auto text-sm text-blue-600 hover:underline">Connect Slack</button>
          </div>
          {settings?.slackChannelName && (
            <p className="text-sm text-gray-600 mt-3">
              Posting to: <span className="font-medium">#{settings.slackChannelName}</span>
            </p>
          )}
        </div>

        {/* Google Drive */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-base font-medium text-gray-900 mb-1">Google Drive Folder</h2>
          <p className="text-sm text-gray-500 mb-4">
            Drop documents into this folder to automatically send them for signing.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Google Drive folder ID or URL"
              defaultValue={settings?.driveMonitorFolder ?? ""}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              readOnly
            />
            <button className="text-sm text-blue-600 hover:underline whitespace-nowrap">
              Change folder
            </button>
          </div>
        </div>

        {/* Keywords */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-base font-medium text-gray-900 mb-1">Detection Keywords</h2>
          <p className="text-sm text-gray-500 mb-4">
            Documents and messages containing these words will be flagged for signing.
          </p>
          <div className="flex flex-wrap gap-2">
            {(settings?.keywordsList ?? ["sign", "contract", "agreement"]).map((kw) => (
              <span
                key={kw}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                {kw}
              </span>
            ))}
          </div>
          <button className="mt-3 text-sm text-blue-600 hover:underline">Edit keywords</button>
        </div>

        {/* Google Account */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-base font-medium text-gray-900 mb-1">Google Account</h2>
          <p className="text-sm text-gray-500 mb-2">
            Signed in as <span className="font-medium">{session?.user?.email}</span>
          </p>
          <p className="text-xs text-gray-400">
            Gmail and Drive access granted via Google OAuth sign-in.
          </p>
        </div>
      </div>
    </div>
  );
}
