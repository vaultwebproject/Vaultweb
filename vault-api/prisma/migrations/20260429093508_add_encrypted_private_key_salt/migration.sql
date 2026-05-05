-- AlterTable
ALTER TABLE "User" ADD COLUMN "encryptedPrivateKey" TEXT;
ALTER TABLE "User" ADD COLUMN "salt" TEXT;
