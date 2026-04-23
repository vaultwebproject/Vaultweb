import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { prismaClient } from "../../db/client.js";
import type { AppContext } from "../../index.js";

export class PostSubmitSecret extends OpenAPIRoute {
  schema = {
    operationId: "PostSubmitSecret",
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              userID: z.uuidv7(),
              vaultID: z.string(),
              name: z.string().min(1),
              submissionData: z.string().min(1),
              iv: z.string().min(1),
            }),
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const { userID, vaultID, name, submissionData, iv } = data.body;

    const prisma = prismaClient(c);


    const storedSubmissionData = JSON.stringify({
      iv,
      submissionData,
    });

    const item = await prisma.item.create({
      data: {
        name,
        submissionData: storedSubmissionData,
        vaultId: vaultID,
      },
    });

    return c.json({
      success: true,
      result: {
        item,
      },
    });

  }
}