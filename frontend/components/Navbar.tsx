import Link from "next/link";

export function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <Link href="/quizzes" className="text-lg font-semibold text-slate-900">
          Quiz Builder
        </Link>
        <nav className="flex gap-4 text-sm font-medium">
          <Link href="/quizzes" className="text-slate-600 hover:text-brand-600">
            All Quizzes
          </Link>
          <Link
            href="/create"
            className="rounded-md bg-brand-600 px-3 py-1.5 text-white hover:bg-brand-700"
          >
            + New Quiz
          </Link>
        </nav>
      </div>
    </header>
  );
}
