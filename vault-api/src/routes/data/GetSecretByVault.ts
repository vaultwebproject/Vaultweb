import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { prismaClient } from "../../db/client.js";
import type { AppContext } from "../../index.js";

export class GetSecretByVault extends OpenAPIRoute {
  schema = {
    operationId: "GetSecretByVault",
    request: {
      params: z.object({
        vaultId: z.uuidv7(),
      }),
    },
  };

  async handle(c: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const prisma = prismaClient(c);

    const items = await prisma.item.findMany({
      where: {
        vaultId: data.params.vaultId,
      },
    });

    if (items.length === 0) {
      return c.json(
        { success: false, error: "Vault not found" },
        404
      );
    }

    return c.json({
      success: true,
      result: {
        items,
      },
    });
  }
}