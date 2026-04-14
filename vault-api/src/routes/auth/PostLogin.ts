import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { prismaClient } from "../../db/client.js";
import type { AppContext } from "../../index.js";

export class PostLogin extends OpenAPIRoute {
  schema = {
    operationId: "PostLogin",
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              email: z.string().email(),
              passHash: z.string(),
            }),
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    console.log(">PostLogin handle called");
    const data = await this.getValidatedData<typeof this.schema>(); // Validate and parse the request body according to the schema defined above.
    console.log(">body:", data.body);
    const { email, passHash } = data.body;

    const prisma = prismaClient(c);

    let user;
    try {
      user = await prisma.user.findUnique({ where: { email } }); // Tries to find the user in the database by their email.
    } catch (err) {
      console.error("Prisma error:", err);           // Log the error whether it's a prisma error or sqlite error.
      return c.json({ error: "DB error" }, 500);
    }

    console.log("DB hash:  ", user?.passwordHash); // Log the hash from the database and the hash received in the request for comparison.
    console.log("Received: ", passHash);
    console.log("Match:    ", user?.passwordHash === passHash);

    if (!user || user.passwordHash !== passHash) {
      return c.json({ confirm: false }, 401);
    }

    return c.json({ confirm: true, id: user.id });
  }
}
