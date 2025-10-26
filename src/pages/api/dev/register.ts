import PRISMA from "@/utils/server/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";
import { SaltRounds } from "@/utils/server/crypt";
import moment from "moment";

type req_register_dev = {
  num_cpf: string;
  data_nascimento: string;
  numero_cel: string;
  correio_eletronico: string;
  codigo_postal: string;
  numero_residencial: string;
  senha: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const data: req_register_dev = req.body;
  const auth_criado = await PRISMA.auth.create({
    data: {
      role: "MASTER",
    },
  });
  await PRISMA.historico_senha.create({
    data: {
      senha: await hash(data.senha, SaltRounds),
      uuid: auth_criado.uuid,
    },
  });
  const pessoa_criada = await PRISMA.pessoa.create({
    data: {
      num_cpf: data.num_cpf,
      data_nascimento: moment(data.data_nascimento).toDate(),
      numero_cel: data.numero_cel,
      correio_eletronico: data.correio_eletronico,
      codigo_postal: data.codigo_postal,
      numero_residencial: data.numero_residencial,
      uuid: auth_criado.uuid,
    },
  });
  res.status(200).json({ name: "John Doe" });
}
