import { PRISMA } from "../db";
import moment from "moment-timezone";
import { compare, hash } from "bcrypt";
import { consult_senhaCrypt_by_uuid, consult_session_by_uuid } from "./consult";
import {
  ASSAS,
  DAYS_EXPIRE_SESSION,
  SALT_ROUNDS,
  VALOR_SISTEMA,
} from "../constants";
import { register } from "@/utils/types";

export const generate_session_by_uuid = async (
  senha: string,
  uuid: string
): Promise<string> => {
  const consult_senha = await consult_senhaCrypt_by_uuid(uuid);
  if (await compare(senha, consult_senha)) {
    const consult_session = await consult_session_by_uuid(uuid);
    if (consult_session) return consult_session;
    return await PRISMA.historico_session
      .create({
        data: {
          uuid_auth: uuid,
          expira_time: moment()
            .tz("America/Sao_Paulo")
            .add(DAYS_EXPIRE_SESSION, "d")
            .format(),
        },
      })
      .then((response) => response.uuid);
  } else throw new Error("Login ou senha invalidos");
};

export const create_usuario = async (data: register) => {
  const id_asaas = await ASSAS.create_client({
    cpfCnpj: data.num_cpf,
    mobilePhone: data.num_cel,
    name: data.nome_completo,
    addressNumber: data.numero_residencial,
    email: data.correio_eletronico,
    postalCode: data.codigo_postal,
  });
  const id_sub = await ASSAS.create_assinatura(id_asaas);
  const uuid_auth = (
    await PRISMA.auth.create({
      data: {
        role: "OPERADOR",
        id_asaas: id_asaas,
        id_sub: id_sub,
      },
    })
  ).uuid;
  await PRISMA.historico_senha.create({
    data: {
      senha: await hash(data.senha, SALT_ROUNDS),
      uuid: uuid_auth,
    },
  });
  await PRISMA.pessoa.create({
    data: {
      uuid: uuid_auth,
      nome_completo: data.nome_completo,
      correio_eletronico: data.correio_eletronico,
      num_cpf: data.num_cpf,
      data_nascimento: moment(data.data_nascimento).toDate(),
    },
  });
  await PRISMA.pessoa_telefone.create({
    data: {
      uuid_pessoa: uuid_auth,
      num_cel: data.num_cel,
    },
  });
  await PRISMA.pessoa_endereco.create({
    data: {
      uuid_pessoa: uuid_auth,
      codigo_postal: data.codigo_postal,
      numero_residencial: data.numero_residencial,
    },
  });
};

export const disable_token_register = async (token: string) => {
  await PRISMA.register_token.update({
    where: {
      uuid: token,
      status: true,
    },
    data: { status: false },
  });
};
