import { auth, signOut } from "@/lib/auth";

export async function TopNav() {
  const session = await auth();

  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0">
      <div />
      <div className="flex items-center gap-4">
        {session?.user?.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={session.user.image}
            alt={session.user.name ?? ""}
            className="w-7 h-7 rounded-full"
          />
        )}
        <span className="text-sm text-gray-600">{session?.user?.name ?? session?.user?.email}</span>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button
            type="submit"
            className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
