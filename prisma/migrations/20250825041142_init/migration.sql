-- DropForeignKey
ALTER TABLE "public"."veiculo" DROP CONSTRAINT "veiculo_pessoa_uuid_fkey";

-- AlterTable
ALTER TABLE "public"."veiculo" ALTER COLUMN "pessoa_uuid" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."veiculo" ADD CONSTRAINT "veiculo_pessoa_uuid_fkey" FOREIGN KEY ("pessoa_uuid") REFERENCES "public"."pessoa"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
