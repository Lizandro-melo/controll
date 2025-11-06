/*
  Warnings:

  - You are about to drop the column `foto` on the `veiculo` table. All the data in the column will be lost.
  - Added the required column `marca` to the `veiculo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."veiculo" DROP CONSTRAINT "veiculo_uuid_cliente_fkey";

-- AlterTable
ALTER TABLE "auth" ALTER COLUMN "role" SET DEFAULT 'OPERADOR';

-- AlterTable
ALTER TABLE "veiculo" DROP COLUMN "foto",
ADD COLUMN     "marca" TEXT NOT NULL,
ALTER COLUMN "uuid_cliente" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "veiculo" ADD CONSTRAINT "veiculo_uuid_cliente_fkey" FOREIGN KEY ("uuid_cliente") REFERENCES "cliente"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
