import { peca } from "@prisma/client";
import { PRISMA } from "../db";

export const update_peca_by_uuid_auth = async (peca: peca, uuid: string) => {
  const peca_result = await PRISMA.peca_operador
    .findUnique({
      where: {
        id_peca: peca.id,
        uuid_auth: uuid,
      },
      include: {
        peca: true,
      },
    })
    .then((response) => response?.peca);
  await PRISMA.peca.update({
    where: {
      id: peca_result?.id,
    },
    data: {
      ...peca,
    },
  });
};
