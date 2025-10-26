-- CreateEnum
CREATE TYPE "public"."Tipo_User" AS ENUM ('MASTER', 'OPERADOR', 'CLIENTE');

-- CreateEnum
CREATE TYPE "public"."Status_Veiculo" AS ENUM ('LIVRE', 'ALUGADO');

-- CreateEnum
CREATE TYPE "public"."Tipo_Veiculo" AS ENUM ('MOTO', 'CARRO');

-- CreateEnum
CREATE TYPE "public"."Tipo_Peca" AS ENUM ('PNEU', 'PASTILHA_FREIO', 'DISCO_FREIO', 'SAPATA_FREIO', 'EMBREAGEM_PLATO', 'EMBREAGEM_DISCO', 'EMBREAGEM_ROLAMENTO', 'MOLAS_EMBREAGEM', 'CORRENTE_TRANSMISSAO', 'COROA_TRANSMISSAO', 'PINHAO_TRANSMISSAO', 'CORREIA_DENTADA', 'CORREIA_ALTERNADOR', 'CORREIA_ACESSORIOS', 'VELA_IGNICAO', 'AMORTECEDOR', 'AMORTECEDOR_DIANTEIRO', 'AMORTECEDOR_TRASEIRO', 'BUCHA_SUSPENSAO', 'PIVO_SUSPENSAO', 'TERMINAL_DIRECAO', 'ROLAMENTO_DIRECAO', 'COXIM_MOTOR', 'COXIM_CAMBIO', 'BATERIA', 'ESCOVA_ALTERNADOR', 'ESCOVA_MOTOR_PARTIDA', 'LAMPADA', 'ROLAMENTO_RODA', 'CABO_EMBREAGEM', 'CABO_ACELERADOR', 'CABO_FREIO', 'FILTRO_AR', 'FILTRO_OLEO', 'FILTRO_COMBUSTIVEL', 'FILTRO_CABINE', 'CONSUMIVEL_OLEO_MOTOR', 'CONSUMIVEL_FLUIDO_FREIO', 'CONSUMIVEL_FLUIDO_ARREFECIMENTO', 'MANOPLA', 'PEDALEIRA');

-- CreateTable
CREATE TABLE "public"."auth" (
    "uuid" TEXT NOT NULL,
    "role" "public"."Tipo_User" NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "auth_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "public"."historico_session" (
    "uuid" TEXT NOT NULL,
    "uuid_auth" TEXT NOT NULL,
    "record_login" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expira_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "historico_session_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "public"."historico_otp" (
    "uuid" TEXT NOT NULL,
    "code_otp" TEXT NOT NULL,
    "record_create" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historico_otp_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "public"."historico_senha" (
    "uuid" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "record_update" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "historico_senha_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "public"."pessoa" (
    "uuid" TEXT NOT NULL,
    "num_cpf" TEXT NOT NULL,
    "num_cnpj" TEXT,
    "data_nascimento" TEXT NOT NULL,
    "numero_cel" TEXT NOT NULL,
    "correio_eletronico" TEXT NOT NULL,
    "codigo_postal" TEXT NOT NULL,
    "numero_residencial" TEXT NOT NULL,
    "rede_social" JSONB,

    CONSTRAINT "pessoa_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "public"."veiculo" (
    "uuid" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "tipo" "public"."Tipo_Veiculo" NOT NULL,
    "km" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valor_manutencao" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valor_seguro" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valor_aluguel" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "placa_veicular" TEXT,
    "renavam" TEXT,
    "chassi" TEXT,
    "foto" TEXT,
    "status" "public"."Status_Veiculo" NOT NULL DEFAULT 'LIVRE',

    CONSTRAINT "veiculo_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "public"."peca" (
    "id" SERIAL NOT NULL,
    "tipo" "public"."Tipo_Peca" NOT NULL,
    "marca" TEXT NOT NULL,
    "km_troca" DOUBLE PRECISION NOT NULL,
    "preco_medio" DOUBLE PRECISION NOT NULL,
    "km_aviso" DOUBLE PRECISION NOT NULL,
    "logo" TEXT,

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
CREATE UNIQUE INDEX "auth_uuid_key" ON "public"."auth"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "historico_session_uuid_key" ON "public"."historico_session"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "pessoa_uuid_key" ON "public"."pessoa"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "veiculo_uuid_key" ON "public"."veiculo"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "peca_id_key" ON "public"."peca"("id");

-- CreateIndex
CREATE UNIQUE INDEX "veiculo_peca_id_key" ON "public"."veiculo_peca"("id");

-- AddForeignKey
ALTER TABLE "public"."historico_session" ADD CONSTRAINT "historico_session_uuid_auth_fkey" FOREIGN KEY ("uuid_auth") REFERENCES "public"."auth"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."historico_otp" ADD CONSTRAINT "historico_otp_uuid_fkey" FOREIGN KEY ("uuid") REFERENCES "public"."auth"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."historico_senha" ADD CONSTRAINT "historico_senha_uuid_fkey" FOREIGN KEY ("uuid") REFERENCES "public"."auth"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pessoa" ADD CONSTRAINT "pessoa_uuid_fkey" FOREIGN KEY ("uuid") REFERENCES "public"."auth"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."veiculo_peca" ADD CONSTRAINT "veiculo_peca_veiculo_uuid_fkey" FOREIGN KEY ("veiculo_uuid") REFERENCES "public"."veiculo"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."veiculo_peca" ADD CONSTRAINT "veiculo_peca_peca_id_fkey" FOREIGN KEY ("peca_id") REFERENCES "public"."peca"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
