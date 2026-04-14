import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { prismaClient } from "../../db/client.js";
import type { AppContext } from "../../index.js";

export class GetUserById extends OpenAPIRoute {
  schema = {
    operationId: "GetUserById",
    request: {
      params: z.object({
        userId: z.uuidv7(),
      }),
    },
  };

  async handle(c: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const prisma = prismaClient(c);

    const user = await prisma.user.findUnique({
      where: { id: data.params.userId },
      select: {
        id: true,
        email: true,
        role: true,
        orgId: true,
        createdAt: true,
      },
    });

    if (!user) {
      return c.json({ success: false, error: "User not found" }, 404);
    }

    return c.json({ success: true, result: { user } });
  }
}
