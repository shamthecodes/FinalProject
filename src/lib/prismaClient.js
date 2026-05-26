import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (import.meta.env.MODE !== "production") {
  // ← change process.env to import.meta.env
  globalForPrisma.prisma = prisma;
}
