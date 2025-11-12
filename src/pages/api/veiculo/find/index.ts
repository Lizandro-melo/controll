import type { NextApiRequest, NextApiResponse } from "next";
import { cors } from "../../_middlewares/cors";
import { findAllVeiculos } from "@/domain/usecases/veiculo";
import { response } from "@/domain/entities";

export default async function veiculoApiFind(
  req: NextApiRequest,
  res: NextApiResponse<response>
) {
  if (cors(req, res)) return;
  try {
    const session = req.headers.authorization?.replace("Bearer ", "");
    const veiculos = await findAllVeiculos({ session: session! });
    res.status(200).json({ result: veiculos, type: "sucess" });
  } catch (e) {
    res.status(403).json({ m: "Token Invalido", type: "error" });
  }
}
