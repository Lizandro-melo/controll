/*
  Warnings:

  - You are about to drop the `peca_auth` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."peca_auth" DROP CONSTRAINT "peca_auth_id_peca_fkey";

-- DropForeignKey
ALTER TABLE "public"."peca_auth" DROP CONSTRAINT "peca_auth_uuid_auth_fkey";

-- DropTable
DROP TABLE "public"."peca_auth";

-- CreateTable
CREATE TABLE "peca_operador" (
    "id" SERIAL NOT NULL,
    "uuid_auth" TEXT NOT NULL,
    "id_peca" INTEGER NOT NULL,

    CONSTRAINT "peca_operador_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "peca_operador" ADD CONSTRAINT "peca_operador_uuid_auth_fkey" FOREIGN KEY ("uuid_auth") REFERENCES "auth"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peca_operador" ADD CONSTRAINT "peca_operador_id_peca_fkey" FOREIGN KEY ("id_peca") REFERENCES "peca"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
