import type { NextApiRequest, NextApiResponse } from "next";
import { peca, veiculo } from "@prisma/logic";
import { cors } from "../../_middlewares/cors";
import { create_cliente, response } from "@/domain/entities";
import { createCliente } from "@/domain/usecases/cliente";

export default async function clienteApiCreate(
  req: NextApiRequest,
  res: NextApiResponse<response>
) {
  if (cors(req, res)) return;
  try {
    const session = req.headers.authorization?.replace("Bearer ", "");
    const create_cliente: create_cliente = req.body;
    await createCliente({ session: session!, create_cliente });
    res.status(200).json({ m: "Cliente criado com sucesso!", type: "sucess" });
  } catch (e:any) {
    res.status(403).json({ m: e.message, type: "error" });
  }
}
