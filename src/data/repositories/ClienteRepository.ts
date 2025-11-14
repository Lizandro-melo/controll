import { create_cliente, find_cliente } from "@/domain/entities";
import IClienteRepository from "@/domain/repositories/IClienteRepository";
import { Prisma_auth, Prisma_logic } from "@/infra/db";
import moment from "moment-timezone";

export default class ClienteRepository implements IClienteRepository {
  async consult_cpf_cliente_by_uuid_cliente({
    num_cpf,
    uuid_auth,
  }: {
    num_cpf: string;
    uuid_auth: string;
  }): Promise<void> {
    await Prisma_logic.cliente
      .findFirstOrThrow({
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

  //   async consult_clientes_by_uuid_operador({ uuid_cliente, }: { uuid_cliente: string; }): Promise<find_cliente> {
  //       await
  //   }
  
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
