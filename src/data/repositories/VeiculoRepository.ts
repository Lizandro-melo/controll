import { veiculo_info } from "@/domain/entities";
import IVeiculoRepository from "@/domain/repositories/IVeiculoRepository";
import { Prisma_logic } from "@/infra/db";
import { peca, veiculo, veiculo_peca } from "@prisma/logic";
import { log } from "console";
import moment from "moment-timezone";

export default class VeiculoRepository implements IVeiculoRepository {
  async update_veiculo_by_uuid_veiculo({
    veiculo_info,
    uuid_auth,
  }: {
    veiculo_info: veiculo_info;
    uuid_auth: string;
  }) {
    return await Prisma_logic.$transaction(async (prisma) => {
      let valor_manutencao = 0;

      await prisma.veiculo_peca.deleteMany({
        where: { veiculo_uuid: veiculo_info.veiculo.uuid },
      });

      for (const p of veiculo_info.pecas ?? []) {
        await prisma.veiculo_peca.create({
          data: {
            km_registro: parseFloat(
              (p.veiculo_peca.km_registro ?? 0).toString()
            ),
            data_ultima_troca: p.veiculo_peca.data_ultima_troca,
            status: p.veiculo_peca.status ?? true,
            peca_id: p.peca.id,
            veiculo_uuid: p.veiculo_peca.veiculo_uuid,
          },
        });
      }

      const veiculo_pecas = veiculo_info.pecas;

      for (const r of veiculo_pecas?.filter((p) => p.veiculo_peca.status) ??
        []) {
        const peca = await prisma.peca.findUnique({
          where: {
            id: r.peca.id,
          },
        });
        valor_manutencao += peca?.preco_medio ?? 0;
      }

      const cliente = await Prisma_logic.cliente.findFirst({
        where: {
          num_cpf: veiculo_info.cliente?.num_cpf,
          uuid_operador: uuid_auth,
        },
      });

      await prisma.veiculo.update({
        where: {
          uuid: veiculo_info.veiculo.uuid,
          uuid_operador: uuid_auth,
        },
        data: {
          modelo: veiculo_info.veiculo.modelo,
          marca: veiculo_info.veiculo.marca,
          tipo: veiculo_info.veiculo.tipo,
          km: Number(veiculo_info.veiculo.km),
          valor_manutencao,
          valor_seguro: Number(veiculo_info.veiculo.valor_seguro),
          valor_aluguel: Number(veiculo_info.veiculo.valor_aluguel),
          placa_veicular: veiculo_info.veiculo.placa_veicular,
          renavam: veiculo_info.veiculo.renavam,
          chassi: veiculo_info.veiculo.chassi,
          uuid_cliente: cliente?.uuid ?? null,
          status: cliente?.uuid ? "ALUGADO" : "LIVRE",
        },
      });
    });
  }
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
    const { cliente, veiculo_peca, veiculo } = await Prisma_logic.veiculo
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
          veiculo_peca: response.veiculo_peca,
          cliente: response.cliente,
        };
      })
      .catch(() => {
        throw new Error("Veiculo não encontrado");
      });
    const pecas = await Prisma_logic.veiculo_peca
      .findMany({
        where: {
          id: {
            in: veiculo_peca.map((p) => p.id),
          },
          status: true,
        },
        include: {
          peca: true,
        },
      })
      .then((response) => response);

    const result = pecas.map((p) => {
      return {
        veiculo_peca: { ...p },
        peca: p.peca,
      };
    });

    const props_cliente: {
      nome_completo: string;
      num_cpf: string;
      data_contrato: string;
      data_fim_contrato: string;
      total_pagar: number;
    } = {
      nome_completo: cliente?.nome_completo!,
      num_cpf: cliente?.num_cpf!,
      data_contrato: cliente?.data_contrato.toLocaleDateString()!,
      data_fim_contrato: cliente?.data_fim_contrato?.toLocaleDateString()!,
      total_pagar:
        veiculo?.valor_aluguel! *
        moment(veiculo?.cliente?.data_fim_contrato).diff(
          veiculo?.cliente?.data_contrato,
          "M"
        ),
    };

    return {
      cliente: props_cliente,
      pecas: result,
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
