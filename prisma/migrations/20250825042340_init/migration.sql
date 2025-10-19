/*
  Warnings:

  - A unique constraint covering the columns `[codigo_registro]` on the table `auth` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "auth_codigo_registro_key" ON "public"."auth"("codigo_registro");
