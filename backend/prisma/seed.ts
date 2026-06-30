import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.quiz.create({
    data: {
      title: "General Knowledge",
      questions: {
        create: [
          {
            text: "The sky is blue.",
            type: "BOOLEAN",
            answer: "true",
            order: 0,
          },
          {
            text: "What is the capital of France?",
            type: "INPUT",
            answer: "Paris",
            order: 1,
          },
          {
            text: "Which of these are programming languages?",
            type: "CHECKBOX",
            options: JSON.stringify(["JavaScript", "Python", "Banana", "HTML"]),
            answer: JSON.stringify(["JavaScript", "Python"]),
            order: 2,
          },
        ],
      },
    },
  });

  console.log("Seed data created.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
