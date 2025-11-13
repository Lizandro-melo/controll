
import { log } from "console";
import moment from "moment-timezone";
import type { NextApiRequest, NextApiResponse } from "next";
import { isCPF } from "validation-br";
import z, { success } from "zod";
import { cors } from "../_middlewares/cors";
import { register, response } from "@/domain/entities";
import { register_operador } from "@/domain/usecases/auth";

export default async function registerApi(
  req: NextApiRequest,
  res: NextApiResponse<response>,
  register: register,
) {
  if (cors(req, res)) return;
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const schemaRegister = z.object({
      nome_completo: z.string(),
      num_cpf: z.string(),
      num_cel: z.string(),
      correio_eletronico: z.email(),
      data_nascimento: z.string(),
      codigo_postal: z.string(),
      numero_residencial: z.string(),
      senha: z.string(),
      senha_confirmacao: z.string(),
    });
    try {
      register = z.parse(schemaRegister, req.body);
    } catch {
      throw new Error("Formulário invalido!");
    }
    await register_operador({ token: token!, register: register });
    res.status(200).json({
      result: null,
      m: "Você foi registrado com sucesso!",
      type: "sucess",
    });
  } catch (e: any) {
    console.error(e.message, moment.tz("America/Sao_Paulo").toDate());
    res.status(500).json({
      result: null,
      m: e.message,
      type: "error",
    });
  }
}
