import { serve } from "@hono/node-server";
import { Hono, type Context } from "hono";
import { cors } from "hono/cors";
import { PrismaClient } from "./generated/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { fromHono } from "chanfana";
import { GetVaultById } from "./routes/vault/GetVaultById.js";
import { PostLogin } from "./routes/auth/PostLogin.js";
import { PostRegister } from "./routes/auth/PostRegister.js";
import { GetUserById } from "./routes/users/GetUserById.js";
import { PostSubmitSecret } from "./routes/data/PostSubmitSecret.js";
import { GetUserData } from "./routes/data/GetUserData.js";
import { GetSecretByVault } from "./routes/data/GetSecretByVault.js";

import { GetOrgUsers } from "./routes/org/GetOrgUsers.js";
import { GetOrgVaults } from "./routes/org/GetOrgVaults.js";
import { PostCreateVault } from "./routes/org/PostCreateVault.js";
import { PostAddUserToVault } from "./routes/users/PostAddUserToVault.js";
import { DeleteUserVaultAccess } from "./routes/users/DeleteUserVaultAccess.js";
import { PatchDeactivateVault } from "./routes/vault/PatchDeactivateVault.js";

import { GetOrgDepartments } from "./routes/org/GetOrgDepartments.js";
import { PatchReactivateVault } from "./routes/vault/PatchReactivateVault.js";

const app = new Hono();

app.use(cors({ origin: "http://localhost:5173" })); // Enable CORS for requests from the frontend running on localhost:5173

export type Env = {};
export type AppContext = Context<{ Bindings: Env }>;

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const openapi = fromHono(app);

openapi.get("/org/:orgId/vaults/:vaultId", GetVaultById);
openapi.post("/auth/login", PostLogin); // PostLogin route to the OpenAPI router
openapi.post("/auth/register", PostRegister);
openapi.get("/users/:userId", GetUserById);

openapi.post("/data/submit", PostSubmitSecret);
openapi.get("/data/:userId", GetUserData);
openapi.get("/data/vault/:vaultId", GetSecretByVault);

openapi.get("/org/:orgId/users", GetOrgUsers);
openapi.get("/org/:orgId/vaults", GetOrgVaults);
openapi.post("/org/:orgId/vaults", PostCreateVault);

openapi.post("/users/:userId/vaults", PostAddUserToVault);
openapi.delete("/users/:userId/vaults/:vaultId", DeleteUserVaultAccess);

openapi.patch("/vaults/:vaultId/deactivate", PatchDeactivateVault);

openapi.get("/org/:orgId/departments", GetOrgDepartments);
openapi.patch("/vaults/:vaultId/reactivate", PatchReactivateVault);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
