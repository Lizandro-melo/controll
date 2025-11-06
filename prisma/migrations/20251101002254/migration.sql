/*
  Warnings:

  - Added the required column `uuid_cliente` to the `veiculo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "veiculo" ADD COLUMN     "uuid_cliente" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "veiculo_auth" (
    "id" SERIAL NOT NULL,
    "uuid_auth" TEXT NOT NULL,
    "uuid_veiculo" TEXT NOT NULL,

    CONSTRAINT "veiculo_auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "peca_auth" (
    "id" SERIAL NOT NULL,
    "uuid_auth" TEXT NOT NULL,
    "id_peca" INTEGER NOT NULL,

    CONSTRAINT "peca_auth_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "veiculo_auth" ADD CONSTRAINT "veiculo_auth_uuid_auth_fkey" FOREIGN KEY ("uuid_auth") REFERENCES "auth"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "veiculo_auth" ADD CONSTRAINT "veiculo_auth_uuid_veiculo_fkey" FOREIGN KEY ("uuid_veiculo") REFERENCES "veiculo"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "veiculo" ADD CONSTRAINT "veiculo_uuid_cliente_fkey" FOREIGN KEY ("uuid_cliente") REFERENCES "pessoa"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peca_auth" ADD CONSTRAINT "peca_auth_uuid_auth_fkey" FOREIGN KEY ("uuid_auth") REFERENCES "auth"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peca_auth" ADD CONSTRAINT "peca_auth_id_peca_fkey" FOREIGN KEY ("id_peca") REFERENCES "peca"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
