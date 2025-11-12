import type { NextApiRequest, NextApiResponse } from "next";
import {
  consult_uuid_auth_by_session,
  consult_veiculo_info_by_uuid_veiculo,
  consult_veiculos_by_uuid_auth,
} from "@/utils/server/service/consult";

import { log } from "console";
import { cors } from "../../_middlewares/cors";
import { response, veiculo_info } from "@/domain/entities";
import { findUniqueVeiculo } from "@/domain/usecases/veiculo";

export default async function veiculoApiFind(
  req: NextApiRequest,
  res: NextApiResponse<response>
) {
  if (cors(req, res)) return;
  try {
    const session = req.headers.authorization?.replace("Bearer ", "");
    const uuid_veiculo = req.query.uuid_veiculo as string;
    const veiculo_info: veiculo_info = await findUniqueVeiculo({
      session: session!,
      uuid_veiculo: uuid_veiculo!,
    });
    res.status(200).json({ result: veiculo_info, type: "sucess" });
  } catch (e: any) {
    log(e.message);
    res.status(403).json({ m: e.message, type: "error" });
  }
}
