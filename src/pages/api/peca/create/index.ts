import type { NextApiRequest, NextApiResponse } from "next";
import { consult_uuid_auth_by_session } from "@/utils/server/service/consult";
import { create_peca } from "@/utils/server/service/create";

import { peca } from "@prisma/logic";
import { log } from "console";

import { response } from "@/domain/entities";
import { cors } from "../../_middlewares/cors";
import { createPeca } from "@/domain/usecases/peca";

export default async function pecaApiCreate(
  req: NextApiRequest,
  res: NextApiResponse<response>
) {
  try {
    if (cors(req, res)) return;
    const peca: peca = req.body;
    const session = req.headers.authorization?.replace("Bearer ", "");
    await createPeca({ session: session!, peca: peca });
    res
      .status(200)
      .json({ result: null, m: "Peça criada com sucesso", type: "sucess" });
  } catch (e: any) {
    log(e.message);
    res
      .status(403)
      .json({ m: "Não foi possível cadastrar a peça", type: "error" });
  }
}
