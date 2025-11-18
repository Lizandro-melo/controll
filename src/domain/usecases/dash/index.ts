import AuthRepository from "@/data/repositories/AuthRepository";
import { dash_data } from "@/domain/entities";
import { Prisma_logic } from "@/infra/db";
import { tipo_peca } from "@prisma/logic";

const auth = new AuthRepository();

export async function dashboard({
  session,
}: {
  session: string;
}): Promise<dash_data> {
  const { uuid_auth } = await auth.consult_uuid_auth_by_session({ session });
  const operador = await Prisma_logic.operador.findUnique({
    where: {
      uuid: uuid_auth,
    },
    include: {
      veiculos: true,
      clientes: true,
      pecas: true,
    },
  });
  const veiculos = operador?.veiculos.filter((v) => v.status !== "INATIVO");
  const veiculos_alugados = veiculos!.filter((v) => v.status == "ALUGADO");
  const veiculos_alerta = await Promise.all(
    veiculos!.map(async (v) => {
      const pecas = await Prisma_logic.veiculo_peca.findMany({
        where: { veiculo_uuid: v.uuid },
        include: { peca: true },
      });

      const pecas_alerta = pecas
        .filter((p) => p.km_registro >= p.peca.km_aviso)
        .map((p) => p.peca.tipo);

      if (pecas_alerta.length > 0) {
        return {
          veiculo_link: `/operadorui/veiculos/info?uuid-veiculo=${v.uuid}`,
          veiculo: {
            modelo: v.modelo!,
            placa: v.placa_veicular!,
            tipo_peca: pecas_alerta!,
          },
        };
      }

      return null;
    })
  );
  const veiculos_alerta_filtrado = veiculos_alerta.filter((v) => v !== null);
  const pecas = operador?.pecas!.filter((p) => p.status);
  const clientes = operador?.clientes.filter((c) => c.status);
  const receita_potencial = veiculos_alugados.reduce(
    (acc, v) => acc + (v.valor_aluguel || 0),
    0
  );
  const ticket_medio =
    veiculos_alugados.length > 0
      ? receita_potencial / veiculos_alugados.length
      : 0;

  return {
    total_veiculos: veiculos ? veiculos.length : 0,
    total_veiculos_alugados: veiculos_alugados ? veiculos_alugados.length : 0,
    total_pecas: pecas ? pecas.length : 0,
    receita_potencial: receita_potencial,
    ticket_medio: ticket_medio ? ticket_medio : 0,
    veiculos_alerta: veiculos_alerta_filtrado,
    total_clientes_ativos: clientes ? clientes.length : 0,
  };
}
