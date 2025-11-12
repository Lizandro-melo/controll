import type { dash_data, response } from "@/utils/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { consult_uuid_auth_by_session } from "@/utils/server/service/consult";
import { create_peca } from "@/utils/server/service/create";

import { peca, pessoa } from "@prisma/client";
import { log } from "console";
import { cors } from "../_middlewares/cors";

export default async function ClienteApiCreate(
  req: NextApiRequest,
  res: NextApiResponse<response>,
) {
  try {
    if (cors(req, res)) return;
    const pessoa: pessoa = req.body;
    const session_key = req.headers.authorization?.replace("Bearer ", "");
    const { uuid } = await consult_uuid_auth_by_session(session_key!);
    await create_peca(peca, uuid);
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
