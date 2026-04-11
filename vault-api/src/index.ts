import { serve } from "@hono/node-server";
import { Hono, type Context } from "hono";
import { cors } from "hono/cors";
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { fromHono } from "chanfana";
import { GetVaultById } from "./routes/vault/GetVaultById.js";
import { PostLogin } from "./routes/auth/PostLogin.js";
import { GetUserById } from "./routes/users/GetUserById.js";

const app = new Hono();

app.use(cors({ origin: "http://localhost:5173" })); // Enable CORS for requests from the frontend running on localhost:5173

export type Env = {};
export type AppContext = Context<{ Bindings: Env }>;

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const openapi = fromHono(app);

openapi.get("/org/:orgId/vaults/:vaultId", GetVaultById);
openapi.post("/auth/login", PostLogin);
openapi.get("/users/:userId", GetUserById);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
