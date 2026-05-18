import { serve } from "@hono/node-server";
import { Hono, type Context } from "hono";
import { cors } from "hono/cors";
import { fromHono } from "chanfana";
import { authMiddleware } from "./middleware/auth.js";
import { GetVaultById } from "./routes/vault/GetVaultById.js";
import { PostLogin } from "./routes/auth/PostLogin.js";
import { PostRegister } from "./routes/auth/PostRegister.js";
import { GetUserById } from "./routes/users/GetUserById.js";

export type Env = {};
export type Variables = { userId: string; role: string };

const app = new Hono<{ Variables: Variables }>();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

export type AppContext = Context<{ Bindings: Env; Variables: Variables }>;

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

// Protected routes — JWT required
app.use("/org/*", authMiddleware);
app.use("/users/*", authMiddleware);

const openapi = fromHono(app);

// Public
openapi.post("/auth/login", PostLogin);
openapi.post("/createAccount", PostRegister);

// Protected
openapi.get("/org/:orgId/vaults/:vaultId", GetVaultById);
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
