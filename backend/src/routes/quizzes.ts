import { Router, Request, Response } from "express";
import { prisma } from "../prisma";
import { createQuizSchema } from "../validation";

export const quizRouter = Router();

// POST /quizzes - create a new quiz with its questions
quizRouter.post("/", async (req: Request, res: Response) => {
  const parsed = createQuizSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }

  const { title, questions } = parsed.data;

  try {
    const quiz = await prisma.quiz.create({
      data: {
        title,
        questions: {
          create: questions.map((question, index) => ({
            text: question.text,
            type: question.type,
            answer: Array.isArray(question.answer)
              ? JSON.stringify(question.answer)
              : question.answer,
            options: question.options ? JSON.stringify(question.options) : null,
            order: index,
          })),
        },
      },
      include: { questions: true },
    });

    return res.status(201).json(quiz);
  } catch (error) {
    console.error("Failed to create quiz", error);
    return res.status(500).json({ message: "Could not create quiz" });
  }
});

// GET /quizzes - list all quizzes with question counts only
quizRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { questions: true } } },
    });

    const result = quizzes.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      createdAt: quiz.createdAt,
      questionCount: quiz._count.questions,
    }));

    return res.json(result);
  } catch (error) {
    console.error("Failed to list quizzes", error);
    return res.status(500).json({ message: "Could not fetch quizzes" });
  }
});

// GET /quizzes/:id - full quiz detail, with options/answers parsed back to JSON
quizRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.id },
      include: { questions: { orderBy: { order: "asc" } } },
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const questions = quiz.questions.map((question) => ({
      id: question.id,
      text: question.text,
      type: question.type,
      options: question.options ? JSON.parse(question.options) : undefined,
      answer: question.type === "CHECKBOX" ? JSON.parse(question.answer) : question.answer,
    }));

    return res.json({ id: quiz.id, title: quiz.title, createdAt: quiz.createdAt, questions });
  } catch (error) {
    console.error("Failed to fetch quiz", error);
    return res.status(500).json({ message: "Could not fetch quiz" });
  }
});

// DELETE /quizzes/:id
quizRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const quiz = await prisma.quiz.findUnique({ where: { id: req.params.id } });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    await prisma.quiz.delete({ where: { id: req.params.id } });
    return res.status(204).send();
  } catch (error) {
    console.error("Failed to delete quiz", error);
    return res.status(500).json({ message: "Could not delete quiz" });
  }
});
