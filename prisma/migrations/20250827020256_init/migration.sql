-- CreateEnum
CREATE TYPE "public"."Tipo_User" AS ENUM ('MASTER', 'USER');

-- CreateEnum
CREATE TYPE "public"."Tipo_Peca" AS ENUM ('PNEU', 'PASTILHA_FREIO', 'DISCO_FREIO', 'SAPATA_FREIO', 'EMBREAGEM_PLATO', 'EMBREAGEM_DISCO', 'EMBREAGEM_ROLAMENTO', 'MOLAS_EMBREAGEM', 'CORRENTE_TRANSMISSAO', 'COROA_TRANSMISSAO', 'PINHAO_TRANSMISSAO', 'CORREIA_DENTADA', 'CORREIA_ALTERNADOR', 'CORREIA_ACESSORIOS', 'VELA_IGNICAO', 'AMORTECEDOR', 'AMORTECEDOR_DIANTEIRO', 'AMORTECEDOR_TRASEIRO', 'BUCHA_SUSPENSAO', 'PIVO_SUSPENSAO', 'TERMINAL_DIRECAO', 'ROLAMENTO_DIRECAO', 'COXIM_MOTOR', 'COXIM_CAMBIO', 'BATERIA', 'ESCOVA_ALTERNADOR', 'ESCOVA_MOTOR_PARTIDA', 'LAMPADA', 'ROLAMENTO_RODA', 'CABO_EMBREAGEM', 'CABO_ACELERADOR', 'CABO_FREIO', 'FILTRO_AR', 'FILTRO_OLEO', 'FILTRO_COMBUSTIVEL', 'FILTRO_CABINE', 'CONSUMIVEL_OLEO_MOTOR', 'CONSUMIVEL_FLUIDO_FREIO', 'CONSUMIVEL_FLUIDO_ARREFECIMENTO', 'MANOPLA', 'PEDALEIRA');

-- AlterTable
ALTER TABLE "public"."auth" ADD COLUMN     "tipo" "public"."Tipo_User" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "public"."peca" (
    "id" SERIAL NOT NULL,
    "tipo" "public"."Tipo_Peca" NOT NULL,
    "marca" TEXT NOT NULL,
    "km_troca" DOUBLE PRECISION NOT NULL,
    "preco_medio" DOUBLE PRECISION NOT NULL,
    "km_aviso" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "peca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."veiculo_peca" (
    "id" SERIAL NOT NULL,
    "veiculo_uuid" TEXT NOT NULL,
    "peca_id" INTEGER NOT NULL,
    "km_registro" DOUBLE PRECISION NOT NULL,
    "data_ultima_troca" TIMESTAMP(3),

    CONSTRAINT "veiculo_peca_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "peca_id_key" ON "public"."peca"("id");

-- CreateIndex
CREATE UNIQUE INDEX "veiculo_peca_id_key" ON "public"."veiculo_peca"("id");

-- AddForeignKey
ALTER TABLE "public"."veiculo_peca" ADD CONSTRAINT "veiculo_peca_veiculo_uuid_fkey" FOREIGN KEY ("veiculo_uuid") REFERENCES "public"."veiculo"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."veiculo_peca" ADD CONSTRAINT "veiculo_peca_peca_id_fkey" FOREIGN KEY ("peca_id") REFERENCES "public"."peca"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
