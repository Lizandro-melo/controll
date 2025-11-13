import type { NextApiRequest, NextApiResponse } from "next";
import {
  consult_peca_by_id,
  consult_uuid_auth_by_session,
  consult_veiculo_info_by_uuid_veiculo,
  consult_veiculos_by_uuid_auth,
} from "@/utils/server/service/consult";
import { peca, veiculo } from "@prisma/client";
import { log } from "console";
import { cors } from "../../_middlewares/cors";
import { update_peca_by_uuid_auth } from "@/utils/server/service/update";
import { response } from "@/domain/entities";
import { updatePeca } from "@/domain/usecases/peca";

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
    log(e.message);
    res.status(403).json({ m: e.message, type: "error" });
  }
}
