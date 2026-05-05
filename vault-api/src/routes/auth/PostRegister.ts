import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { prismaClient } from "../../db/client.js";
import type { AppContext } from "../../index.js";
import { UserRole } from "../../generated/prisma/client.js";

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

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return c.json({ confirm: false, error: "Email already registered" }, 409);
    }

    let org = await prisma.org.findFirst({
      where: { name: organisationName },
    });

    if (!org) {
      org = await prisma.org.create({
        data: { name: organisationName },
      });
    }

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: passHash,
        role: UserRole.ORG_USER,
        orgId: org.id,
      },
    });

    return c.json({ confirm: true, id: user.id }, 201);
  }
}