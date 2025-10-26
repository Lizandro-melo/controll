import { response } from "@/utils/types";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  consult_tipo_user_by_uuid,
  consult_uuid_auth_by_session,
} from "@/utils/server/service/consult";


export default async function session(
  req: NextApiRequest,
  res: NextApiResponse<response>,
) {
  try {
    const session = req.query.session as string;
    const uuid_auth = await consult_uuid_auth_by_session(session);
    const role = await consult_tipo_user_by_uuid(uuid_auth!);
    switch (role) {
      case "OPERADOR": {
        res.status(200).json({ result: "/operadorui", type: "sucess" });
      }
    }
  } catch (e) {
    res.status(400).json({ result: "/auth", type: "error" });
  }
}
