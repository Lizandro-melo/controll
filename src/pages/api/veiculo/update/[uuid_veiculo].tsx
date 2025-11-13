import type { NextApiRequest, NextApiResponse } from "next";

import { log } from "console";
import { cors } from "../../_middlewares/cors";
import { response, veiculo_info } from "@/domain/entities";
import { findUniqueVeiculo, updateVeiculo } from "@/domain/usecases/veiculo";

export default async function veiculoApiUpdate(
  req: NextApiRequest,
  res: NextApiResponse<response>
) {
  if (cors(req, res)) return;
  try {
    const session = req.headers.authorization?.replace("Bearer ", "");
    const uuid_veiculo = req.query.uuid_veiculo as string;
    const veiculo_info: veiculo_info = req.body;
    await updateVeiculo({
      session: session!,
      veiculo_info: veiculo_info!,
    });
    res.status(200).json({
      result: veiculo_info,
      m: "Veiculo atualizado com sucesso",
      type: "sucess",
    });
  } catch (e: any) {
    log(e.message);
    res.status(403).json({ m: e.message, type: "error" });
  }
}
