import { PrismaClient } from "@prisma/client";

// A single shared Prisma instance, reused across the app instead of
// creating a new client per request.
export const prisma = new PrismaClient();
