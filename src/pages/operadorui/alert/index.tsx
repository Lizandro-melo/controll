import { Button } from "@/presentation/components/ui/button";
import { FiAlertTriangle, FiPlus } from "react-icons/fi";
import { Input } from "@/presentation/components/ui/input";
import { HiOutlineFilter } from "react-icons/hi";
import { GoSearch } from "react-icons/go";
import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/presentation/components/ui/dialog";
import LabelInput from "@/presentation/components/ui/label-input";
import { useForm } from "react-hook-form";
import { Label } from "@/presentation/components/ui/label";
import { cn } from "@/presentation/lib/utils";
export type Alerta = {
  uuid: string;
  tipo: string;
  descricao: string;
  data_emissao: string;
  nivel: "ALTO" | "MEDIO" | "BAIXO";
  veiculo: string;
  status: "ABERTO" | "RESOLVIDO";
};

export const alertas_dev: Alerta[] = [
  {
    uuid: "a001",
    tipo: "Troca de Pneu",
    descricao: "O pneu dianteiro atingiu o limite de 20.000 km.",
    data_emissao: "2025-10-10",
    nivel: "ALTO",
    veiculo: "Honda Bros 160",
    status: "ABERTO",
  },
  {
    uuid: "a002",
    tipo: "Revisão de Óleo",
    descricao: "Próxima troca de óleo prevista para 25.000 km.",
    data_emissao: "2025-09-28",
    nivel: "MEDIO",
    veiculo: "Fiat Strada Adventure",
    status: "ABERTO",
  },
  {
    uuid: "a003",
    tipo: "Filtro de Ar",
    descricao: "Filtro de ar próximo ao limite de uso (14.000 km).",
    data_emissao: "2025-08-19",
    nivel: "BAIXO",
    veiculo: "Volkswagen CrossFox",
    status: "RESOLVIDO",
  },
];

export default function Alert() {
  const [stateNewAlert, setStateNewAlert] = useState<boolean>();

  return (
    <>
      <NovoAlerta open={stateNewAlert} onOpenChange={setStateNewAlert} />
      <div className="flex flex-col gap-5">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Gestão de Alertas</h1>
          <Button
            className="cursor-pointer"
            type="button"
            onClick={() => setStateNewAlert(true)}
          >
            <FiPlus /> Novo alerta
          </Button>
        </div>

        <div className="flex">
          <Button className="cursor-pointer">
            <HiOutlineFilter />
          </Button>
          <div className="relative w-full flex items-center">
            <Input
              placeholder="Pesquisar alerta ou veículo"
              className="pr-14"
            />
            <GoSearch className="absolute w-[20px] h-[20px] right-5" />
          </div>
        </div>

        {alertas_dev && alertas_dev.length > 0 ? (
          <div className="flex flex-col gap-5">
            {alertas_dev.map((alerta, i) => (
              <ShowAlerta alerta={alerta} key={i} />
            ))}
          </div>
        ) : (
          <div className="relative border item-resume p-10 rounded-lg flex flex-col justify-center items-center gap-3">
            <FiAlertTriangle className="stroke-stone-500 w-[30px] h-[30px]" />
            <div className="flex flex-col items-center">
              <span className="font-semibold">
                Nenhum veículo em estado de alerta.
              </span>
              <span className="font-semibold text-sm text-stone-400">
                Tudo está em ordem na frota.
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function NovoAlerta({ ...props }: React.ComponentProps<FC<any>>) {
  const { register, handleSubmit } = useForm<Alerta>();

  return (
    <Dialog {...props}>
      <DialogContent className="flex flex-col gap-10 ">
        <DialogTitle>Cadastrar novo alerta</DialogTitle>
        <div className="relative overflow-y-auto min-h-[550px]">
          <form className="flex flex-col gap-5 absolute w-full">
            <div className="flex flex-col gap-5">
              <div className="border rounded-sm flex flex-col gap-5 p-5">
                <LabelInput {...register("tipo")} id="Tipo de alerta" />
                <LabelInput {...register("descricao")} id="Descrição" />
                <LabelInput {...register("veiculo")} id="Veículo relacionado" />
                <Label> Nível de risco </Label>
                <select
                  {...register("nivel")}
                  className="border rounded-sm p-2 text-sm outline-none"
                >
                  <option value="ALTO">Alto</option>
                  <option value="MEDIO">Médio</option>
                  <option value="BAIXO">Baixo</option>
                </select>
                <Label> Status </Label>
                <select
                  {...register("status")}
                  className="border rounded-sm p-2 text-sm outline-none"
                >
                  <option value="ABERTO">Aberto</option>
                  <option value="RESOLVIDO">Resolvido</option>
                </select>
              </div>
            </div>
            <Button>Cadastrar</Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ShowAlerta({ alerta }: { alerta: Alerta }) {
  const nivelColor =
    alerta.nivel === "ALTO"
      ? "border-red-600 text-red-600"
      : alerta.nivel === "MEDIO"
        ? "border-yellow-500 text-yellow-600"
        : "border-green-600 text-green-600";

  return (
    <div
      key={alerta.uuid}
      className={cn(
        "relative border p-5 rounded-lg flex gap-3 cursor-pointer active:scale-95 transition-all",
        nivelColor,
      )}
    >
      <div className="grid place-content-center basis-0.5 grow max-lg:hidden">
        <FiAlertTriangle className="w-[35px] h-[35px]" />
      </div>
      <div className="basis-0.5 flex-col text-xs gap-2 flex grow justify-center">
        <div>
          <span className="font-semibold">{alerta.tipo}</span>
        </div>
        <div>
          <span>{alerta.descricao}</span>
        </div>
        <div>
          <span>Veículo: {alerta.veiculo}</span>
        </div>
        <div>
          <span>Status: {alerta.status}</span>
        </div>
      </div>
      <div className="basis-0.5 flex-col text-xs gap-2 flex grow justify-center">
        <span className="text-stone-600">
          Data: {new Date(alerta.data_emissao).toLocaleDateString("pt-BR")}
        </span>
        <span className="font-semibold">Nível: {alerta.nivel}</span>
      </div>
    </div>
  );
}
