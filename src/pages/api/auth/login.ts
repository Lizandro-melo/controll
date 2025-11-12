import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { consult_pessoa_uuid_by_cpf } from "@/utils/server/service/consult";
import { generate_session_by_uuid } from "@/utils/server/service/generate";
import { ASSAS } from "@/utils/server/constants";
import { response } from "@/utils/types";
import { cors } from "../_middlewares/cors";
import { login } from "@/domain/usecases/auth";

export default async function loginApi(
  req: NextApiRequest,
  res: NextApiResponse<response>,
  login_form: { login: string; senha: string },
) {
  if (cors(req, res)) return;
  const schemaLogin = z.object({
    login: z.string(),
    senha: z.string(),
  });
  try {
    login_form = z.parse(schemaLogin, req.body);
  } catch {
    throw new Error("Login ou senha inválidos");
  }
  try {
    const session = await login(login_form);
    res.status(200).json({ result: session, type: "sucess" });
  } catch (e: any) {
    res
      .status(400)
      .json({ result: null, m: "Login ou senha inválidos", type: "error" });
  }
}
