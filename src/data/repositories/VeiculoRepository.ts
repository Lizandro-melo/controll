import { veiculo_info } from "@/domain/entities";
import IVeiculoRepository from "@/domain/repositories/IVeiculoRepository";
import { Prisma_logic } from "@/infra/db";
import { veiculo } from "@prisma/logic";

export default class VeiculoRepository implements IVeiculoRepository {
  async create_veiculo({
    veiculo,
    uuid_auth,
  }: {
    veiculo: veiculo;
    uuid_auth: string;
  }): Promise<void> {
    await Prisma_logic.veiculo.create({
      data: {
        ...veiculo,
        placa_veicular: veiculo.placa_veicular?.toUpperCase(),
        km: parseFloat(veiculo.km.toString()),
        valor_seguro: parseFloat(veiculo.valor_seguro.toString()),
        valor_aluguel: parseFloat(veiculo.valor_aluguel.toString()),
        uuid_operador: uuid_auth,
      },
    });
  }
  async consult_veiculo_info_by_uuid_veiculo({
    uuid_veiculo,
    uuid_auth,
  }: {
    uuid_veiculo: string;
    uuid_auth: string;
  }): Promise<veiculo_info> {
    const { cliente, pecas, veiculo } = await Prisma_logic.veiculo
      .findUniqueOrThrow({
        where: {
          uuid: uuid_veiculo,
          uuid_operador: uuid_auth,
        },
        include: {
          veiculo_peca: true,
          cliente: true,
        },
      })
      .then((response) => {
        return {
          veiculo: response,
          pecas: response.veiculo_peca,
          cliente: response.cliente,
        };
      })
      .catch(() => {
        throw new Error("Veiculo não encontrado");
      });

    return {
      cliente: cliente,
      pecas: pecas,
      veiculo: veiculo,
    };
  }
  async consult_veiculos_by_uuid_auth({
    uuid_auth,
  }: {
    uuid_auth: string;
  }): Promise<veiculo[]> {
    return await Prisma_logic.veiculo
      .findMany({
        where: {
          uuid_operador: uuid_auth,
        },
      })
      .then((v) => v.filter((v) => v.status !== "INATIVO"));
  }
}
