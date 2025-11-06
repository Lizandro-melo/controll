import { ASSAS } from "@/utils/server/constants";
import { validation_token_register } from "@/utils/server/service/consult";
import {
  create_usuario,
  disable_token_register,
} from "@/utils/server/service/generate";
import { response } from "@/utils/types";
import { log } from "console";
import moment from "moment-timezone";
import type { NextApiRequest, NextApiResponse } from "next";
import { isCPF } from "validation-br";
import z, { success } from "zod";

export default async function registerApi(
  req: NextApiRequest,
  res: NextApiResponse<response>
) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    await validation_token_register(token!);
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
    const { ...props } = z.parse(schemaRegister, req.body);
    props.num_cpf = props.num_cpf.replaceAll(".", "").replace("-", "");
    if (props.senha !== props.senha_confirmacao)
      res.status(400).json({
        result: null,
        m: "As senhas então diferentes!",
        type: "error",
      });

    if (!isCPF(props.num_cpf))
      res
        .status(400)
        .json({ result: null, m: "CPF Invalido", type: "error" });
    await create_usuario(props);
    await disable_token_register(token!);
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
