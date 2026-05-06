import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { prismaClient } from "../../db/client.js";
import type { AppContext } from "../../index.js";

export class GetOrgDepartments extends OpenAPIRoute {
  schema = {
    operationId: "GetOrgDepartments",
    request: {
      params: z.object({
        orgId: z.uuidv7(),
      }),
    },
  };

  async handle(c: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const prisma = prismaClient(c);

    const departments = await prisma.department.findMany({
      where: {
        orgId: data.params.orgId,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return c.json({
      success: true,
      result: {
        departments,
      },
    });
  }
}