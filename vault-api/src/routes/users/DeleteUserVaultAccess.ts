import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { prismaClient } from "../../db/client.js";
import type { AppContext } from "../../index.js";

export class DeleteUserVaultAccess extends OpenAPIRoute {
  schema = {
    operationId: "DeleteUserVaultAccess",
    request: {
      params: z.object({
        userId: z.uuidv7(),
        vaultId: z.uuidv7(),
      }),
    },
  };

  async handle(c: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const prisma = prismaClient(c);

    const deleted = await prisma.userVault.deleteMany({
      where: {
        userId: data.params.userId,
        vaultId: data.params.vaultId,
      },
    });

    return c.json({
      success: true,
      result: {
        removedCount: deleted.count,
      },
    });
  }
}