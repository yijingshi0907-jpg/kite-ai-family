import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const [pendingCount, inProgressCount, completedCount, recentDocs] = userId
    ? await Promise.all([
        db.detectedDocument.count({
          where: { userId, dismissed: false, reviewed: false },
        }),
        db.signingRequest.count({
          where: { userId, status: { in: ["SENT", "IN_PROGRESS"] } },
        }),
        db.signingRequest.count({
          where: { userId, status: "COMPLETED" },
        }),
        db.detectedDocument.findMany({
          where: { userId, dismissed: false, reviewed: false },
          orderBy: { detectedAt: "desc" },
          take: 5,
        }),
      ])
    : [0, 0, 0, []];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back, {session?.user?.name?.split(" ")[0] ?? "there"}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Pending Review</p>
          <p className="text-3xl font-bold mt-1 text-yellow-600">{pendingCount}</p>
          <Link href="/documents" className="text-xs text-gray-400 hover:text-blue-600 mt-1 block">
            View all →
          </Link>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Awaiting Signature</p>
          <p className="text-3xl font-bold mt-1 text-blue-600">{inProgressCount}</p>
          <Link href="/requests" className="text-xs text-gray-400 hover:text-blue-600 mt-1 block">
            View all →
          </Link>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-3xl font-bold mt-1 text-green-600">{completedCount}</p>
        </div>
      </div>

      {/* Recent detected docs */}
      {recentDocs.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-700">Pending Review</h2>
            <Link href="/documents" className="text-xs text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-gray-100">
            {recentDocs.map((doc: { id: string; source: string; title: string; status: string; createdAt: Date }) => (
              <li key={doc.id} className="px-5 py-3 flex items-center gap-3">
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
                <span className="text-sm text-gray-800 flex-1 truncate">{doc.fileName}</span>
                {doc.subject && (
                  <span className="text-xs text-gray-400 truncate max-w-xs hidden sm:block">
                    {doc.subject}
                  </span>
                )}
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {new Date(doc.detectedAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <svg
            className="w-12 h-12 text-gray-300 mx-auto mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-gray-500 text-sm">No documents detected yet.</p>
          <p className="text-gray-400 text-xs mt-1">
            Configure your{" "}
            <Link href="/settings" className="text-blue-500 hover:underline">
              Drive folder and keywords
            </Link>{" "}
            to start monitoring.
          </p>
        </div>
      )}
    </div>
  );
}
