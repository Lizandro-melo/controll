/*
  Warnings:

  - You are about to drop the column `rede_social` on the `pessoa` table. All the data in the column will be lost.
  - The `status` column on the `veiculo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `tipo` on the `peca` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `data_nascimento` on the `pessoa` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `tipo` on the `veiculo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."redes" AS ENUM ('WHATSAPP', 'TELEGRAM', 'FACEBOOK', 'LINKEDIN', 'URL');

-- CreateEnum
CREATE TYPE "public"."status_veiculo" AS ENUM ('LIVRE', 'ALUGADO');

-- CreateEnum
CREATE TYPE "public"."tipo_veiculo" AS ENUM ('MOTO', 'CARRO');

-- CreateEnum
CREATE TYPE "public"."tipo_peca" AS ENUM ('PNEU', 'PASTILHA_FREIO', 'DISCO_FREIO', 'SAPATA_FREIO', 'EMBREAGEM_PLATO', 'EMBREAGEM_DISCO', 'EMBREAGEM_ROLAMENTO', 'MOLAS_EMBREAGEM', 'CORRENTE_TRANSMISSAO', 'COROA_TRANSMISSAO', 'PINHAO_TRANSMISSAO', 'CORREIA_DENTADA', 'CORREIA_ALTERNADOR', 'CORREIA_ACESSORIOS', 'VELA_IGNICAO', 'AMORTECEDOR', 'AMORTECEDOR_DIANTEIRO', 'AMORTECEDOR_TRASEIRO', 'BUCHA_SUSPENSAO', 'PIVO_SUSPENSAO', 'TERMINAL_DIRECAO', 'ROLAMENTO_DIRECAO', 'COXIM_MOTOR', 'COXIM_CAMBIO', 'BATERIA', 'ESCOVA_ALTERNADOR', 'ESCOVA_MOTOR_PARTIDA', 'LAMPADA', 'ROLAMENTO_RODA', 'CABO_EMBREAGEM', 'CABO_ACELERADOR', 'CABO_FREIO', 'FILTRO_AR', 'FILTRO_OLEO', 'FILTRO_COMBUSTIVEL', 'FILTRO_CABINE', 'CONSUMIVEL_OLEO_MOTOR', 'CONSUMIVEL_FLUIDO_FREIO', 'CONSUMIVEL_FLUIDO_ARREFECIMENTO', 'MANOPLA', 'PEDALEIRA');

-- AlterEnum
ALTER TYPE "public"."Tipo_User" ADD VALUE 'ADMIN';

-- AlterTable
ALTER TABLE "public"."peca" DROP COLUMN "tipo",
ADD COLUMN     "tipo" "public"."tipo_peca" NOT NULL;

-- AlterTable
ALTER TABLE "public"."pessoa" DROP COLUMN "rede_social",
DROP COLUMN "data_nascimento",
ADD COLUMN     "data_nascimento" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."veiculo" DROP COLUMN "tipo",
ADD COLUMN     "tipo" "public"."tipo_veiculo" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."status_veiculo" NOT NULL DEFAULT 'LIVRE';

-- DropEnum
DROP TYPE "public"."Status_Veiculo";

-- DropEnum
DROP TYPE "public"."Tipo_Peca";

-- DropEnum
DROP TYPE "public"."Tipo_Veiculo";

-- CreateTable
CREATE TABLE "public"."rede_social" (
    "id" SERIAL NOT NULL,
    "uuid_pessoa" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "rede_social_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rede_social_id_key" ON "public"."rede_social"("id");

-- AddForeignKey
ALTER TABLE "public"."rede_social" ADD CONSTRAINT "rede_social_uuid_pessoa_fkey" FOREIGN KEY ("uuid_pessoa") REFERENCES "public"."pessoa"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
