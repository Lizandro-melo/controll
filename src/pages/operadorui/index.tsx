import { ReactNode } from "react";
import { LuCar } from "react-icons/lu";
import { FiBox } from "react-icons/fi";
import { FiUsers } from "react-icons/fi";
import { BsGraphUp } from "react-icons/bs";
import { FiAlertTriangle } from "react-icons/fi";

export default function Dash() {
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
          title="Total de veiculos"
          data={0}
          descricao="Veiculos na frota"
          icon={<LuCar className="stroke-stone-500!" />}
        />
        <ItemResume
          title="Peças Cadastradas"
          data={0}
          descricao="Tipos de peças"
          icon={<FiBox className="stroke-stone-500!" />}
        />
        <ItemResume
          title="Clientes Ativos"
          data={0}
          descricao="Com veículos atribuídos"
          icon={<FiUsers className="stroke-stone-500!" />}
        />
        <ItemResume
          title="Receita Potencial"
          data={0}
          descricao="Valor total dos aluguéis"
          icon={<BsGraphUp className="stroke-stone-500!" />}
        />
      </div>
      <div className="flex items-center gap-4">
        <FiAlertTriangle className="stroke-red-400" />
        <h2 className="text-lg font-semibold">Alertas de Manutenção ({0})</h2>
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
              <span className="font-semibold">0</span>
            </li>
            <li className="flex justify-between">
              <span>Com Alertas:</span>
              <span className="font-semibold text-red-400">0</span>
            </li>
            <li className="flex justify-between">
              <span>Em Bom Estado:</span>
              <span className="font-semibold text-green-500">0</span>
            </li>
          </ul>
        </div>
        <div className="relative border gap-5 flex flex-col grow basis-[300px] item-resume p-5 rounded-lg">
          <span className="font-semibold text-lg">Resumo Financeiro</span>
          <ul className="flex flex-col gap-2">
            <li className="flex justify-between">
              <span>Receita Potencial:</span>
              <span className="font-semibold">0</span>
            </li>
            <li className="flex justify-between">
              <span>Clientes Ativos:</span>
              <span className="font-semibold">0</span>
            </li>
            <li className="flex justify-between">
              <span>Ticket Médio:</span>
              <span className="font-semibold">0</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
