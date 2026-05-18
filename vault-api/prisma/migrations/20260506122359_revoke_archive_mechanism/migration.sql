-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Department" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Department_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Department" ("createdAt", "id", "name", "orgId", "updatedAt") SELECT "createdAt", "id", "name", "orgId", "updatedAt" FROM "Department";
DROP TABLE "Department";
ALTER TABLE "new_Department" RENAME TO "Department";
CREATE UNIQUE INDEX "Department_id_key" ON "Department"("id");
CREATE TABLE "new_Item" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "submissionData" TEXT NOT NULL,
    "vaultId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Item_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES "Vault" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Item" ("id", "name", "submissionData", "updatedAt", "vaultId") SELECT "id", "name", "submissionData", "updatedAt", "vaultId" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
CREATE UNIQUE INDEX "Item_id_key" ON "Item"("id");
CREATE TABLE "new_UserVault" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "vaultId" TEXT NOT NULL,
    "vaultRole" TEXT NOT NULL DEFAULT 'VIEWER',
    "accessStatus" TEXT NOT NULL DEFAULT 'ACTIVE',
    "wrappedKey" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserVault_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserVault_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES "Vault" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserVault" ("createdAt", "id", "updatedAt", "userId", "vaultId", "vaultRole", "wrappedKey") SELECT "createdAt", "id", "updatedAt", "userId", "vaultId", "vaultRole", "wrappedKey" FROM "UserVault";
DROP TABLE "UserVault";
ALTER TABLE "new_UserVault" RENAME TO "UserVault";
CREATE UNIQUE INDEX "UserVault_id_key" ON "UserVault"("id");
CREATE UNIQUE INDEX "UserVault_userId_vaultId_key" ON "UserVault"("userId", "vaultId");
CREATE TABLE "new_Vault" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "departmentId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
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
