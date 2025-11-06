/*
  Warnings:

  - You are about to drop the column `codigo_postal` on the `pessoa` table. All the data in the column will be lost.
  - You are about to drop the column `numero_cel` on the `pessoa` table. All the data in the column will be lost.
  - You are about to drop the column `numero_residencial` on the `pessoa` table. All the data in the column will be lost.
  - Made the column `nome_completo` on table `pessoa` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "public"."pessoa_numero_cel_key";

-- AlterTable
ALTER TABLE "auth" ADD COLUMN     "id_asaas" TEXT,
ADD COLUMN     "id_sub" TEXT;

-- AlterTable
ALTER TABLE "pessoa" DROP COLUMN "codigo_postal",
DROP COLUMN "numero_cel",
DROP COLUMN "numero_residencial",
ADD COLUMN     "observacao" TEXT,
ALTER COLUMN "data_nascimento" DROP NOT NULL,
ALTER COLUMN "nome_completo" SET NOT NULL;

-- CreateTable
CREATE TABLE "register_token" (
    "uuid" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "data_util" TIMESTAMP(3),

    CONSTRAINT "register_token_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "pessoa_telefone" (
    "id" SERIAL NOT NULL,
    "num_cel" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "uuid_pessoa" TEXT NOT NULL,

    CONSTRAINT "pessoa_telefone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pessoa_endereco" (
    "id" SERIAL NOT NULL,
    "codigo_postal" TEXT NOT NULL,
    "numero_residencial" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "uuid_pessoa" TEXT NOT NULL,

    CONSTRAINT "pessoa_endereco_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "register_token_uuid_key" ON "register_token"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "pessoa_telefone_num_cel_key" ON "pessoa_telefone"("num_cel");

-- AddForeignKey
ALTER TABLE "pessoa_telefone" ADD CONSTRAINT "pessoa_telefone_uuid_pessoa_fkey" FOREIGN KEY ("uuid_pessoa") REFERENCES "pessoa"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pessoa_endereco" ADD CONSTRAINT "pessoa_endereco_uuid_pessoa_fkey" FOREIGN KEY ("uuid_pessoa") REFERENCES "pessoa"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
