import { ReactNode, useContext, useEffect } from "react";
import { LuCar } from "react-icons/lu";
import { FiBox } from "react-icons/fi";
import { FiUsers } from "react-icons/fi";
import { BsGraphUp } from "react-icons/bs";
import { FiAlertTriangle } from "react-icons/fi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { parseCookies } from "nookies";
import axios from "axios";
import { ContextAuth } from "@/presentation/provider/provider_auth";
import { dash_data } from "@/domain/entities";

export default function Dash() {
  const { headers } = useContext(ContextAuth);
  const queryClient = useQueryClient();

  const { isLoading, data: dash_data } = useQuery<dash_data>({
    queryKey: ["dash"],
    queryFn: async () => {
      const dash_data: dash_data = await axios
        .get("/api/dash", {
          headers: headers,
        })
        .then((response) => response.data.result);
      return dash_data;
    },
    initialData: {
      receita_potencial: 0,
      ticket_medio: 0,
      total_clientes_ativos: 0,
      total_pecas: 0,
      total_veiculos: 0,
      total_veiculos_alugados: 0,
      veiculos_alerta: [],
    },
    refetchInterval: 15000,
  });

  const ItemResume = ({
    title,
    data,
    descricao,
    icon,
  }: {
    title: string;
    data: string | number;
    descricao: string;
    icon: ReactNode;
  }) => {
    return (
      <div className="relative border grow basis-[300px] item-resume p-5 rounded-lg">
        <div className="flex flex-col gap-5">
          <span className="font-bold text-xs">{title}</span>
          <div className="flex flex-col">
            <span className="font-bold text-2xl">{data}</span>
            <span className="text-xs text-stone-500">{descricao}</span>
          </div>
        </div>
        <div className="absolute top-5 right-5">{icon}</div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <span className="text-stone-500 text-sm">
          Visão geral do seu sistema
        </span>
      </div>
      <div className="flex flex-wrap gap-5">
        <ItemResume
          title="Total de veiculos alugados"
          data={dash_data.total_veiculos_alugados}
          descricao="Veiculos na frota"
          icon={<LuCar className="stroke-stone-500!" />}
        />
        <ItemResume
          title="Peças Cadastradas"
          data={dash_data.total_pecas}
          descricao="Tipos de peças"
          icon={<FiBox className="stroke-stone-500!" />}
        />
        <ItemResume
          title="Clientes Ativos"
          data={dash_data.total_clientes_ativos}
          descricao="Com veículos atribuídos"
          icon={<FiUsers className="stroke-stone-500!" />}
        />
        <ItemResume
          title="Receita Potencial"
          data={Intl.NumberFormat("pt-br", {
            currency: "BRL",
            style: "currency",
          }).format(dash_data.receita_potencial)}
          descricao="Valor total dos aluguéis"
          icon={<BsGraphUp className="stroke-stone-500!" />}
        />
      </div>
      <div className="flex items-center gap-4">
        <FiAlertTriangle className="stroke-red-400" />
        <h2 className="text-lg font-semibold">
          Alertas de Manutenção ({dash_data.veiculos_alerta.length})
        </h2>
      </div>
      <div className="relative border item-resume p-10 rounded-lg flex flex-col justify-center items-center gap-3">
        <FiAlertTriangle className="stroke-stone-500 w-[30px] h-[30px]" />
        <div className="flex flex-col items-center text-center">
          <span className="font-semibold">Nenhum alerta ativo</span>
          <span className="font-semibold text-sm text-stone-400">
            Todas as peças estão dentro do prazo de manutenção
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-5">
        <div className="relative border gap-5 flex flex-col grow basis-[300px] item-resume p-5 rounded-lg">
          <span className="font-semibold text-lg">Status da Frota</span>
          <ul className="flex flex-col gap-2">
            <li className="flex justify-between">
              <span>Veículos Totais:</span>
              <span className="font-semibold">{dash_data.total_veiculos}</span>
            </li>
            <li className="flex justify-between">
              <span>Com Alertas:</span>
              <span className="font-semibold text-red-400">
                {dash_data.veiculos_alerta.length}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Em Bom Estado:</span>
              <span className="font-semibold text-green-500">
                {dash_data.total_veiculos - dash_data.veiculos_alerta.length}
              </span>
            </li>
          </ul>
        </div>
        <div className="relative border gap-5 flex flex-col grow basis-[300px] item-resume p-5 rounded-lg">
          <span className="font-semibold text-lg">Resumo Financeiro</span>
          <ul className="flex flex-col gap-2">
            <li className="flex justify-between">
              <span>Receita Potencial:</span>
              <span className="font-semibold">
                {Intl.NumberFormat("pt-br", {
                  currency: "BRL",
                  style: "currency",
                }).format(dash_data.receita_potencial)}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Clientes Ativos:</span>
              <span className="font-semibold">
                {dash_data.total_clientes_ativos}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Ticket Médio:</span>
              <span className="font-semibold">
                {Intl.NumberFormat("pt-br", {
                  currency: "BRL",
                  style: "currency",
                }).format(dash_data.ticket_medio)}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
