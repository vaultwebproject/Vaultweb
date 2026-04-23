import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { prismaClient } from "../../db/client.js";
import type { AppContext } from "../../index.js";

export class GetUserData extends OpenAPIRoute {
  schema = {
    operationId: "GetUserData",
    request: {
      params: z.object({
        userId: z.uuidv7(),
      }),
    },
  };

  async handle(c: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const prisma = prismaClient(c);

    const userVaults = await prisma.userVault.findMany({
      where: {
        userId: data.params.userId,
      },
      include: {
        vault: {
          include: {
            items: true,
          },
        },
      },
    });

    return c.json({
      success: true,
      result: {
        userVaults,
      },
    });

  }
}