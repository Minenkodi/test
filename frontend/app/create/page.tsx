"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { QuestionFields } from "@/components/QuestionFields";
import { QuizFormValues, emptyQuestion } from "./formTypes";
import { createQuiz } from "@/services/quizService";
import { CreateQuizInput, QuestionInput } from "@/types/quiz";

export default function CreateQuizPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<QuizFormValues>({
    defaultValues: {
      title: "",
      questions: [emptyQuestion],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "questions" });

  function toApiPayload(values: QuizFormValues): CreateQuizInput {
    const questions: QuestionInput[] = values.questions.map((q) => {
      if (q.type === "BOOLEAN") {
        return { text: q.text, type: "BOOLEAN", answer: q.boolAnswer };
      }
      if (q.type === "INPUT") {
        return { text: q.text, type: "INPUT", answer: q.inputAnswer };
      }
      // CHECKBOX
      const cleanOptions = q.options.map((o) => o.trim()).filter(Boolean);
      return {
        text: q.text,
        type: "CHECKBOX",
        options: cleanOptions,
        answer: q.checkboxAnswer.filter((a) => cleanOptions.includes(a)),
      };
    });

    return { title: values.title, questions };
  }

  async function onSubmit(values: QuizFormValues) {
    setSubmitError(null);
    setSubmitting(true);
    try {
      const quiz = await createQuiz(toApiPayload(values));
      router.push(`/quizzes/${quiz.id}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to create quiz");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Create a Quiz</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <input
            {...register("title", { required: "Quiz title is required" })}
            placeholder="Quiz title"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-base font-medium focus:border-brand-500 focus:outline-none"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        {fields.map((field, index) => (
          <QuestionFields
            key={field.id}
            index={index}
            control={control}
            register={register}
            onRemove={() => remove(index)}
            canRemove={fields.length > 1}
          />
        ))}

        <button
          type="button"
          onClick={() => append(emptyQuestion)}
          className="self-start rounded-md border border-dashed border-brand-400 px-4 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50"
        >
          + Add question
        </button>

        {submitError && (
          <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{submitError}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 self-start rounded-md bg-brand-600 px-5 py-2 font-medium text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {submitting ? "Saving…" : "Save Quiz"}
        </button>
      </form>
    </div>
  );
}
