import { Button } from "@/utils/components/ui/button";
import { FiBox, FiPlus } from "react-icons/fi";
import { Input } from "@/utils/components/ui/input";
import { HiOutlineFilter } from "react-icons/hi";
import { GoSearch } from "react-icons/go";
import { FC, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/utils/components/ui/dialog";
import LabelInput from "@/utils/components/ui/label-input";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/utils/components/ui/select";
import { Label } from "@/utils/components/ui/label";
import { peca } from "@prisma/client";
import { PiTire } from "react-icons/pi";
import { cn } from "@/utils/lib/utils";
import { MdFilterDrama } from "react-icons/md";

export const pecas_dev: peca[] = [
  {
    id: 1,
    tipo: "PNEU" as any,
    marca: "Pirelli",
    km_troca: 20000,
    preco_medio: 450,
    km_aviso: 18000,
    operador_uuid: "uuid_operador_mock",
    logo: "",
  },
  {
    id: 2,
    tipo: "FILTRO_AR" as any,
    marca: "Bosch",
    km_troca: 15000,
    preco_medio: 120,
    km_aviso: 13000,
    operador_uuid: "uuid_operador_mock",
    logo: "",
  },
];

export default function Pecas() {
  const [stateNewPeca, setStateNewPeca] = useState<boolean>();

  return (
    <>
      <NovaPeca open={stateNewPeca} onOpenChange={setStateNewPeca} />
      <div className="flex flex-col gap-5">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Gestão de Peças</h1>
          <div className="flex gap-4">
            <Button
              className="cursor-pointer"
              type="button"
              onClick={() => setStateNewPeca(true)}
            >
              <FiPlus /> Nova peça
            </Button>
          </div>
        </div>

        <div className="flex">
          <Button className="cursor-pointer">
            <HiOutlineFilter />
          </Button>
          <div className="relative w-full flex items-center">
            <Input placeholder="Buscar peça..." className="pr-14" />
            <GoSearch className="absolute w-[20px] h-[20px] right-5" />
          </div>
        </div>

        {pecas_dev && pecas_dev.length > 0 ? (
          <div className="flex flex-col gap-5">
            {pecas_dev.map((peca, i) => (
              <ShowPeca peca={peca} key={i} />
            ))}
          </div>
        ) : (
          <div className="relative border item-resume p-10 rounded-lg flex flex-col justify-center items-center gap-3">
            <FiBox className="stroke-stone-500 w-[30px] h-[30px]" />
            <div className="flex flex-col items-center">
              <span className="font-semibold">Nenhuma peça cadastrada</span>
              <span className="font-semibold text-sm text-stone-400">
                Comece adicionando peças ao seu catálogo
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function NovaPeca({ ...props }: React.ComponentProps<FC<any>>) {
  const { register, handleSubmit } = useForm<peca>();

  return (
    <Dialog {...props}>
      <DialogContent className="flex flex-col gap-10 ">
        <DialogTitle>Cadastrar uma nova peça</DialogTitle>
        <div className="relative overflow-y-auto min-h-[550px]">
          <form className="flex flex-col gap-5 absolute  w-full">
            <div className="flex flex-col gap-5">
              <div className="border rounded-sm flex flex-col gap-5 p-5">
                <div className="flex flex-col gap-3 max-w-[500px]">
                  <Label>Tipo da Peça</Label>
                  <Select {...register("tipo")}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PNEU">Pneu</SelectItem>
                      <SelectItem value="FILTRO_AR">Filtro de Ar</SelectItem>
                      <SelectItem value="OLEO_MOTOR">Óleo do Motor</SelectItem>
                      <SelectItem value="PASTILHA_FREIO">
                        Pastilha de Freio
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <LabelInput {...register("marca")} id="Marca" />
              </div>
              <div className="border rounded-sm flex flex-col gap-5 p-5">
                <LabelInput
                  {...register("km_troca")}
                  id="KM para troca"
                  placeholder="Ex: 20000"
                />
                <LabelInput
                  {...register("km_aviso")}
                  id="KM para aviso"
                  placeholder="Ex: 18000"
                />
                <LabelInput
                  {...register("preco_medio")}
                  id="Preço médio (R$)"
                  placeholder="Ex: 450"
                />
              </div>
            </div>
            <Button>Cadastrar</Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ShowPeca({ peca }: { peca: peca }) {
  return (
    <div
      key={peca.id}
      className={cn(
        "relative border p-5 rounded-lg flex gap-3 cursor-pointer active:scale-95 transition-all",
      )}
    >
      {peca.tipo === "PNEU" && (
        <div className="grid place-content-center basis-0.5 grow max-lg:hidden">
          <PiTire className="w-[35px] h-[35px]" />
        </div>
      )}
      {peca.tipo === "FILTRO_AR" && (
        <div className="grid place-content-center basis-0.5 grow max-lg:hidden">
          <MdFilterDrama className="w-[35px] h-[35px]" />
        </div>
      )}

      <div className="basis-0.5 flex-col text-xs gap-2 flex grow justify-center">
        <div>
          <span>Tipo: {peca.tipo}</span>
        </div>
        <div>
          <span>Marca: {peca.marca}</span>
        </div>
        <div>
          <span>Troca: {peca.km_troca.toLocaleString()} km</span>
        </div>
        <div>
          <span>Aviso: {peca.km_aviso.toLocaleString()} km</span>
        </div>
      </div>
      <div className="basis-0.5 flex-col text-xs gap-2 flex grow justify-center">
        <span className="text-green-800">
          Preço Médio:{" "}
          {Intl.NumberFormat("pt-br", {
            currency: "BRL",
            style: "currency",
          }).format(peca.preco_medio)}
        </span>
      </div>
    </div>
  );
}
