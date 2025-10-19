-- CreateEnum
CREATE TYPE "public"."Tipo_veiculo" AS ENUM ('MOTO', 'CARRO');

-- CreateTable
CREATE TABLE "public"."auth" (
    "uuid" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "codigo_registro" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "auth_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "public"."pessoa" (
    "uuid" TEXT NOT NULL,
    "nome_completo" TEXT NOT NULL,
    "data_nascimento" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "numero_celular" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "foto" TEXT,
    "auth_uuid" TEXT NOT NULL,

    CONSTRAINT "pessoa_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "public"."veiculo" (
    "uuid" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "tipo" "public"."Tipo_veiculo" NOT NULL,
    "km" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valor_manutencao" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "valor_seguro" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "Valor_aluguel" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "pessoa_uuid" TEXT NOT NULL,
    "placa_veicular" TEXT,
    "renavam" TEXT,
    "chassi" TEXT,
    "foto" TEXT,
    "auth_uuid" TEXT NOT NULL,

    CONSTRAINT "veiculo_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "public"."registro" (
    "id" SERIAL NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "km_inicial" DOUBLE PRECISION NOT NULL,
    "km_final" DOUBLE PRECISION,
    "veiculo_uuid" TEXT NOT NULL,
    "pessoa_uuid" TEXT NOT NULL,

    CONSTRAINT "registro_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "auth_uuid_key" ON "public"."auth"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "pessoa_uuid_key" ON "public"."pessoa"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "veiculo_uuid_key" ON "public"."veiculo"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "registro_id_key" ON "public"."registro"("id");

-- AddForeignKey
ALTER TABLE "public"."pessoa" ADD CONSTRAINT "pessoa_auth_uuid_fkey" FOREIGN KEY ("auth_uuid") REFERENCES "public"."auth"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."veiculo" ADD CONSTRAINT "veiculo_pessoa_uuid_fkey" FOREIGN KEY ("pessoa_uuid") REFERENCES "public"."pessoa"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."veiculo" ADD CONSTRAINT "veiculo_auth_uuid_fkey" FOREIGN KEY ("auth_uuid") REFERENCES "public"."auth"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."registro" ADD CONSTRAINT "registro_veiculo_uuid_fkey" FOREIGN KEY ("veiculo_uuid") REFERENCES "public"."veiculo"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."registro" ADD CONSTRAINT "registro_pessoa_uuid_fkey" FOREIGN KEY ("pessoa_uuid") REFERENCES "public"."pessoa"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
