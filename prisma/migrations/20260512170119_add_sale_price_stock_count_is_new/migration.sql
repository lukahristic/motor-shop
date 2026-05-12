-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "isNew" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "salePrice" DECIMAL(10,2),
ADD COLUMN     "stockCount" INTEGER;
