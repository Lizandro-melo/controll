import { Button } from "@/presentation/components/ui/button";
import { LuCar } from "react-icons/lu";
import { FiPlus } from "react-icons/fi";
import { Input } from "@/presentation/components/ui/input";
import { HiOutlineFilter } from "react-icons/hi";
import { GoSearch } from "react-icons/go";
import { FC, useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/presentation/components/ui/dialog";
import LabelInput from "@/presentation/components/ui/label-input";
import { useForm, Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";
import { Label } from "@/presentation/components/ui/label";
import { veiculo } from "@prisma/client";
import { PiMotorcycle } from "react-icons/pi";
import Router from "next/router";
import { DialogProps } from "@radix-ui/react-dialog";
import { useSearchParams } from "next/navigation";
import { cn } from "@/presentation/lib/utils";

import axios from "axios";
import { response } from "@/utils/types";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { ContextAlert } from "@/presentation/provider/provider_alert";
import { ContextAuth } from "@/presentation/provider/provider_auth";
import { ContextLoading } from "@/presentation/provider/provider_loading";
import { MARCA_MOTOS, MARCA_CARROS } from "@/infra/constants";

export default function Veiculos() {
  const [stateNewVeiculo, setStateNewVeiculo] = useState<boolean>();
  const [filter, setFilter] = useState("");
  const queryClient = useQueryClient();
  const { headers } = useContext(ContextAuth);
  const { data: veiculos } = useQuery<veiculo[]>({
    queryKey: ["list_veiculos"],
    queryFn: async () => {
      return await axios
        .get("/api/veiculo/find", {
          headers: headers,
        })
        .then((response) => {
          return response.data.result;
        });
    },
  });

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
          <div className="relative w-full flex items-center">
            <Input
              placeholder="Placa"
              className="pr-14"
              value={filter}
              onInput={(e) => {
                setFilter(e.currentTarget.value);
                const value = e.currentTarget.value.toUpperCase();
                if (value === "") {
                  queryClient.fetchQuery({ queryKey: ["list_veiculos"] });
                }
                const veiculos = queryClient.getQueryData<veiculo[]>([
                  "list_veiculos",
                ]);
                const find_veiculo = veiculos?.filter((v) =>
                  v.placa_veicular?.toUpperCase().includes(value)
                );
                queryClient.setQueryData(["list_veiculos"], find_veiculo);
              }}
            />
            <X
              className="absolute w-[20px] h-[20px] right-5 cursor-pointer"
              onClick={() => {
                setFilter("");
                queryClient.fetchQuery({ queryKey: ["list_veiculos"] });
              }}
            />
          </div>
        </div>
        {veiculos ? (
          <div className="flex flex-col gap-5">
            {veiculos.map((veiculo, i) => {
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
    getValues,
    formState: { errors },
    reset,
    control,
  } = useForm<veiculo>();
  const { headers } = useContext(ContextAuth);
  const { drop_alert } = useContext(ContextAlert);
  const { startLoading } = useContext(ContextLoading);
  const queryClient = useQueryClient();
  const { mutateAsync: create_veiculo } = useMutation({
    mutationFn: async (data: veiculo) => {
      startLoading(
        axios
          .put("/api/veiculo/create", data, {
            headers: headers,
          })
          .then((response) => {
            drop_alert(response.data.type, response.data.m);
            props.onOpenChange!(false);
            reset();
            queryClient.fetchQuery({ queryKey: ["list_veiculos"] });
          })
          .catch((e) => {
            const response: response = e.response.data;
            drop_alert(response.type, response.m);
          })
      );
    },
  });

  return (
    <Dialog {...props}>
      <DialogContent className="flex flex-col gap-10 ">
        <DialogTitle>Cadastrar um veiculo</DialogTitle>
        <div className="relative overflow-y-auto min-h-[550px]">
          <form
            onSubmit={handleSubmit((data) => create_veiculo(data))}
            className="flex flex-col gap-5 absolute  w-full"
          >
            <div className="flex flex-col gap-5">
              <div className="border rounded-sm flex flex-col gap-5 p-5">
                <LabelInput {...register("modelo")} id="Modelo" required />
                <LabelInput
                  {...register("placa_veicular")}
                  maxLength={7}
                  id="Placa"
                  required
                />
                <div className="flex flex-col gap-3 max-w-[500px]">
                  <Label className="after:ml-0.5 after:text-red-500 after:content-['*']">
                    Marca
                  </Label>
                  <Controller
                    control={control}
                    name="tipo"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MOTO">Moto</SelectItem>
                          <SelectItem value="CARRO">Carro</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-3 max-w-[500px]">
                  <Label className="after:ml-0.5 after:text-red-500 after:content-['*']">
                    Marca
                  </Label>
                  <Controller
                    control={control}
                    name="marca"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full ">
                          <SelectValue placeholder="Marca" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel className=" text-white font-bold bg-primary">
                              Motos
                            </SelectLabel>
                            {MARCA_MOTOS.sort().map((m, i) => {
                              return (
                                <SelectItem key={i} value={`${m}-M`}>
                                  {m}
                                </SelectItem>
                              );
                            })}
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel className=" text-white font-bold bg-primary">
                              Carros
                            </SelectLabel>
                            {MARCA_CARROS.sort().map((m, i) => {
                              return (
                                <SelectItem key={i} value={`${m}-C`}>
                                  {m}
                                </SelectItem>
                              );
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <LabelInput
                  {...register("km")}
                  id="Km"
                  required
                  type="number"
                />
              </div>
              <div className="border rounded-sm flex flex-col gap-5 p-5">
                <LabelInput
                  {...register("valor_aluguel")}
                  id="Valor do Aluguel"
                  required
                  type="number"
                />
                <LabelInput
                  {...register("valor_seguro")}
                  id="Valor do Seguro / Mês"
                  type="number"
                  required
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
    Router.push(`/operadorui/veiculos/info?${params.toString()}`);
  };

  return (
    <div
      key={veiculo.uuid}
      onClick={() => selectVeiculo(veiculo.uuid)}
      className={cn(
        "relative border p-5 rounded-lg flex  gap-3 cursor-pointer active:scale-95 transition-all",
        veiculo.status === "LIVRE" ? "border-green-600" : "border-red-600"
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
            veiculo.status === "LIVRE" ? "bg-green-600" : "bg-red-600"
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
          }).format(veiculo.valor_manutencao!)}
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
