import { PRISMA } from "../db";
import moment from "moment-timezone";
import { compare } from "bcrypt";
import { consult_senhaCrypt_by_uuid, consult_session_by_uuid } from "./consult";
import { DAYS_EXPIRE_SESSION } from "../constants";
import { log } from "console";

export const generate_session_by_uuid = async (
  senha: string,
  uuid: string,
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
