/*
  Warnings:

  - You are about to drop the column `publicKey` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `vaultRole` on the `UserVault` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Org` will be added. If there are existing duplicate values, this will fail.
  - Made the column `orgId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orgId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_User" ("createdAt", "email", "id", "orgId", "passwordHash", "role", "updatedAt") SELECT "createdAt", "email", "id", "orgId", "passwordHash", "role", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_UserVault" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "vaultId" TEXT NOT NULL,
    "permCanCreateItems" BOOLEAN NOT NULL DEFAULT false,
    "permCanRemoveUserFromVault" BOOLEAN NOT NULL DEFAULT false,
    "permCanAddUserFromVault" BOOLEAN NOT NULL DEFAULT false,
    "wrappedKey" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserVault_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserVault_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES "Vault" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserVault" ("createdAt", "id", "permCanAddUserFromVault", "permCanCreateItems", "permCanRemoveUserFromVault", "updatedAt", "userId", "vaultId", "wrappedKey") SELECT "createdAt", "id", "permCanAddUserFromVault", "permCanCreateItems", "permCanRemoveUserFromVault", "updatedAt", "userId", "vaultId", "wrappedKey" FROM "UserVault";
DROP TABLE "UserVault";
ALTER TABLE "new_UserVault" RENAME TO "UserVault";
CREATE UNIQUE INDEX "UserVault_id_key" ON "UserVault"("id");
CREATE UNIQUE INDEX "UserVault_userId_vaultId_key" ON "UserVault"("userId", "vaultId");
CREATE TABLE "new_Vault" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "departmentId" TEXT,
    "currentDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Vault_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Vault" ("createdAt", "departmentId", "id", "name", "updatedAt") SELECT "createdAt", "departmentId", "id", "name", "updatedAt" FROM "Vault";
DROP TABLE "Vault";
ALTER TABLE "new_Vault" RENAME TO "Vault";
CREATE UNIQUE INDEX "Vault_id_key" ON "Vault"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Org_name_key" ON "Org"("name");
