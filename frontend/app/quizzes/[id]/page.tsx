import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchQuiz } from "@/services/quizService";
import { QuestionView } from "@/components/QuestionView";

export default async function QuizDetailPage({ params }: { params: { id: string } }) {
  let quiz;
  try {
    quiz = await fetchQuiz(params.id);
  } catch {
    notFound();
  }

  return (
    <div>
      <Link href="/quizzes" className="mb-4 inline-block text-sm text-brand-600 hover:underline">
        ← Back to all quizzes
      </Link>

      <h1 className="mb-1 text-2xl font-bold text-slate-900">{quiz.title}</h1>
      <p className="mb-6 text-sm text-slate-500">
        {quiz.questions.length} question{quiz.questions.length === 1 ? "" : "s"}
      </p>

      <div className="flex flex-col gap-4">
        {quiz.questions.map((question, index) => (
          <QuestionView key={question.id} question={question} index={index} />
        ))}
      </div>
    </div>
  );
}
