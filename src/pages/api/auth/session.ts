import { ASSAS } from "@/utils/server/constants";
import {
  consult_tipo_user_by_uuid,
  consult_uuid_auth_by_session,
} from "@/utils/server/service/consult";
import { response } from "@/utils/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { cors } from "../_middlewares/cors";
import { session_consult } from "@/domain/usecases/auth";

export default async function session(
  req: NextApiRequest,
  res: NextApiResponse<response>,
) {
  if (cors(req, res)) return;
  const session = req.query.session as string;
  try {
    const role = await session_consult({ session });
    switch (role) {
      case "OPERADOR": {
        res.status(200).json({ result: "/operadorui", type: "sucess" });
      }
    }
  } catch (e: any) {
    res.status(400).json({ result: "/", m: e.message, type: "error" });
  }
}
