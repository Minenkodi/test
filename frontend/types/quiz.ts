export type QuestionType = "BOOLEAN" | "INPUT" | "CHECKBOX";

export interface QuestionDetail {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  answer: string | string[];
}

export interface QuizSummary {
  id: string;
  title: string;
  createdAt: string;
  questionCount: number;
}

export interface QuizDetail {
  id: string;
  title: string;
  createdAt: string;
  questions: QuestionDetail[];
}

// Shape used when building/submitting a new quiz from the form
export interface QuestionInput {
  text: string;
  type: QuestionType;
  answer: string | string[];
  options?: string[];
}

export interface CreateQuizInput {
  title: string;
  questions: QuestionInput[];
}
