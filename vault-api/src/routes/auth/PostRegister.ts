import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { prismaClient } from "../../db/client.js";
import type { AppContext } from "../../index.js";

export class PostRegister extends OpenAPIRoute {
  schema = {
    operationId: "PostRegister",
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              email: z.string().email(),
              passHash: z.string(),
              organisationName: z.string().min(1),
            }),
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const { email, passHash, organisationName } = data.body;

    const prisma = prismaClient(c);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return c.json({ confirm: false, error: "Email already registered" }, 409);
    }

    const org = await prisma.org.upsert({
      where: { name: organisationName },
      update: {},
      create: { name: organisationName },
    });

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: passHash,
        role: "ORG_USER",
        orgId: org.id,
      },
    });

    return c.json({ confirm: true, id: user.id }, 201);
  }
}
