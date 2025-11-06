/*
  Warnings:

  - The values [CLIENTE] on the enum `Tipo_User` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `veiculo_auth` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Tipo_User_new" AS ENUM ('MASTER', 'ADMIN', 'OPERADOR');
ALTER TABLE "auth" ALTER COLUMN "role" TYPE "Tipo_User_new" USING ("role"::text::"Tipo_User_new");
ALTER TYPE "Tipo_User" RENAME TO "Tipo_User_old";
ALTER TYPE "Tipo_User_new" RENAME TO "Tipo_User";
DROP TYPE "public"."Tipo_User_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."veiculo_auth" DROP CONSTRAINT "veiculo_auth_uuid_auth_fkey";

-- DropForeignKey
ALTER TABLE "public"."veiculo_auth" DROP CONSTRAINT "veiculo_auth_uuid_veiculo_fkey";

-- DropTable
DROP TABLE "public"."veiculo_auth";

-- CreateTable
CREATE TABLE "cliente" (
    "uuid" TEXT NOT NULL,
    "uuid_pessoa" TEXT NOT NULL,

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "operador_cliente" (
    "id" SERIAL NOT NULL,
    "uuid_operador" TEXT NOT NULL,
    "uuid_cliente" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "operador_cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "veiculo_operador" (
    "id" SERIAL NOT NULL,
    "uuid_auth" TEXT NOT NULL,
    "uuid_veiculo" TEXT NOT NULL,

    CONSTRAINT "veiculo_operador_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cliente_uuid_key" ON "cliente"("uuid");

-- AddForeignKey
ALTER TABLE "cliente" ADD CONSTRAINT "cliente_uuid_pessoa_fkey" FOREIGN KEY ("uuid_pessoa") REFERENCES "pessoa"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operador_cliente" ADD CONSTRAINT "operador_cliente_uuid_cliente_fkey" FOREIGN KEY ("uuid_cliente") REFERENCES "cliente"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operador_cliente" ADD CONSTRAINT "operador_cliente_uuid_operador_fkey" FOREIGN KEY ("uuid_operador") REFERENCES "auth"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "veiculo_operador" ADD CONSTRAINT "veiculo_operador_uuid_auth_fkey" FOREIGN KEY ("uuid_auth") REFERENCES "auth"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "veiculo_operador" ADD CONSTRAINT "veiculo_operador_uuid_veiculo_fkey" FOREIGN KEY ("uuid_veiculo") REFERENCES "veiculo"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
