import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage() {
  const session = await auth();
  const settings = session?.user?.id
    ? await db.userSettings.findUnique({ where: { userId: session.user.id } })
    : null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure your integrations and monitoring preferences.
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Slack — coming in Phase 3 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 opacity-60">
          <h2 className="text-base font-medium text-gray-900 mb-1">Slack</h2>
          <p className="text-sm text-gray-500 mb-4">
            Connect Slack to receive signing links and monitor channels for documents.
          </p>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-gray-300" />
            <span className="text-sm text-gray-500">Coming soon</span>
          </div>
        </div>

        {/* Interactive settings form */}
        <SettingsForm
          initialDriveFolder={settings?.driveMonitorFolder ?? ""}
          initialKeywords={settings?.keywordsList ?? ["sign", "contract", "agreement"]}
          userEmail={session?.user?.email ?? ""}
        />
      </div>
    </div>
  );
}
