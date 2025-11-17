import type { NextApiRequest, NextApiResponse } from "next";
import { peca, veiculo } from "@prisma/logic";
import { cors } from "../../_middlewares/cors";
import { find_cliente, response } from "@/domain/entities";
import { findAllPeca } from "@/domain/usecases/peca";
import { findAllCliente } from "@/domain/usecases/cliente";

export default async function clienteApiFind(
  req: NextApiRequest,
  res: NextApiResponse<response>
) {
  if (cors(req, res)) return;
  try {
    const session = req.headers.authorization?.replace("Bearer ", "");
    const clintes: find_cliente = await findAllCliente({ session: session! });
    res.status(200).json({ result: clintes, type: "sucess" });
  } catch (e) {
    res.status(403).json({ m: "Token Invalido", type: "error" });
  }
}
