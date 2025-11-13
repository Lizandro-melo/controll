import type { NextApiRequest, NextApiResponse } from "next";
import { veiculo } from "@prisma/logic";
import { log } from "console";
import { response } from "@/domain/entities";
import { cors } from "../../_middlewares/cors";
import { createVeiculo } from "@/domain/usecases/veiculo";

export default async function veiculoApiCreate(
  req: NextApiRequest,
  res: NextApiResponse<response>
) {
  try {
    if (cors(req, res)) return;
    // const schemaVeiculo = z.object<veiculo>();
    // const { ...props } = z.parse(schemaVeiculo, req.body) as veiculo;
    const veiculo: veiculo = req.body;
    const session = req.headers.authorization?.replace("Bearer ", "");
    await createVeiculo({ session: session!, veiculo: veiculo! });
    res
      .status(200)
      .json({ result: null, m: "Veiculo criado com sucesso", type: "sucess" });
  } catch (e: any) {
    log(e.message);
    res
      .status(403)
      .json({ m: "Não foi possível cadastrar o veiculo", type: "error" });
  }
}
