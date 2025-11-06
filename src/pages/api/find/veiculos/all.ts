import type { dash_data, response } from "@/utils/types";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  consult_uuid_auth_by_session,
  consult_veiculos_by_uuid_auth,
} from "@/utils/server/service/consult";
import { veiculo } from "@prisma/client";

export default async function veiculoApiFind(
  req: NextApiRequest,
  res: NextApiResponse<response>
) {
  try {
    const session_key = req.headers.authorization?.replace("Bearer ", "");
    const { uuid } = await consult_uuid_auth_by_session(session_key!);
    const veiculos: veiculo[] = await consult_veiculos_by_uuid_auth(uuid!);
    res.status(200).json({ result: veiculos, type: "sucess" });
  } catch (e) {
    res.status(403).json({ m: "Token Invalido", type: "error" });
  }
}
