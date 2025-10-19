import { Button } from "@/components/ui/button";
import { LuCar } from "react-icons/lu";
import { FiPlus } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { HiOutlineFilter } from "react-icons/hi";
import { GoSearch } from "react-icons/go";
import { FC, useContext, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import LabelInput from "@/components/ui/label-input";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { veiculo } from "@prisma/client";
import { PiMotorcycle } from "react-icons/pi";
import Router from "next/router";
import { DialogProps } from "@radix-ui/react-dialog";
import { register } from "module";
import { useSearchParams } from "next/navigation";
import { ContextAuth } from "@/provider/provider_auth";
import { cn } from "@/lib/utils";

export const veiculos_dev: veiculo[] = [
  {
    modelo: "Honda Bros 160",
    tipo: "MOTO",
    km: 18450,
    valor_seguro: 95,
    valor_aluguel: 420,
    valor_manutencao: 160,
    placa_veicular: "RTE-2A45",
    chassi: "9C2KD1230LR001254",
    foto: "",
    renavam: "01234567891",
    uuid: "v001",
    operador_uuid: "op001",
    status: "ALUGADO",
  },
  {
    modelo: "Honda CG 160 Fan",
    tipo: "MOTO",
    km: 11200,
    valor_seguro: 85,
    valor_aluguel: 380,
    valor_manutencao: 140,
    placa_veicular: "QWE-8B29",
    chassi: "9C2KC1670MR004578",
    foto: "",
    renavam: "01123459873",
    uuid: "v002",
    operador_uuid: "op002",
    status: "LIVRE",
  },
  {
    modelo: "Volkswagen CrossFox",
    tipo: "CARRO",
    km: 45230,
    valor_seguro: 230,
    valor_aluguel: 950,
    valor_manutencao: 280,
    placa_veicular: "ABC-1D23",
    chassi: "9BWZZZ377VT012345",
    foto: "",
    renavam: "00987654321",
    uuid: "v003",
    operador_uuid: "op003",
    status: "ALUGADO",
  },
  {
    modelo: "Fiat Strada Adventure",
    tipo: "CARRO",
    km: 29870,
    valor_seguro: 260,
    valor_aluguel: 1100,
    valor_manutencao: 350,
    placa_veicular: "JKL-4F56",
    chassi: "93XFU25C0K0129987",
    foto: "",
    renavam: "00891236754",
    uuid: "v004",
    operador_uuid: "op004",
    status: "LIVRE",
  },
  {
    modelo: "Toyota Corolla",
    tipo: "CARRO",
    km: 68200,
    valor_seguro: 320,
    valor_aluguel: 1350,
    valor_manutencao: 400,
    placa_veicular: "MNO-9G12",
    chassi: "9BRBLWHE0K1234567",
    foto: "",
    renavam: "00784569231",
    uuid: "v005",
    operador_uuid: "op005",
    status: "LIVRE",
  },
  {
    modelo: "Chevrolet Onix LTZ",
    tipo: "CARRO",
    km: 37650,
    valor_seguro: 270,
    valor_aluguel: 980,
    valor_manutencao: 260,
    placa_veicular: "PQR-3H98",
    chassi: "9BGKS19X0JB123456",
    foto: "",
    renavam: "00999887766",
    uuid: "v006",
    operador_uuid: "op006",
    status: "ALUGADO",
  },
  {
    modelo: "Yamaha Fazer 250",
    tipo: "MOTO",
    km: 15780,
    valor_seguro: 110,
    valor_aluguel: 430,
    valor_manutencao: 150,
    placa_veicular: "STU-7J33",
    chassi: "9C6KG0410LR001112",
    foto: "",
    renavam: "01354789900",
    uuid: "v007",
    operador_uuid: "op007",
    status: "LIVRE",
  },
  {
    modelo: "Honda XRE 300",
    tipo: "MOTO",
    km: 22400,
    valor_seguro: 125,
    valor_aluguel: 480,
    valor_manutencao: 180,
    placa_veicular: "VWX-5K77",
    chassi: "9C2KD1920LR009888",
    foto: "",
    renavam: "01002345789",
    uuid: "v008",
    operador_uuid: "op008",
    status: "ALUGADO",
  },
];

export default function Veiculos() {
  const [stateNewVeiculo, setStateNewVeiculo] = useState<boolean>();

  return (
    <>
      <NovoVeiculo open={stateNewVeiculo} onOpenChange={setStateNewVeiculo} />
      <div className="flex flex-col gap-5">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Gestão de Veículos</h1>
          <Button
            className="cursor-pointer"
            type="button"
            onClick={() => setStateNewVeiculo(true)}
          >
            <FiPlus /> Novo veiculo
          </Button>
        </div>
        <div className="flex">
          <Button className="cursor-pointer">
            <HiOutlineFilter />
          </Button>
          <div className="relative w-full flex items-center">
            <Input placeholder="Modelo" className="pr-14" />
            <GoSearch className="absolute w-[20px] h-[20px] right-5" />
          </div>
        </div>
        {veiculos_dev ? (
          <div className="flex flex-col gap-5">
            {veiculos_dev.map((veiculo, i) => {
              return <ShowVeiculo veiculo={veiculo} key={i} />;
            })}
          </div>
        ) : (
          <div className="relative border item-resume p-10 rounded-lg flex flex-col justify-center items-center gap-3">
            <LuCar className="stroke-stone-500 w-[30px] h-[30px]" />
            <div className="flex flex-col items-center">
              <span className="font-semibold">Nenhum veículo cadastrado</span>
              <span className="font-semibold text-sm text-stone-400">
                Comece adicionando um novo veículo à sua frota
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function NovoVeiculo({ ...props }: React.ComponentProps<FC<DialogProps>>) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<veiculo>();

  return (
    <Dialog {...props}>
      <DialogContent className="flex flex-col gap-10 ">
        <DialogTitle>Cadastrar um veiculo</DialogTitle>
        <div className="relative overflow-y-auto min-h-[550px]">
          <form className="flex flex-col gap-5 absolute  w-full">
            <div className="flex flex-col gap-5">
              <div className="border rounded-sm flex flex-col gap-5 p-5">
                <LabelInput {...register("modelo")} id="Modelo" />
                <LabelInput {...register("placa_veicular")} id="Placa" />
                <div className="flex flex-col gap-3 max-w-[500px]">
                  <Label>Tipo do veiculo</Label>
                  <Select {...register("tipo")}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MOTO">Moto</SelectItem>
                      <SelectItem value="CARRO">Carro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <LabelInput {...register("km")} id="Km" />
              </div>
              <div className="border rounded-sm flex flex-col gap-5 p-5">
                <LabelInput
                  {...register("valor_aluguel")}
                  id="Valor do Aluguel"
                />
                <LabelInput
                  {...register("valor_seguro")}
                  id="Valor do Seguro"
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

function ShowVeiculo({ veiculo }: { veiculo: veiculo }) {
  const searchParams = useSearchParams();
  const classnameIcon = "w-[35px] h-[35px]";

  const selectVeiculo = (uuid: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("uuid-veiculo", `${uuid}`);
    Router.push(`/veiculos/info?${params.toString()}`);
  };

  return (
    <div
      key={veiculo.uuid}
      onClick={() => selectVeiculo(veiculo.uuid)}
      className={cn(
        "relative border p-5 rounded-lg flex  gap-3 cursor-pointer active:scale-95 transition-all",
        veiculo.status === "LIVRE" ? "border-green-600" : "border-red-600",
      )}
    >
      <div className="grid place-content-center basis-0.5 grow max-lg:hidden">
        {veiculo.tipo === "MOTO" && <PiMotorcycle className={classnameIcon} />}
        {veiculo.tipo === "CARRO" && <LuCar className={classnameIcon} />}
      </div>
      <div className="basis-0.5 flex-col text-xs gap-2 flex grow justify-center">
        <div
          className={cn(
            "absolute rounded-lg p-2 top-0.5 right-0.5",
            veiculo.status === "LIVRE" ? "bg-green-600" : "bg-red-600",
          )}
        >
          {veiculo.tipo === "MOTO" && (
            <PiMotorcycle
              className={"w-[25px] h-[25px] stroke-white fill-white"}
            />
          )}
          {veiculo.tipo === "CARRO" && (
            <LuCar className={"w-[25px] h-[25px] stroke-white"} />
          )}
        </div>
        <div>
          <span>Modelo: {veiculo.modelo}</span>
        </div>
        <div>
          <span>Placa: {veiculo.placa_veicular}</span>
        </div>
        <div>
          <span>KM: {veiculo.km}</span>
        </div>
        <div>
          <span>Status: {veiculo.status}</span>
        </div>
      </div>
      <div className="basis-0.5 flex-col text-xs gap-2 flex grow justify-center">
        <span className="text-green-800">
          Aluguel:{" "}
          {Intl.NumberFormat("pt-br", {
            currency: "BRL",
            style: "currency",
          }).format(veiculo.valor_aluguel)}
        </span>
        <span className="text-red-800">
          Manutenção:{" "}
          {Intl.NumberFormat("pt-br", {
            currency: "BRL",
            style: "currency",
          }).format(veiculo.valor_manutencao)}
        </span>
        <span className="text-red-800">
          Seguro:{" "}
          {Intl.NumberFormat("pt-br", {
            currency: "BRL",
            style: "currency",
          }).format(veiculo.valor_seguro)}
        </span>
      </div>
    </div>
  );
}
