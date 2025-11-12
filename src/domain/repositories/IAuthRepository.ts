import { Tipo_User } from "@prisma/auth";
import { register } from "../entities";

export default interface IAuthRepository {
  token_register_validation({ token }: { token: string }): Promise<void>;
  create_operador({ ...props }: register): Promise<void>;
  disable_token_register({ token }: { token: string }): Promise<void>;
  consult_uuid_auth_by_cpf({
    cpf,
  }: {
    cpf: string;
  }): Promise<{ uuid_auth: string; id_sub: string; id_asaas: string }>;
  consult_uuid_auth_by_session({
    session,
  }: {
    session: string;
  }): Promise<{ uuid_auth: string; id_sub: string; id_asaas: string }>;
  generate_session_by_uuid({
    uuid_auth,
  }: {
    uuid_auth: string;
  }): Promise<string>;
  consult_senha_crypt_by_uuid({
    uuid_auth,
  }: {
    uuid_auth: string;
  }): Promise<string>;
  consult_session_by_uuid({
    uuid_auth,
  }: {
    uuid_auth: string;
  }): Promise<string>;
  consult_tipo_user_by_uuid({
    uuid_auth,
  }: {
    uuid_auth: string;
  }): Promise<Tipo_User | undefined>;
}
