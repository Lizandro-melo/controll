import { cliente_info, create_cliente, find_cliente } from "@/domain/entities";
import IClienteRepository from "@/domain/repositories/IClienteRepository";
import { Prisma_auth, Prisma_logic } from "@/infra/db";
import moment from "moment-timezone";
import { veiculo } from "@prisma/logic";
import { log } from "console";

export default class ClienteRepository implements IClienteRepository {
  async update_cliente_info({
    info,
    uuid_auth,
  }: {
    info: cliente_info;
    uuid_auth: string;
  }): Promise<void> {
    await Prisma_logic.$transaction(async (prisma) => {
      log(info.telefones);
      await prisma.celular_cliente.deleteMany({
        where: { uuid_cliente: info.cliente.uuid },
      });

      for (const c of info.telefones) {
        await prisma.celular_cliente.create({
          data: {
            num_cel: c.num_cel,
            uuid_cliente: info.cliente.uuid,
            status: true,
          },
        });
      }

      await prisma.endereco_cliente.update({
        where: {
          id: info.enderecos[0].id,
        },
        data: info.enderecos[0],
      });
      await prisma.cliente.update({
        where: {
          uuid: info.cliente.uuid,
          uuid_operador: uuid_auth,
        },
        omit: {
          num_cpf: true,
        },
        data: {
          ...info.cliente,
          data_nascimento: moment(info.cliente.data_nascimento).toDate(),
          data_contrato: moment(info.cliente.data_contrato).toDate(),
          data_fim_contrato: moment(info.cliente.data_fim_contrato).toDate(),
        },
      });
    });
  }
  async consult_cliente_info_by_uuid_cliente({
    ...props
  }: {
    uuid_cliente: string;
    uuid_auth: string;
  }): Promise<cliente_info> {
    const cliente = await Prisma_logic.cliente
      .findUnique({
        where: {
          uuid: props.uuid_cliente,
          uuid_operador: props.uuid_auth,
        },
      })
      .then((r) => r);
    const veiculos: veiculo[] = await Prisma_logic.veiculo.findMany({
      where: {
        uuid_cliente: props.uuid_cliente,
      },
    });
    const celulares = await Prisma_logic.celular_cliente
      .findMany({
        where: {
          uuid_cliente: props.uuid_cliente,
        },
      })
      .then((c) => c);
    const enderecos = await Prisma_logic.endereco_cliente
      .findMany({
        where: {
          uuid_cliente: props.uuid_cliente,
        },
      })
      .then((e) => e);
    return {
      cliente: {
        ...cliente!,
        data_contrato: moment(cliente?.data_nascimento)
          .toDate()
          .toISOString()
          .split("T")[0],
        data_fim_contrato: moment(cliente?.data_nascimento)
          .toDate()
          .toISOString()
          .split("T")[0],
        data_nascimento: moment(cliente?.data_nascimento)
          .toDate()
          .toISOString()
          .split("T")[0],
      },
      telefones: celulares,
      enderecos: enderecos,
      veiculos_vinculados: veiculos ?? [],
    };
  }
  async consult_cpf_cliente_by_uuid_cliente({
    num_cpf,
    uuid_auth,
  }: {
    num_cpf: string;
    uuid_auth: string;
  }): Promise<void> {
    await Prisma_logic.cliente
      .findFirst({
        where: {
          num_cpf: num_cpf,
          uuid_operador: uuid_auth,
        },
      })
      .then((response) => {
        if (response)
          throw new Error("Você já tem cadastrado um cliente com esse CPF");
      });
  }

  async consult_clientes_by_uuid_operador({
    uuid_auth,
  }: {
    uuid_auth: string;
  }): Promise<find_cliente> {
    const clientes = await Prisma_logic.cliente
      .findMany({
        where: {
          uuid_operador: uuid_auth,
          status: true,
        },
      })
      .then((response) => response);

    const find_cliente: find_cliente = [];

    for (const c of clientes) {
      const celular = await Prisma_logic.celular_cliente.findFirst({
        where: {
          uuid_cliente: c.uuid,
        },
      });
      find_cliente.push({
        uuid: c.uuid,
        num_cpf: c.num_cpf,
        correio_eletronico: c.correio_eletronico,
        data_contrato: c.data_contrato.toLocaleDateString(),
        data_fim_contrato: c.data_fim_contrato?.toLocaleDateString() ?? "-",
        nome_completo: c.nome_completo,
        num_cel: celular?.num_cel!,
      });
    }
    return find_cliente;
  }

  async register_cliente({
    uuid_auth,
    create_cliente,
  }: {
    uuid_auth: string;
    create_cliente: create_cliente;
  }): Promise<void> {
    await Prisma_logic.$transaction(async () => {
      const auth = await Prisma_auth.auth.create({
        data: {
          role: "CLIENTE",
        },
      });
      await Prisma_logic.cliente.create({
        data: {
          uuid: auth.uuid,
          nome_completo: create_cliente.nome_completo,
          correio_eletronico: create_cliente.correio_eletronico,
          data_contrato: moment(create_cliente.data_contrato).toDate(),
          data_fim_contrato: moment(create_cliente.data_fim_contrato).toDate(),
          num_cpf: create_cliente.num_cpf,
          observacao: create_cliente.observacao,
          data_nascimento: moment(create_cliente.data_nascimento).toDate(),
          uuid_operador: uuid_auth,
        },
      });
      await Prisma_logic.celular_cliente.create({
        data: {
          num_cel: create_cliente.num_cel,
          uuid_cliente: auth.uuid,
        },
      });
      await Prisma_logic.endereco_cliente.create({
        data: {
          codigo_postal: create_cliente.codigo_postal,
          numero_residencial: create_cliente.numero_residencial,
          uuid_cliente: auth.uuid,
        },
      });
    });
  }
}
