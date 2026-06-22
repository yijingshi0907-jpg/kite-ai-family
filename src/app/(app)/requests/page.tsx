import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const STATUS_STYLES: Record<string, string> = {
  SENT: "bg-blue-50 text-blue-700",
  IN_PROGRESS: "bg-yellow-50 text-yellow-700",
  COMPLETED: "bg-green-50 text-green-700",
  DECLINED: "bg-red-50 text-red-700",
  EXPIRED: "bg-gray-100 text-gray-500",
  PENDING_REVIEW: "bg-gray-100 text-gray-500",
};

const STATUS_LABELS: Record<string, string> = {
  SENT: "Sent",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  DECLINED: "Declined",
  EXPIRED: "Expired",
  PENDING_REVIEW: "Pending Review",
};

export default async function RequestsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const requests = userId
    ? await db.signingRequest.findMany({
        where: { userId },
        orderBy: { sentAt: "desc" },
        take: 100,
      })
    : [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Signing Requests</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track all documents sent for signing.
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-10 text-center">
          <p className="text-gray-500 text-sm">No signing requests yet.</p>
          <p className="text-gray-400 text-xs mt-1">
            Go to Documents and click &ldquo;Send for Signing&rdquo; to get started.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Document</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 hidden sm:table-cell">
                  Signers
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 hidden sm:table-cell">
                  Sent
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map((req) => {
                const signers = (req.signers as Array<{ email: string; name: string }>) ?? [];
                return (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <span className="text-gray-800 font-medium truncate max-w-xs block">
                        {req.documentName}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                          STATUS_STYLES[req.status] ?? "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {STATUS_LABELS[req.status] ?? req.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <div className="space-y-0.5">
                        {signers.map((s) => (
                          <div key={s.email} className="text-xs text-gray-600">
                            {s.name}{" "}
                            <span className="text-gray-400">({s.email})</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs whitespace-nowrap hidden sm:table-cell">
                      {new Date(req.sentAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      {req.signingUrl && (
                        <a
                          href={req.signingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline whitespace-nowrap"
                        >
                          View link →
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
