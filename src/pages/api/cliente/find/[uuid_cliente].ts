import type { NextApiRequest, NextApiResponse } from "next";

import { log } from "console";
import { cors } from "../../_middlewares/cors";
import { cliente_info, response, veiculo_info } from "@/domain/entities";
import { findUniqueVeiculo } from "@/domain/usecases/veiculo";
import { findUniqueCliente } from "@/domain/usecases/cliente";

export default async function clienteApiFind(
  req: NextApiRequest,
  res: NextApiResponse<response>
) {
  if (cors(req, res)) return;
  try {
    const session = req.headers.authorization?.replace("Bearer ", "");
    const uuid_cliente = req.query.uuid_cliente as string;
    const cliente_info: cliente_info = await findUniqueCliente({
      session: session!,
      uuid_cliente: uuid_cliente!,
    });
    res.status(200).json({ result: cliente_info, type: "sucess" });
  } catch (e: any) {
    log(e.message);
    res.status(403).json({ m: e.message, type: "error" });
  }
}
