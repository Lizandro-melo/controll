/*
  Warnings:

  - You are about to drop the column `Valor_aluguel` on the `veiculo` table. All the data in the column will be lost.
  - You are about to alter the column `valor_manutencao` on the `veiculo` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `valor_seguro` on the `veiculo` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "public"."veiculo" DROP COLUMN "Valor_aluguel",
ADD COLUMN     "valor_aluguel" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "valor_manutencao" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "valor_seguro" SET DATA TYPE DOUBLE PRECISION;
