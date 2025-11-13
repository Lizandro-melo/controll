import type { NextApiRequest, NextApiResponse } from "next";
import { cors } from "../_middlewares/cors";
import { dashboard } from "@/domain/usecases/dash";
import { dash_data, response } from "@/domain/entities";

export default async function dashApiFind(
  req: NextApiRequest,
  res: NextApiResponse<response>,
) {
  if (cors(req, res)) return;
  try {
    const session = req.headers.authorization?.replace("Bearer ", "");
    const dash_data: dash_data = await dashboard({ session: session! });
    res.status(200).json({ result: dash_data, type: "sucess" });
  } catch (e) {
    res.status(403).json({ m: "Sessão expirada", type: "error" });
  }
}
