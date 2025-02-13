-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'default name',
ADD COLUMN     "refreshToken" TEXT NOT NULL DEFAULT 'default token';
