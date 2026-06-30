import { z } from "zod";

// One schema, refined per question type, so the API rejects malformed
// payloads (e.g. a checkbox question with no options) before they hit the DB.
const baseQuestion = z.object({
  text: z.string().min(1, "Question text is required"),
  type: z.enum(["BOOLEAN", "INPUT", "CHECKBOX"]),
  answer: z.union([z.string(), z.array(z.string())]),
  options: z.array(z.string()).optional(),
});

export const questionSchema = baseQuestion.superRefine((data, ctx) => {
  if (data.type === "BOOLEAN") {
    if (data.answer !== "true" && data.answer !== "false") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Boolean answer must be 'true' or 'false'",
        path: ["answer"],
      });
    }
  }

  if (data.type === "INPUT") {
    if (typeof data.answer !== "string" || data.answer.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Input answer must be a non-empty string",
        path: ["answer"],
      });
    }
  }

  if (data.type === "CHECKBOX") {
    if (!data.options || data.options.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Checkbox questions need at least two options",
        path: ["options"],
      });
    }
    if (!Array.isArray(data.answer) || data.answer.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Checkbox answer must be a non-empty array of correct options",
        path: ["answer"],
      });
    }
  }
});

export const createQuizSchema = z.object({
  title: z.string().min(1, "Quiz title is required"),
  questions: z.array(questionSchema).min(1, "A quiz needs at least one question"),
});

export type CreateQuizInput = z.infer<typeof createQuizSchema>;
