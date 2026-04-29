import { Type } from "@sinclair/typebox";
import { OpenAPIRoute } from "chanfana";
import { prismaClient } from "../../db/client.js";
import type { AppContext } from "../../index.js";

export class PostAccount extends OpenAPIRoute {
  schema = {
    tags: ["Auth"],
    summary: "Register a new user and associate with an organization",
    request: {
      body: {
        content: {
          "application/json": {
            schema: Type.Object({
              email: Type.String({ format: "email" }),
              passwordHash: Type.String(),
              organisationName: Type.String(),
              role: Type.String({ default: "Member" }),
            }),
          },
        },
      },
    },
    responses: {
      "201": {
        description: "User and Organization successfully provisioned",
        content: {
          "application/json": {
            schema: Type.Object({
              confirm: Type.Boolean(),
              userId: Type.String(),
              message: Type.String(),
            }),
          },
        },
      },
      "400": { description: "Invalid input or User already exists" },
    },
  };

  async handle(c: AppContext) {
    console.log("> PostAccount handle called");
    
    // 1. Validate and parse the request body
    const data = await this.getValidatedData<typeof this.schema>();
    const { email, passwordHash, organisationName, role } = data.body;
    
    const prisma = prismaClient(c);

    try {
      // 2. Atomic Organisation Upsert (Find or Create)
      // Note: Adjust 'organisation' to 'org' if your Prisma model uses the shorter name
      const org = await prisma.organisation.upsert({
        where: { name: organisationName },
        update: {},
        create: { name: organisationName },
      });

      // 3. Create the User linked to the Org
      const user = await prisma.user.create({
        data: {
          email: email,
          passwordHash: passwordHash,
          role: role,
          organisationId: org.id,
        },
      });

      console.log(`> New User Created: ${email} for Org: ${organisationName}`);

      return c.json({
        confirm: true,
        userId: user.id,
        message: "Vault environment initialized."
      }, 201);

    } catch (err: any) {
      console.error("Account Creation Error:", err);
      
      // Handle Unique Constraint (User already exists)
      if (err.code === 'P2002') {
        return c.json({ confirm: false, error: "Identity already registered." }, 400);
      }
      
      return c.json({ confirm: false, error: "Database error during provisioning." }, 500);
    }
  }
}