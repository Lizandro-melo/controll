import AuthRepository from "@/data/repositories/AuthRepository";
import { register } from "@/domain/entities";
import { ASSAS } from "@/infra/constants";
import { Tipo_User } from "@prisma/auth";
import { compare } from "bcrypt";
import { isCPF } from "validation-br";

const auth = new AuthRepository();

export async function register_operador({
  token,
  register,
}: {
  token: string;
  register: register;
}) {
  await auth.token_register_validation({ token });
  register.num_cpf = register.num_cpf.replaceAll(".", "").replace("-", "");
  if (!isCPF(register.num_cpf)) throw new Error("Numero de CPF invalido");
  if (register.senha !== register.senha_confirmacao)
    throw new Error("As senhas então diferentes!");
  await auth.create_operador(register);
  await auth.disable_token_register({ token });
}

export async function login({
  ...props
}: {
  login: string;
  senha: string;
}): Promise<string> {
  props.login = props.login.replaceAll(".", "").replace("-", "");
  const { uuid_auth, id_sub } = await auth.consult_uuid_auth_by_cpf({
    cpf: props.login,
  });
  await ASSAS.consult_sub(id_sub);
  if (
    await compare(
      props.senha,
      await auth.consult_senha_crypt_by_uuid({ uuid_auth }),
    )
  ) {
    let session = await auth.consult_session_by_uuid({ uuid_auth });
    if (!session) {
      session = await auth.generate_session_by_uuid({ uuid_auth });
    }
    return session;
  } else {
    throw new Error("Login ou senha inválidos");
  }
}

export async function session_consult({
  session,
}: {
  session: string;
}): Promise<Tipo_User | undefined> {
  const { uuid_auth, id_sub } = await auth.consult_uuid_auth_by_session({
    session,
  });
  await ASSAS.consult_sub(id_sub);
  return await auth.consult_tipo_user_by_uuid({ uuid_auth });
}
