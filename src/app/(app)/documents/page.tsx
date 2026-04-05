import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { DocumentsClient } from "./DocumentsClient";

export default async function DocumentsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const docs = userId
    ? await db.detectedDocument.findMany({
        where: { userId, dismissed: false },
        orderBy: { detectedAt: "desc" },
        take: 100,
      })
    : [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Detected Documents</h1>
          <p className="text-sm text-gray-500 mt-1">
            Documents found in your Gmail and Drive matching signing keywords.
          </p>
        </div>
        <ScanButtons />
      </div>

      <DocumentsClient docs={docs} />
    </div>
  );
}

function ScanButtons() {
  return (
    <div className="flex gap-2">
      <ScanButton source="gmail" label="Scan Gmail" />
      <ScanButton source="drive" label="Scan Drive" />
    </div>
  );
}

function ScanButton({ source, label }: { source: "gmail" | "drive"; label: string }) {
  return (
    <form
      action={async () => {
        "use server";
        const { auth } = await import("@/lib/auth");
        const session = await auth();
        if (!session) return;
        await fetch(`${process.env.NEXTAUTH_URL}/api/monitor/${source}`, {
          method: "POST",
          headers: { Cookie: "" }, // server action can't forward cookies easily
        });
      }}
    >
      <button
        type="submit"
        className="text-sm border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50 text-gray-600"
      >
        {label}
      </button>
    </form>
  );
}
