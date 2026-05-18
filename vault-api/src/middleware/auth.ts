import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";
import { getCookie } from "hono/cookie";
import type { Variables } from "../index.js";

export const authMiddleware = createMiddleware<{ Variables: Variables }>(
  async (c, next) => {
    const token = getCookie(c, "token");
    if (!token) return c.json({ error: "Unauthorized" }, 401);

    try {
      const payload = await verify(token, process.env.JWT_SECRET!, "HS256");
      c.set("userId", payload.userId as string);
      c.set("role", payload.role as string);
      await next();
    } catch {
      return c.json({ error: "Invalid token" }, 401);
    }
  }
);
