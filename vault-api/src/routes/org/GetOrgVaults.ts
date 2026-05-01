import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { prismaClient } from "../../db/client.js";
import type { AppContext } from "../../index.js";

export class GetOrgVaults extends OpenAPIRoute {
  schema = {
    operationId: "GetOrgVaults",
    request: {
      params: z.object({
        orgId: z.uuidv7(),
      }),
    },
  };

  async handle(c: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const prisma = prismaClient(c);

    const vaults = await prisma.vault.findMany({
      where: {
        userVaults: {
          some: {
            user: {
              orgId: data.params.orgId,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        currentDate: true,
        createdAt: true,
        updatedAt: true,
        userVaults: {
          select: {
            user: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    const formattedVaults = vaults.map((vault: any) => ({
      id: vault.id,
      name: vault.name,
      currentDate: vault.currentDate,
      createdAt: vault.createdAt,
      updatedAt: vault.updatedAt,
      users: vault.userVaults.map((uv: any) => uv.user),
    }));

    return c.json({
      success: true,
      result: {
        vaults: formattedVaults,
      },
    });
  }
}