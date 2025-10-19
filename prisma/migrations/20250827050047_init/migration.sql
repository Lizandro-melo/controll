/*
  Warnings:

  - You are about to drop the column `auth_uuid` on the `pessoa` table. All the data in the column will be lost.
  - You are about to drop the column `auth_uuid` on the `veiculo` table. All the data in the column will be lost.
  - You are about to drop the column `pessoa_uuid` on the `veiculo` table. All the data in the column will be lost.
  - Added the required column `operador_uuid` to the `peca` table without a default value. This is not possible if the table is not empty.
  - Added the required column `operador_uuid` to the `veiculo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."pessoa" DROP CONSTRAINT "pessoa_auth_uuid_fkey";

-- DropForeignKey
ALTER TABLE "public"."veiculo" DROP CONSTRAINT "veiculo_auth_uuid_fkey";

-- DropForeignKey
ALTER TABLE "public"."veiculo" DROP CONSTRAINT "veiculo_pessoa_uuid_fkey";

-- AlterTable
ALTER TABLE "public"."peca" ADD COLUMN     "logo" TEXT,
ADD COLUMN     "operador_uuid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."pessoa" DROP COLUMN "auth_uuid";

-- AlterTable
ALTER TABLE "public"."veiculo" DROP COLUMN "auth_uuid",
DROP COLUMN "pessoa_uuid",
ADD COLUMN     "operador_uuid" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."operador" (
    "uuid" TEXT NOT NULL,
    "redes" JSONB,
    "numero_celular_empresa" TEXT NOT NULL,
    "logo" TEXT,
    "cnpj" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "operador_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "public"."operador_cliente" (
    "id" SERIAL NOT NULL,
    "cliente_uuid" TEXT NOT NULL,
    "operador_uuid" TEXT NOT NULL,

    CONSTRAINT "operador_cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."veiculo_cliente" (
    "id" SERIAL NOT NULL,
    "cliente_uuid" TEXT NOT NULL,
    "veiculo_uuid" TEXT NOT NULL,

    CONSTRAINT "veiculo_cliente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "operador_uuid_key" ON "public"."operador"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "operador_cnpj_key" ON "public"."operador"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "operador_cliente_id_key" ON "public"."operador_cliente"("id");

-- CreateIndex
CREATE UNIQUE INDEX "veiculo_cliente_id_key" ON "public"."veiculo_cliente"("id");

-- AddForeignKey
ALTER TABLE "public"."pessoa" ADD CONSTRAINT "pessoa_uuid_fkey" FOREIGN KEY ("uuid") REFERENCES "public"."auth"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."operador" ADD CONSTRAINT "operador_uuid_fkey" FOREIGN KEY ("uuid") REFERENCES "public"."auth"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."operador_cliente" ADD CONSTRAINT "operador_cliente_cliente_uuid_fkey" FOREIGN KEY ("cliente_uuid") REFERENCES "public"."auth"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."operador_cliente" ADD CONSTRAINT "operador_cliente_operador_uuid_fkey" FOREIGN KEY ("operador_uuid") REFERENCES "public"."operador"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."veiculo_cliente" ADD CONSTRAINT "veiculo_cliente_cliente_uuid_fkey" FOREIGN KEY ("cliente_uuid") REFERENCES "public"."auth"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."veiculo_cliente" ADD CONSTRAINT "veiculo_cliente_veiculo_uuid_fkey" FOREIGN KEY ("veiculo_uuid") REFERENCES "public"."veiculo"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."veiculo" ADD CONSTRAINT "veiculo_operador_uuid_fkey" FOREIGN KEY ("operador_uuid") REFERENCES "public"."operador"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."peca" ADD CONSTRAINT "peca_operador_uuid_fkey" FOREIGN KEY ("operador_uuid") REFERENCES "public"."operador"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
