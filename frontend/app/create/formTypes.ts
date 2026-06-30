import { QuestionType } from "@/types/quiz";

// The form keeps a separate field per answer "shape" (bool / input / checkbox)
// so React Hook Form's register/Controller calls stay simple, and we
// translate it into the API's CreateQuizInput on submit.
export interface QuestionFormValue {
  text: string;
  type: QuestionType;
  boolAnswer: "true" | "false";
  inputAnswer: string;
  options: string[];
  checkboxAnswer: string[];
}

export interface QuizFormValues {
  title: string;
  questions: QuestionFormValue[];
}

export const emptyQuestion: QuestionFormValue = {
  text: "",
  type: "BOOLEAN",
  boolAnswer: "true",
  inputAnswer: "",
  options: ["", ""],
  checkboxAnswer: [],
};
