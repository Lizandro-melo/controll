import type { response } from "@/utils/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { isCPF } from "validation-br";
import { consult_pessoa_uuid_by_cpf } from "@/utils/server/service/consult";
import { generate_session_by_uuid } from "@/utils/server/service/generate";

export default async function login(
  req: NextApiRequest,
  res: NextApiResponse<response>,
) {
  const schemaLogin = z.object({
    login: z.string(),
    senha: z.string(),
  });
  const { login, senha } = z.parse(schemaLogin, req.body);
  // if (!isCPF(login))
  //   res.status(400).json({ result: "CPF invalido", type: "error" });
  const login_replace = login.replaceAll(".", "").replace("-", "");
  try {
    const uuid = await consult_pessoa_uuid_by_cpf(login_replace);
    const uuid_session = await generate_session_by_uuid(senha, uuid);
    res.status(200).json({ result: uuid_session, type: "sucess" });
  } catch (e: any) {
    res.status(400).json({ result: e.message, type: "error" });
  }
}
