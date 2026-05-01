import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { prismaClient } from "../../db/client.js";
import type { AppContext } from "../../index.js";

export class PatchDeactivateVault extends OpenAPIRoute {
  schema = {
    operationId: "PatchDeactivateVault",
    request: {
      params: z.object({
        vaultId: z.uuidv7(),
      }),
    },
  };

  async handle(c: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const prisma = prismaClient(c);

    const vault = await prisma.vault.findUnique({
      where: {
        id: data.params.vaultId,
      },
    });

    if (!vault) {
      return c.json({ success: false, error: "Vault not found" }, 404);
    }

    const deleted = await prisma.userVault.deleteMany({
      where: {
        vaultId: data.params.vaultId,
      },
    });

    return c.json({
      success: true,
      result: {
        vaultId: data.params.vaultId,
        removedAccessCount: deleted.count,
      },
    });
  }
}