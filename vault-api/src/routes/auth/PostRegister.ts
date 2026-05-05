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
              publicKey: z.string(),
              encryptedPrivateKey: z.string(),
              salt: z.string(),
            }),
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const { email, passHash, publicKey, encryptedPrivateKey, salt } = data.body;

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
        publicKey,
        encryptedPrivateKey,
        salt,
        role: UserRole.ORG_USER,
        orgId: undefined,
      },
    });

    return c.json({ confirm: true, id: user.id }, 201);
  }
}
