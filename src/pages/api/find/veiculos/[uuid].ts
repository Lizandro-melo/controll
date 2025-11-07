import type { dash_data, response, veiculo_info } from "@/utils/types";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  consult_uuid_auth_by_session,
  consult_veiculo_info_by_uuid_veiculo,
  consult_veiculos_by_uuid_auth,
} from "@/utils/server/service/consult";
import { veiculo } from "@prisma/client";
import { log } from "console";
import { cors } from "../../_middlewares/cors";

export default async function veiculoApiFind(
  req: NextApiRequest,
  res: NextApiResponse<response>
) {
  if (cors(req, res)) return;
  try {
    const session_key = req.headers.authorization?.replace("Bearer ", "");
    const { uuid: uuid_auth } = await consult_uuid_auth_by_session(
      session_key!
    );
    const uuid = req.query.uuid as string;
    const veiculo_info: veiculo_info =
      await consult_veiculo_info_by_uuid_veiculo(uuid!);
    res.status(200).json({ result: veiculo_info, type: "sucess" });
  } catch (e: any) {
    log(e.message);
    res.status(403).json({ m: e.message, type: "error" });
  }
}
