"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { QuizSummary } from "@/types/quiz";
import { deleteQuiz, fetchQuizzes } from "@/services/quizService";

export default function QuizListPage() {
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchQuizzes()
      .then(setQuizzes)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this quiz? This cannot be undone.")) return;

    setDeletingId(id);
    try {
      await deleteQuiz(id);
      setQuizzes((prev) => prev.filter((quiz) => quiz.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete quiz");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return <p className="text-slate-500">Loading quizzes…</p>;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">All Quizzes</h1>

      {error && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {quizzes.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
          No quizzes yet.{" "}
          <Link href="/create" className="text-brand-600 underline">
            Create the first one
          </Link>
          .
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {quizzes.map((quiz) => (
            <li
              key={quiz.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <Link href={`/quizzes/${quiz.id}`} className="flex-1">
                <p className="font-medium text-slate-900">{quiz.title}</p>
                <p className="text-sm text-slate-500">
                  {quiz.questionCount} question{quiz.questionCount === 1 ? "" : "s"}
                </p>
              </Link>
              <button
                aria-label={`Delete ${quiz.title}`}
                onClick={() => handleDelete(quiz.id)}
                disabled={deletingId === quiz.id}
                className="ml-4 rounded-md p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              >
                {deletingId === quiz.id ? "…" : "🗑"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
