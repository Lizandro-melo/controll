import AuthRepository from "@/data/repositories/AuthRepository";
import ClienteRepository from "@/data/repositories/ClienteRepository";
import { cliente_info, create_cliente, find_cliente } from "@/domain/entities";
import { log } from "console";
import { isCPF } from "validation-br";

const auth_repository = new AuthRepository();
const cliente_repository = new ClienteRepository();

export async function createCliente({
  session,
  create_cliente,
}: {
  session: string;
  create_cliente: create_cliente;
}) {
  const { uuid_auth } = await auth_repository.consult_uuid_auth_by_session({
    session,
  });
  create_cliente.num_cpf = create_cliente.num_cpf
    .replaceAll(".", "")
    .replace("-", "");
  if (!isCPF(create_cliente.num_cpf)) throw new Error("Numero de CPF invalido");
  await cliente_repository.consult_cpf_cliente_by_uuid_cliente({
    num_cpf: create_cliente?.num_cpf,
    uuid_auth,
  });
  try {
    await cliente_repository.register_cliente({ uuid_auth, create_cliente });
  } catch (e) {
    throw new Error("Não foi possivel cadastrar o cliente");
  }
}

export async function findAllCliente({
  session,
}: {
  session: string;
}): Promise<find_cliente> {
  const { uuid_auth } = await auth_repository.consult_uuid_auth_by_session({
    session,
  });
  return await cliente_repository.consult_clientes_by_uuid_operador({
    uuid_auth,
  });
}

export async function findUniqueCliente({
  session,
  uuid_cliente,
}: {
  session: string;
  uuid_cliente: string;
}): Promise<cliente_info> {
  const { uuid_auth } = await auth_repository.consult_uuid_auth_by_session({
    session,
  });
  return await cliente_repository.consult_cliente_info_by_uuid_cliente({
    uuid_cliente,
    uuid_auth,
  });
}

export async function updateCliente({
  session,
  cliente_info,
}: {
  session: string;
  cliente_info: cliente_info;
}) {
  const { uuid_auth } = await auth_repository.consult_uuid_auth_by_session({
    session,
  });
  try {
    cliente_repository.update_cliente_info({
      info: cliente_info,
      uuid_auth: uuid_auth,
    });
  } catch {
    throw new Error("Não foi possivel atualizar os dados do cliente");
  }
}
