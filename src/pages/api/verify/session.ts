import { ASSAS } from "@/utils/server/constants";
import {
  consult_tipo_user_by_uuid,
  consult_uuid_auth_by_session,
} from "@/utils/server/service/consult";
import { response } from "@/utils/types";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function session(
  req: NextApiRequest,
  res: NextApiResponse<response>
) {
  const session = req.query.session as string;
  try {
    const { uuid, id_asaas, id_sub } = await consult_uuid_auth_by_session(
      session
    );
    await ASSAS.consult_sub(id_sub);
    const role = await consult_tipo_user_by_uuid(uuid!);
    switch (role) {
      case "OPERADOR": {
        res.status(200).json({ result: "/operadorui", type: "sucess" });
      }
    }
  } catch (e: any) {
    res.status(400).json({ result: "/", m: e.message, type: "error" });
  }
}
