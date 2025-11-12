-- CreateEnum
CREATE TYPE "Tipo_User" AS ENUM ('MASTER', 'ADMIN', 'OPERADOR', 'CLIENTE');

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
