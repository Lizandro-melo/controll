/*
  Warnings:

  - You are about to drop the `celular_cliente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `celular_operador` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cliente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `endereco_cliente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `endereco_operador` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `operador` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `peca` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rede_social_cliente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rede_social_operador` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `veiculo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `veiculo_peca` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Tipo_User" AS ENUM ('MASTER', 'ADMIN', 'OPERADOR', 'CLIENTE');

-- DropForeignKey
ALTER TABLE "public"."celular_cliente" DROP CONSTRAINT "celular_cliente_uuid_cliente_fkey";

-- DropForeignKey
ALTER TABLE "public"."celular_operador" DROP CONSTRAINT "celular_operador_uuid_operador_fkey";

-- DropForeignKey
ALTER TABLE "public"."cliente" DROP CONSTRAINT "cliente_uuid_operador_fkey";

-- DropForeignKey
ALTER TABLE "public"."endereco_cliente" DROP CONSTRAINT "endereco_cliente_uuid_cliente_fkey";

-- DropForeignKey
ALTER TABLE "public"."endereco_operador" DROP CONSTRAINT "endereco_operador_uuid_operador_fkey";

-- DropForeignKey
ALTER TABLE "public"."peca" DROP CONSTRAINT "peca_uuid_operador_fkey";

-- DropForeignKey
ALTER TABLE "public"."rede_social_cliente" DROP CONSTRAINT "rede_social_cliente_uuid_cliente_fkey";

-- DropForeignKey
ALTER TABLE "public"."rede_social_operador" DROP CONSTRAINT "rede_social_operador_uuid_operador_fkey";

-- DropForeignKey
ALTER TABLE "public"."veiculo" DROP CONSTRAINT "veiculo_uuid_cliente_fkey";

-- DropForeignKey
ALTER TABLE "public"."veiculo" DROP CONSTRAINT "veiculo_uuid_operador_fkey";

-- DropForeignKey
ALTER TABLE "public"."veiculo_peca" DROP CONSTRAINT "veiculo_peca_peca_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."veiculo_peca" DROP CONSTRAINT "veiculo_peca_veiculo_uuid_fkey";

-- DropTable
DROP TABLE "public"."celular_cliente";

-- DropTable
DROP TABLE "public"."celular_operador";

-- DropTable
DROP TABLE "public"."cliente";

-- DropTable
DROP TABLE "public"."endereco_cliente";

-- DropTable
DROP TABLE "public"."endereco_operador";

-- DropTable
DROP TABLE "public"."operador";

-- DropTable
DROP TABLE "public"."peca";

-- DropTable
DROP TABLE "public"."rede_social_cliente";

-- DropTable
DROP TABLE "public"."rede_social_operador";

-- DropTable
DROP TABLE "public"."veiculo";

-- DropTable
DROP TABLE "public"."veiculo_peca";

-- DropEnum
DROP TYPE "public"."redes";

-- DropEnum
DROP TYPE "public"."status_veiculo";

-- DropEnum
DROP TYPE "public"."tipo_peca";

-- DropEnum
DROP TYPE "public"."tipo_veiculo";

-- CreateTable
CREATE TABLE "register_token" (
    "uuid" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "data_util" TIMESTAMP(3),

    CONSTRAINT "register_token_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "auth" (
    "uuid" TEXT NOT NULL,
    "role" "Tipo_User" NOT NULL DEFAULT 'OPERADOR',
    "status" BOOLEAN NOT NULL DEFAULT true,
    "id_sub" TEXT,
    "id_asaas" TEXT,

    CONSTRAINT "auth_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "historico_session" (
    "uuid" TEXT NOT NULL,
    "uuid_auth" TEXT NOT NULL,
    "record_login" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expira_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "historico_session_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "historico_otp" (
    "uuid" TEXT NOT NULL,
    "code_otp" TEXT NOT NULL,
    "record_create" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historico_otp_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "historico_senha" (
    "uuid" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "record_update" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "historico_senha_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "register_token_uuid_key" ON "register_token"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "auth_uuid_key" ON "auth"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "historico_session_uuid_key" ON "historico_session"("uuid");

-- AddForeignKey
ALTER TABLE "historico_session" ADD CONSTRAINT "historico_session_uuid_auth_fkey" FOREIGN KEY ("uuid_auth") REFERENCES "auth"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_otp" ADD CONSTRAINT "historico_otp_uuid_fkey" FOREIGN KEY ("uuid") REFERENCES "auth"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_senha" ADD CONSTRAINT "historico_senha_uuid_fkey" FOREIGN KEY ("uuid") REFERENCES "auth"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
