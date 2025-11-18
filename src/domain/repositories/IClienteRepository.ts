import { cliente_info, create_cliente, find_cliente } from "../entities";
import { cliente } from "@prisma/logic";

export default interface IClienteRepository {
  register_cliente({
    uuid_auth,
    create_cliente,
  }: {
    uuid_auth: string;
    create_cliente: create_cliente;
  }): Promise<void>;
  consult_cpf_cliente_by_uuid_cliente({
    num_cpf,
    uuid_auth,
  }: {
    num_cpf: string;
    uuid_auth: string;
  }): Promise<void>;
  consult_clientes_by_uuid_operador({
    uuid_auth,
  }: {
    uuid_auth: string;
  }): Promise<find_cliente>;
  consult_cliente_info_by_uuid_cliente({
    ...props
  }: {
    uuid_cliente: string;
    uuid_auth: string;
  }): Promise<cliente_info>;
  update_cliente_info({
    info,
    uuid_auth,
  }: {
    info: cliente_info;
    uuid_auth: string;
  }): Promise<void>;
}


let numero = 0