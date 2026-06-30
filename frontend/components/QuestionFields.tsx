"use client";

import { Control, Controller, UseFormRegister } from "react-hook-form";
import { QuizFormValues } from "@/app/create/formTypes";

interface Props {
  index: number;
  control: Control<QuizFormValues>;
  register: UseFormRegister<QuizFormValues>;
  onRemove: () => void;
  canRemove: boolean;
}

export function QuestionFields({ index, control, register, onRemove, canRemove }: Props) {
  return (
    <Controller
      control={control}
      name={`questions.${index}.type`}
      render={({ field: typeField }) => (
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-start justify-between gap-3">
            <input
              {...register(`questions.${index}.text`)}
              placeholder={`Question ${index + 1} text`}
              className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
            {canRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="rounded-md p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                aria-label={`Remove question ${index + 1}`}
              >
                ✕
              </button>
            )}
          </div>

          <div className="mb-3 flex gap-2">
            {(["BOOLEAN", "INPUT", "CHECKBOX"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => typeField.onChange(type)}
                className={`rounded-md px-3 py-1 text-xs font-medium ${
                  typeField.value === type
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {type === "BOOLEAN" ? "True/False" : type === "INPUT" ? "Short Answer" : "Checkbox"}
              </button>
            ))}
          </div>

          {typeField.value === "BOOLEAN" && (
            <div className="flex gap-4 text-sm">
              <label className="flex items-center gap-1.5">
                <input type="radio" value="true" {...register(`questions.${index}.boolAnswer`)} />
                True
              </label>
              <label className="flex items-center gap-1.5">
                <input type="radio" value="false" {...register(`questions.${index}.boolAnswer`)} />
                False
              </label>
            </div>
          )}

          {typeField.value === "INPUT" && (
            <input
              {...register(`questions.${index}.inputAnswer`)}
              placeholder="Correct answer"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
          )}

          {typeField.value === "CHECKBOX" && (
            <CheckboxOptionsField index={index} control={control} register={register} />
          )}
        </div>
      )}
    />
  );
}

function CheckboxOptionsField({
  index,
  control,
  register,
}: {
  index: number;
  control: Control<QuizFormValues>;
  register: UseFormRegister<QuizFormValues>;
}) {
  return (
    <Controller
      control={control}
      name={`questions.${index}.options`}
      render={({ field }) => {
        const options = field.value ?? ["", ""];

        function updateOption(optIndex: number, value: string) {
          const next = [...options];
          next[optIndex] = value;
          field.onChange(next);
        }

        function addOption() {
          field.onChange([...options, ""]);
        }

        function removeOption(optIndex: number) {
          field.onChange(options.filter((_, i) => i !== optIndex));
        }

        return (
          <div className="flex flex-col gap-2">
            {options.map((option, optIndex) => (
              <div key={optIndex} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={option}
                  {...register(`questions.${index}.checkboxAnswer`)}
                />
                <input
                  value={option}
                  onChange={(e) => updateOption(optIndex, e.target.value)}
                  placeholder={`Option ${optIndex + 1}`}
                  className="flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(optIndex)}
                    className="text-slate-400 hover:text-red-600"
                    aria-label={`Remove option ${optIndex + 1}`}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addOption}
              className="self-start text-xs font-medium text-brand-600 hover:underline"
            >
              + Add option
            </button>
            <p className="text-xs text-slate-400">Check the box next to each correct option.</p>
          </div>
        );
      }}
    />
  );
}
