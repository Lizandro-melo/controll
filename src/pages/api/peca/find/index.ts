import type { NextApiRequest, NextApiResponse } from "next";
import {
  consult_pecas_by_uuid_auth,
  consult_uuid_auth_by_session,
  consult_veiculos_by_uuid_auth,
} from "@/utils/server/service/consult";
import { peca, veiculo } from "@prisma/logic";
import { cors } from "../../_middlewares/cors";
import { response } from "@/domain/entities";
import { findAllPeca } from "@/domain/usecases/peca";

export default async function veiculoApiFind(
  req: NextApiRequest,
  res: NextApiResponse<response>
) {
  if (cors(req, res)) return;
  try {
    const session = req.headers.authorization?.replace("Bearer ", "");
    const pecas: peca[] = await findAllPeca({ session: session! });
    res.status(200).json({ result: pecas, type: "sucess" });
  } catch (e) {
    res.status(403).json({ m: "Token Invalido", type: "error" });
  }
}
