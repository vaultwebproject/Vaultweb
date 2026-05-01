import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { prismaClient } from "../../db/client.js";
import type { AppContext } from "../../index.js";

export class PostAddUserToVault extends OpenAPIRoute {
  schema = {
    operationId: "PostAddUserToVault",
    request: {
      params: z.object({
        userId: z.uuidv7(),
      }),
      body: {
        content: {
          "application/json": {
            schema: z.object({
              vaultId: z.uuidv7(),
              wrappedKey: z.string().min(1),
              permCanCreateItems: z.boolean().optional(),
              permCanAddUserFromVault: z.boolean().optional(),
              permCanRemoveUserFromVault: z.boolean().optional(),
            }),
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const prisma = prismaClient(c);

    const { userId } = data.params;
    const {
      vaultId,
      wrappedKey,
      permCanCreateItems = false,
      permCanAddUserFromVault = false,
      permCanRemoveUserFromVault = false,
    } = data.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return c.json({ success: false, error: "User not found" }, 404);
    }

    const vault = await prisma.vault.findUnique({ where: { id: vaultId } });
    if (!vault) {
      return c.json({ success: false, error: "Vault not found" }, 404);
    }

    const existing = await prisma.userVault.findFirst({
      where: {
        userId,
        vaultId,
      },
    });

    if (existing) {
      return c.json({ success: false, error: "User already has access to this vault" }, 409);
    }

    const userVault = await prisma.userVault.create({
      data: {
        userId,
        vaultId,
        wrappedKey,
        permCanCreateItems,
        permCanAddUserFromVault,
        permCanRemoveUserFromVault,
      },
    });

    return c.json({
      success: true,
      result: {
        userVault,
      },
    });
  }
}