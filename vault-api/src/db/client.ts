import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import type { AppContext } from "../index.js";
import { PrismaClient } from "../generated/prisma/client.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, "../../dev.db");

console.log("DB path:", dbPath);

export function prismaClient(_c: AppContext) {
  const adapter = new PrismaBetterSqlite3({ url: dbPath });
  const prisma = new PrismaClient({ adapter });

  return prisma;
}
