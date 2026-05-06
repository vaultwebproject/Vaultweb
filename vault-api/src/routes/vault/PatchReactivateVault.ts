import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { prismaClient } from "../../db/client.js";
import type { AppContext } from "../../index.js";

export class PatchReactivateVault extends OpenAPIRoute {
  schema = {
    operationId: "PatchReactivateVault",
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

    const updatedVault = await prisma.vault.update({
      where: {
        id: data.params.vaultId,
      },
      data: {
        active: true,
      },
    });

    return c.json({
      success: true,
      result: {
        vault: updatedVault,
      },
    });
  }
}