import { QuestionDetail } from "@/types/quiz";

function typeLabel(type: QuestionDetail["type"]) {
  switch (type) {
    case "BOOLEAN":
      return "True / False";
    case "INPUT":
      return "Short answer";
    case "CHECKBOX":
      return "Multiple choice";
  }
}

export function QuestionView({ question, index }: { question: QuestionDetail; index: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <p className="font-medium text-slate-900">
          {index + 1}. {question.text}
        </p>
        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
          {typeLabel(question.type)}
        </span>
      </div>

      {question.type === "BOOLEAN" && (
        <div className="flex gap-4 text-sm text-slate-600">
          <span className={question.answer === "true" ? "font-semibold text-brand-600" : ""}>
            ○ True
          </span>
          <span className={question.answer === "false" ? "font-semibold text-brand-600" : ""}>
            ○ False
          </span>
        </div>
      )}

      {question.type === "INPUT" && (
        <p className="text-sm text-slate-600">
          Expected answer: <span className="font-medium text-slate-900">{question.answer}</span>
        </p>
      )}

      {question.type === "CHECKBOX" && (
        <ul className="flex flex-col gap-1 text-sm text-slate-600">
          {question.options?.map((option) => {
            const isCorrect = (question.answer as string[]).includes(option);
            return (
              <li key={option} className={isCorrect ? "font-semibold text-brand-600" : ""}>
                ☐ {option} {isCorrect && "✓"}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
