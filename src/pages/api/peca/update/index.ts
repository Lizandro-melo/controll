import type { NextApiRequest, NextApiResponse } from "next";

import { response } from "@/domain/entities";
import { updatePeca } from "@/domain/usecases/peca";
import { cors } from "../../_middlewares/cors";

export default async function veiculoApiFind(
  req: NextApiRequest,
  res: NextApiResponse<response>
) {
  if (cors(req, res)) return;
  try {
    const peca = req.body;
    const session = req.headers.authorization?.replace("Bearer ", "");
    await updatePeca({ session: session!, peca: peca });
    res.status(200).json({ m: "Peça atualizada", type: "sucess" });
  } catch (e: any) {
    res.status(403).json({ m: e.message, type: "error" });
  }
}
