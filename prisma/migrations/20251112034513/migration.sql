/*
  Warnings:

  - You are about to drop the `auth` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `historico_otp` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `historico_senha` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `historico_session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `register_token` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "redes" AS ENUM ('WHATSAPP', 'TELEGRAM', 'FACEBOOK', 'LINKEDIN', 'URL');

-- CreateEnum
CREATE TYPE "status_veiculo" AS ENUM ('LIVRE', 'ALUGADO', 'INATIVO');

-- CreateEnum
CREATE TYPE "tipo_veiculo" AS ENUM ('MOTO', 'CARRO');

-- CreateEnum
CREATE TYPE "tipo_peca" AS ENUM ('PNEU', 'PASTILHA_FREIO', 'DISCO_FREIO', 'SAPATA_FREIO', 'EMBREAGEM_PLATO', 'EMBREAGEM_DISCO', 'EMBREAGEM_ROLAMENTO', 'MOLAS_EMBREAGEM', 'CORRENTE_TRANSMISSAO', 'COROA_TRANSMISSAO', 'PINHAO_TRANSMISSAO', 'CORREIA_DENTADA', 'CORREIA_ALTERNADOR', 'CORREIA_ACESSORIOS', 'VELA_IGNICAO', 'AMORTECEDOR', 'AMORTECEDOR_DIANTEIRO', 'AMORTECEDOR_TRASEIRO', 'BUCHA_SUSPENSAO', 'PIVO_SUSPENSAO', 'TERMINAL_DIRECAO', 'ROLAMENTO_DIRECAO', 'COXIM_MOTOR', 'COXIM_CAMBIO', 'BATERIA', 'ESCOVA_ALTERNADOR', 'ESCOVA_MOTOR_PARTIDA', 'LAMPADA', 'ROLAMENTO_RODA', 'CABO_EMBREAGEM', 'CABO_ACELERADOR', 'CABO_FREIO', 'FILTRO_AR', 'FILTRO_OLEO', 'FILTRO_COMBUSTIVEL', 'FILTRO_CABINE', 'CONSUMIVEL_OLEO_MOTOR', 'CONSUMIVEL_FLUIDO_FREIO', 'CONSUMIVEL_FLUIDO_ARREFECIMENTO', 'MANOPLA', 'PEDALEIRA');

-- DropForeignKey
ALTER TABLE "public"."historico_otp" DROP CONSTRAINT "historico_otp_uuid_fkey";

-- DropForeignKey
ALTER TABLE "public"."historico_senha" DROP CONSTRAINT "historico_senha_uuid_fkey";

-- DropForeignKey
ALTER TABLE "public"."historico_session" DROP CONSTRAINT "historico_session_uuid_auth_fkey";

-- DropTable
DROP TABLE "public"."auth";

-- DropTable
DROP TABLE "public"."historico_otp";

-- DropTable
DROP TABLE "public"."historico_senha";

-- DropTable
DROP TABLE "public"."historico_session";

-- DropTable
DROP TABLE "public"."register_token";

-- DropEnum
DROP TYPE "public"."Tipo_User";

-- CreateTable
CREATE TABLE "operador" (
    "uuid" TEXT NOT NULL,
    "nome_completo" TEXT NOT NULL,
    "num_cpf" TEXT NOT NULL,
    "num_cnpj" TEXT,
    "data_nascimento" TIMESTAMP(3),
    "correio_eletronico" TEXT NOT NULL,

    CONSTRAINT "operador_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "celular_operador" (
    "id" SERIAL NOT NULL,
    "num_cel" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "uuid_operador" TEXT NOT NULL,

    CONSTRAINT "celular_operador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "endereco_operador" (
    "id" SERIAL NOT NULL,
    "codigo_postal" TEXT NOT NULL,
    "numero_residencial" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "uuid_operador" TEXT NOT NULL,

    CONSTRAINT "endereco_operador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rede_social_operador" (
    "id" SERIAL NOT NULL,
    "uuid_operador" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "rede_social_operador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cliente" (
    "uuid" TEXT NOT NULL,
    "nome_completo" TEXT NOT NULL,
    "num_cpf" TEXT NOT NULL,
    "num_cnpj" TEXT,
    "data_nascimento" TIMESTAMP(3),
    "correio_eletronico" TEXT NOT NULL,
    "observacao" TEXT,
    "uuid_operador" TEXT NOT NULL,
    "data_contrato" TIMESTAMP(3) NOT NULL,
    "data_fim_contrato" TIMESTAMP(3),
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "celular_cliente" (
    "id" SERIAL NOT NULL,
    "num_cel" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "uuid_cliente" TEXT NOT NULL,

    CONSTRAINT "celular_cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "endereco_cliente" (
    "id" SERIAL NOT NULL,
    "codigo_postal" TEXT NOT NULL,
    "numero_residencial" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "uuid_cliente" TEXT NOT NULL,

    CONSTRAINT "endereco_cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rede_social_cliente" (
    "id" SERIAL NOT NULL,
    "uuid_cliente" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "rede_social_cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "veiculo" (
    "uuid" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "tipo" "tipo_veiculo" NOT NULL,
    "km" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valor_manutencao" DOUBLE PRECISION DEFAULT 0,
    "valor_seguro" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valor_aluguel" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "placa_veicular" TEXT,
    "renavam" TEXT,
    "chassi" TEXT,
    "status" "status_veiculo" NOT NULL DEFAULT 'LIVRE',
    "uuid_cliente" TEXT,
    "uuid_operador" TEXT NOT NULL,

    CONSTRAINT "veiculo_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "peca" (
    "id" SERIAL NOT NULL,
    "tipo" "tipo_peca" NOT NULL,
    "marca" TEXT NOT NULL,
    "km_troca" DOUBLE PRECISION NOT NULL,
    "preco_medio" DOUBLE PRECISION NOT NULL,
    "km_aviso" DOUBLE PRECISION NOT NULL,
    "logo" TEXT,
    "uuid_operador" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "peca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "veiculo_peca" (
    "id" SERIAL NOT NULL,
    "veiculo_uuid" TEXT NOT NULL,
    "peca_id" INTEGER NOT NULL,
    "km_registro" DOUBLE PRECISION NOT NULL,
    "data_ultima_troca" TIMESTAMP(3),

    CONSTRAINT "veiculo_peca_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "operador_uuid_key" ON "operador"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "operador_num_cpf_key" ON "operador"("num_cpf");

-- CreateIndex
CREATE UNIQUE INDEX "operador_correio_eletronico_key" ON "operador"("correio_eletronico");

-- CreateIndex
CREATE UNIQUE INDEX "celular_operador_num_cel_key" ON "celular_operador"("num_cel");

-- CreateIndex
CREATE UNIQUE INDEX "rede_social_operador_id_key" ON "rede_social_operador"("id");

-- CreateIndex
CREATE UNIQUE INDEX "cliente_uuid_key" ON "cliente"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "cliente_num_cpf_key" ON "cliente"("num_cpf");

-- CreateIndex
CREATE UNIQUE INDEX "cliente_correio_eletronico_key" ON "cliente"("correio_eletronico");

-- CreateIndex
CREATE UNIQUE INDEX "celular_cliente_num_cel_key" ON "celular_cliente"("num_cel");

-- CreateIndex
CREATE UNIQUE INDEX "rede_social_cliente_id_key" ON "rede_social_cliente"("id");

-- CreateIndex
CREATE UNIQUE INDEX "veiculo_uuid_key" ON "veiculo"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "peca_id_key" ON "peca"("id");

-- CreateIndex
CREATE UNIQUE INDEX "veiculo_peca_id_key" ON "veiculo_peca"("id");

-- AddForeignKey
ALTER TABLE "celular_operador" ADD CONSTRAINT "celular_operador_uuid_operador_fkey" FOREIGN KEY ("uuid_operador") REFERENCES "operador"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "endereco_operador" ADD CONSTRAINT "endereco_operador_uuid_operador_fkey" FOREIGN KEY ("uuid_operador") REFERENCES "operador"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rede_social_operador" ADD CONSTRAINT "rede_social_operador_uuid_operador_fkey" FOREIGN KEY ("uuid_operador") REFERENCES "operador"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cliente" ADD CONSTRAINT "cliente_uuid_operador_fkey" FOREIGN KEY ("uuid_operador") REFERENCES "operador"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "celular_cliente" ADD CONSTRAINT "celular_cliente_uuid_cliente_fkey" FOREIGN KEY ("uuid_cliente") REFERENCES "cliente"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "endereco_cliente" ADD CONSTRAINT "endereco_cliente_uuid_cliente_fkey" FOREIGN KEY ("uuid_cliente") REFERENCES "cliente"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rede_social_cliente" ADD CONSTRAINT "rede_social_cliente_uuid_cliente_fkey" FOREIGN KEY ("uuid_cliente") REFERENCES "cliente"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "veiculo" ADD CONSTRAINT "veiculo_uuid_cliente_fkey" FOREIGN KEY ("uuid_cliente") REFERENCES "cliente"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "veiculo" ADD CONSTRAINT "veiculo_uuid_operador_fkey" FOREIGN KEY ("uuid_operador") REFERENCES "operador"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peca" ADD CONSTRAINT "peca_uuid_operador_fkey" FOREIGN KEY ("uuid_operador") REFERENCES "operador"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "veiculo_peca" ADD CONSTRAINT "veiculo_peca_veiculo_uuid_fkey" FOREIGN KEY ("veiculo_uuid") REFERENCES "veiculo"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "veiculo_peca" ADD CONSTRAINT "veiculo_peca_peca_id_fkey" FOREIGN KEY ("peca_id") REFERENCES "peca"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
