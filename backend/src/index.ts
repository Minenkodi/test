import "dotenv/config";
import express from "express";
import cors from "cors";
import { quizRouter } from "./routes/quizzes";

const app = express();
const PORT = process.env.PORT ?? 4000;
const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:3000";

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/quizzes", quizRouter);

// Basic fallback error handler so malformed JSON bodies don't crash the process
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Unexpected server error" });
});

app.listen(PORT, () => {
  console.log(`Quiz Builder API listening on http://localhost:${PORT}`);
});
