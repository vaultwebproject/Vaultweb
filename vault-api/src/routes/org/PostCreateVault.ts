import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { prismaClient } from "../../db/client.js";
import type { AppContext } from "../../index.js";
import type { Prisma } from "../../generated/client.js";

export class PostCreateVault extends OpenAPIRoute {
  schema = {
    operationId: "PostCreateVault",
    request: {
      params: z.object({
        orgId: z.uuidv7(),
      }),
      body: {
        content: {
          "application/json": {
            schema: z.object({
              name: z.string().min(1),
              ownerUserId: z.uuidv7(),
              wrappedKey: z.string().min(1),
              departmentId: z.uuidv7(),
            }),
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const prisma = prismaClient(c);

    const { orgId } = data.params;
    const { name, ownerUserId, wrappedKey, departmentId } = data.body;

    const department = await prisma.department.findFirst({
      where: {
        id: departmentId,
        orgId,
      },
    });

    if (!department) {
      return c.json({ success: false, error: "Department not found in organisation" }, 404);
}

    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const vault = await tx.vault.create({
        data: {
          name,
          departmentId,
          active: true,
        },
      });

      await tx.userVault.create({
        data: {
          userId: ownerUserId,
          vaultId: vault.id,
          wrappedKey,
          permCanCreateItems: true,
          permCanAddUserFromVault: true,
          permCanRemoveUserFromVault: true,
        },
      });

      return vault;
    });

    return c.json({
      success: true,
      result: {
        vault: result,
      },
    });
  }
}