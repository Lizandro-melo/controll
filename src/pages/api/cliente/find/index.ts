import type { NextApiRequest, NextApiResponse } from "next";
import { peca, veiculo } from "@prisma/logic";
import { cors } from "../../_middlewares/cors";
import { response } from "@/domain/entities";
import { findAllPeca } from "@/domain/usecases/peca";

export default async function clienteApiFind(
  req: NextApiRequest,
  res: NextApiResponse<response>
) {
  if (cors(req, res)) return;
  try {
    const session = req.headers.authorization?.replace("Bearer ", "");
    
    res.status(200).json({ result: null, type: "sucess" });
  } catch (e) {
    res.status(403).json({ m: "Token Invalido", type: "error" });
  }
}
