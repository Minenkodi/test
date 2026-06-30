# Quiz Builder

A full-stack app for creating quizzes with True/False, short-answer, and
multiple-choice (checkbox) questions, listing all quizzes, and viewing a
single quiz in read-only detail.

```
quiz-builder/
├── backend/   # Express + TypeScript + Prisma (SQLite) API
└── frontend/  # Next.js (App Router) + TypeScript + Tailwind UI
```

## Tech stack

- **Backend:** Node.js, Express, TypeScript, Prisma ORM, SQLite, Zod (validation)
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, React Hook Form

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev --name init   # creates dev.db and applies the schema
npm run seed                          # optional: adds one sample quiz
npm run dev                           # starts the API on http://localhost:4000
```

The API uses SQLite by default, so there's no external database to install.
If you'd rather use PostgreSQL, change the `datasource` provider in
`backend/prisma/schema.prisma` to `postgresql` and point `DATABASE_URL` in
`.env` to your Postgres instance, then re-run the migrate command.

### Endpoints

| Method | Path           | Description                              |
| ------ | -------------- | ----------------------------------------- |
| POST   | /quizzes       | Create a quiz with its questions          |
| GET    | /quizzes       | List quizzes (title + question count)     |
| GET    | /quizzes/:id   | Full quiz detail, including questions     |
| DELETE | /quizzes/:id   | Delete a quiz                             |

## 2. Frontend setup

In a second terminal:

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev                           # starts the app on http://localhost:3000
```

Make sure the backend is running first — the frontend reads
`NEXT_PUBLIC_API_URL` (defaults to `http://localhost:4000`) from `.env.local`.

## 3. Creating a sample quiz

Either run `npm run seed` in `backend/` (see above), or use the UI:

1. Open `http://localhost:3000/create`
2. Enter a title, e.g. "JavaScript Basics"
3. Add a question, pick a type (True/False, Short Answer, or Checkbox)
4. For Checkbox questions, fill in at least two options and tick the
   correct one(s)
5. Click **Save Quiz** — you'll be redirected to the new quiz's detail page
6. Visit `/quizzes` to see it listed, or click the trash icon to delete it

## Linting & formatting

```bash
# backend
cd backend && npm run lint && npm run format

# frontend
cd frontend && npm run lint && npm run format
```

## Design notes

- Question `answer`/`options` are stored as JSON-encoded strings in SQLite
  (Prisma + SQLite has no native array/JSON column type) and are
  parsed back into real arrays/strings by the API before being sent to the
  client, so the frontend never deals with raw JSON strings.
- Question `type` is a plain `String` column rather than a Prisma `enum`,
  because Prisma's SQLite connector does not support enums. The allowed
  values (`BOOLEAN` / `INPUT` / `CHECKBOX`) are enforced at the application
  layer via Zod. Switching the datasource to PostgreSQL would let this be
  promoted to a real database enum.
- Validation happens both client-side (basic HTML `required` + form checks)
  and server-side via Zod, so malformed requests are rejected even if
  someone bypasses the UI.
- The quiz detail page renders questions in **read-only structural** mode
  (showing which option(s) are correct) rather than as a solvable quiz,
  per the assessment spec.
