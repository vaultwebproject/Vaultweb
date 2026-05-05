-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserVault" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "vaultId" TEXT NOT NULL,
    "vaultRole" TEXT NOT NULL DEFAULT 'VIEWER',
    "permCanCreateItems" BOOLEAN NOT NULL DEFAULT false,
    "permCanRemoveUserFromVault" BOOLEAN NOT NULL DEFAULT false,
    "permCanAddUserFromVault" BOOLEAN NOT NULL DEFAULT false,
    "wrappedKey" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserVault_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserVault_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES "Vault" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserVault" ("createdAt", "id", "updatedAt", "userId", "vaultId", "vaultRole", "wrappedKey") SELECT "createdAt", "id", "updatedAt", "userId", "vaultId", "vaultRole", "wrappedKey" FROM "UserVault";
DROP TABLE "UserVault";
ALTER TABLE "new_UserVault" RENAME TO "UserVault";
CREATE UNIQUE INDEX "UserVault_id_key" ON "UserVault"("id");
CREATE UNIQUE INDEX "UserVault_userId_vaultId_key" ON "UserVault"("userId", "vaultId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
