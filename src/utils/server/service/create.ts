import { peca, veiculo } from "@prisma/client";
import { PRISMA } from "../db";

export const create_veiculo = async (veiculo: veiculo, uuid: string) => {
  const uuid_veiculo = await PRISMA.veiculo
    .create({
      data: {
        ...veiculo,
        placa_veicular: veiculo.placa_veicular?.toUpperCase(),
        km: parseFloat(veiculo.km.toString()),
        valor_seguro: parseFloat(veiculo.valor_seguro.toString()),
        valor_aluguel: parseFloat(veiculo.valor_aluguel.toString()),
      },
    })
    .then((v) => v.uuid);
  await PRISMA.veiculo_operador.create({
    data: {
      uuid_auth: uuid,
      uuid_veiculo: uuid_veiculo,
    },
  });
};

export const create_peca = async (peca: peca, uuid: string) => {
  const id_peca = await PRISMA.peca
    .create({
      data: {
        ...peca,
        km_aviso: parseFloat(peca.km_aviso.toString()),
        km_troca: parseFloat(peca.km_troca.toString()),
        preco_medio: parseFloat(peca.preco_medio.toString()),
      },
    })
    .then((v) => v.id);
  await PRISMA.peca_operador.create({
    data: {
      uuid_auth: uuid,
      id_peca: id_peca,
    },
  });
};
