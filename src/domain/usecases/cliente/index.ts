import AuthRepository from "@/data/repositories/AuthRepository";
import ClienteRepository from "@/data/repositories/ClienteRepository";
import { create_cliente } from "@/domain/entities";
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
  } catch {
    throw new Error("Não foi possivel cadastrar o cliente");
  }
}
