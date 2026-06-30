import { CreateQuizInput, QuizDetail, QuizSummary } from "@/types/quiz";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed with status ${res.status}`);
  }
  // DELETE returns 204 with no body
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json();
}

export async function fetchQuizzes(): Promise<QuizSummary[]> {
  const res = await fetch(`${API_URL}/quizzes`, { cache: "no-store" });
  return handleResponse<QuizSummary[]>(res);
}

export async function fetchQuiz(id: string): Promise<QuizDetail> {
  const res = await fetch(`${API_URL}/quizzes/${id}`, { cache: "no-store" });
  return handleResponse<QuizDetail>(res);
}

export async function createQuiz(input: CreateQuizInput): Promise<QuizDetail> {
  const res = await fetch(`${API_URL}/quizzes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<QuizDetail>(res);
}

export async function deleteQuiz(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/quizzes/${id}`, { method: "DELETE" });
  return handleResponse<void>(res);
}
