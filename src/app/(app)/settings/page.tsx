import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { SettingsForm } from "./SettingsForm";
import { DropboxConnect } from "./DropboxConnect";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ dropbox_connected?: string; dropbox_error?: string }>;
}) {
  const session = await auth();
  const userId = session?.user?.id;

  const [settings, user] = await Promise.all([
    userId ? db.userSettings.findUnique({ where: { userId } }) : null,
    userId ? db.user.findUnique({ where: { id: userId }, select: { dropboxToken: true } }) : null,
  ]);

  const params = await searchParams;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure your integrations and monitoring preferences.
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Dropbox Storage Connection */}
        <DropboxConnect
          isConnected={!!user?.dropboxToken}
          initialSaveFolder={settings?.dropboxSaveFolder ?? ""}
          flashSuccess={params.dropbox_connected === "1"}
          flashError={params.dropbox_error}
        />

        <SettingsForm
          initialDriveFolder={settings?.driveMonitorFolder ?? ""}
          initialKeywords={settings?.keywordsList ?? ["sign", "contract", "agreement"]}
          userEmail={session?.user?.email ?? ""}
          initialDropboxFolder={settings?.dropboxSignFolder ?? ""}
          initialRequesterEmail={settings?.dropboxSignRequesterEmail ?? "yijing.shi@zettablock.com"}
          initialCcEmail={settings?.dropboxSignCcEmail ?? ""}
        />
      </div>
    </div>
  );
}
