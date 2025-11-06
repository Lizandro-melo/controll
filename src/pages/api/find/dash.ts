import type { dash_data, response } from "@/utils/types";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  consult_tipo_user_by_uuid,
  consult_uuid_auth_by_session,
  export_dash_data_by_uuid,
} from "@/utils/server/service/consult";

export default async function dashApi(
  req: NextApiRequest,
  res: NextApiResponse<response>
) {
  try {
    const session_key = req.headers.authorization?.replace("Bearer ", "");
    const { uuid } = await consult_uuid_auth_by_session(session_key!);
    const dash_data: dash_data = await export_dash_data_by_uuid(uuid!);
    res.status(200).json({ result: dash_data, type: "sucess" });
  } catch (e) {
    res.status(403).json({ m: "Token Invalido", type: "error" });
  }
}
