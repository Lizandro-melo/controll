import { auth, pessoa, Tipo_User } from "@prisma/client";
import { PRISMA } from "../db";
import { log } from "console";
import moment from "moment-timezone";
import { DAYS_EXPIRE_SESSION } from "../constants";

export const consult_pessoa_uuid_by_cpf = async (
  cpf: string,
): Promise<string> => {
  return await PRISMA.pessoa
    .findUniqueOrThrow({ where: { num_cpf: cpf } })
    .then((response) => response?.uuid)
    .catch(() => {
      throw new Error("Login ou senha invalidos");
    });
};

export const consult_senhaCrypt_by_uuid = async (
  uuid: string,
): Promise<string> => {
  return await PRISMA.historico_senha
    .findFirstOrThrow({
      where: {
        uuid: uuid,
        status: true,
      },
    })
    .then(async (response) => response.senha)
    .catch(() => {
      throw new Error("Login ou senha invalidos");
    });
};

export const consult_session_by_uuid = async (
  uuid: string,
): Promise<string | undefined> => {
  return await PRISMA.historico_session
    .findMany({
      where: {
        uuid_auth: uuid,
      },
    })
    .then(
      (response) =>
        response.find(
          (log) =>
            moment()
              .tz("America/Sao_Paulo")
              .diff(moment(log.expira_time).tz("America/Sao_Paulo"), "d") <
            DAYS_EXPIRE_SESSION,
        )?.uuid,
    );
};

export const consult_uuid_auth_by_session = async (
  session: string,
): Promise<string | undefined> => {
  return await PRISMA.historico_session
    .findUniqueOrThrow({
      where: {
        uuid: session,
      },
    })
    .then((response) => {
      if (
        moment()
          .tz("America/Sao_Paulo")
          .diff(moment(response?.expira_time).tz("America/Sao_Paulo"), "d") <
        DAYS_EXPIRE_SESSION
      )
        return response?.uuid_auth;
    })
    .catch(() => {
      throw new Error("Sessão Invalida");
    });
};

export const consult_tipo_user_by_uuid = async (
  uuid: string,
): Promise<Tipo_User | undefined> => {
  return await PRISMA.auth
    .findUniqueOrThrow({
      where: {
        uuid: uuid,
      },
    })
    .then((response) => response?.role)
    .catch(() => {
      throw new Error("/");
    });
};
