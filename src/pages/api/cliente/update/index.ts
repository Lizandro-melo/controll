import type { NextApiRequest, NextApiResponse } from "next";

import { log } from "console";
import { cors } from "../../_middlewares/cors";
import { cliente_info, response, veiculo_info } from "@/domain/entities";
import { findUniqueVeiculo, updateVeiculo } from "@/domain/usecases/veiculo";
import { updateCliente } from "@/domain/usecases/cliente";

export default async function veiculoApiUpdate(
  req: NextApiRequest,
  res: NextApiResponse<response>
) {
  if (cors(req, res)) return;
  try {
    const session = req.headers.authorization?.replace("Bearer ", "");
    const cliente_info: cliente_info = req.body;
    await updateCliente({ session: session!, cliente_info: cliente_info });
    res.status(200).json({
      m: "Cliente atualizado",
      type: "sucess",
    });
  } catch (e: any) {
    log(e.message);
    res.status(403).json({ m: e.message, type: "error" });
  }
}
