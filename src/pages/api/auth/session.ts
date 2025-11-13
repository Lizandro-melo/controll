
import type { NextApiRequest, NextApiResponse } from "next";
import { cors } from "../_middlewares/cors";
import { session_consult } from "@/domain/usecases/auth";
import { response } from "@/domain/entities";

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
