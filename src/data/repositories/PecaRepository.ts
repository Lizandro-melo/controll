import IPecaRepository from "@/domain/repositories/IPecaRepository";
import { Prisma_logic } from "@/infra/db";
import { peca } from "@prisma/logic";

export default class PecaRepository implements IPecaRepository {
  async update_peca_by_uuid_auth({
    peca,
    uuid_auth,
  }: {
    peca: peca;
    uuid_auth: string;
  }): Promise<void> {
    await Prisma_logic.peca.update({
      where: {
        id: peca?.id,
        uuid_operador: uuid_auth,
      },
      data: {
        ...peca,
        vida_util: parseFloat((peca.vida_util! ?? 0).toString()),
        km_aviso: parseFloat((peca.km_aviso! ?? 0).toString()),
        km_troca: parseFloat((peca.km_troca! ?? 0).toString()),
        preco_medio: parseFloat(peca.preco_medio.toString().replace(",", ".")),
      },
    });
  }
  async create_peca({
    peca,
    uuid_auth,
  }: {
    peca: peca;
    uuid_auth: string;
  }): Promise<void> {
    Prisma_logic.$transaction(async (prisma) => {
      await prisma.peca.create({
        data: {
          ...peca,
          vida_util: parseFloat((peca.vida_util! ?? 0).toString()),
          km_aviso: parseFloat((peca.km_aviso! ?? 0).toString()),
          km_troca: parseFloat((peca.km_troca! ?? 0).toString()),
          preco_medio: parseFloat(
            peca.preco_medio.toString().replace(",", ".")
          ),
          uuid_operador: uuid_auth,
        },
      });
    });
  }
  async consult_pecas_by_uuid_auth({
    uuid_auth,
  }: {
    uuid_auth: string;
  }): Promise<peca[]> {
    return await Prisma_logic.peca
      .findMany({
        where: {
          uuid_operador: uuid_auth,
          status: true,
        },
      })
      .then((response) => {
        return response;
      });
  }
}
