/*
  Warnings:

  - A unique constraint covering the columns `[num_cpf]` on the table `pessoa` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[numero_cel]` on the table `pessoa` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[correio_eletronico]` on the table `pessoa` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "pessoa_num_cpf_key" ON "public"."pessoa"("num_cpf");

-- CreateIndex
CREATE UNIQUE INDEX "pessoa_numero_cel_key" ON "public"."pessoa"("numero_cel");

-- CreateIndex
CREATE UNIQUE INDEX "pessoa_correio_eletronico_key" ON "public"."pessoa"("correio_eletronico");
