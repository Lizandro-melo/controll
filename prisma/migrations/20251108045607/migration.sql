/*
  Warnings:

  - A unique constraint covering the columns `[id_peca]` on the table `peca_operador` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "peca_operador_id_peca_key" ON "peca_operador"("id_peca");
