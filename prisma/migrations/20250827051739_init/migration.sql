/*
  Warnings:

  - You are about to drop the `registro` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."registro" DROP CONSTRAINT "registro_pessoa_uuid_fkey";

-- DropForeignKey
ALTER TABLE "public"."registro" DROP CONSTRAINT "registro_veiculo_uuid_fkey";

-- DropTable
DROP TABLE "public"."registro";
