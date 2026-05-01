import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { prismaClient } from "../../db/client.js";
import type { AppContext } from "../../index.js";

export class GetOrgUsers extends OpenAPIRoute {
  schema = {
    operationId: "GetOrgUsers",
    request: {
      params: z.object({
        orgId: z.uuidv7(),
      }),
    },
  };

  async handle(c: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const prisma = prismaClient(c);

    const users = await prisma.user.findMany({
      where: {
        orgId: data.params.orgId,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        userVaults: {
          select: {
            vault: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const formattedUsers = users.map((user: any) => ({
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        vaults: user.userVaults.map((uv: any) => uv.vault),
    }));

    return c.json({
      success: true,
      result: {
        users: formattedUsers,
      },
    });
  }
}