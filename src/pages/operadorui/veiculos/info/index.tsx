import { cliente, peca, veiculo, veiculo_peca } from "@prisma/logic";
import { useSearchParams } from "next/navigation";
import Router from "next/router";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/presentation/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/presentation/components/ui/popover";
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { Button } from "@/presentation/components/ui/button";
import { FiEdit } from "react-icons/fi";
import { cn } from "@/presentation/lib/utils";
import { IoCaretDownOutline, IoCaretUpOutline } from "react-icons/io5";
import { TiMinus } from "react-icons/ti";
import { PiTire, PiUser } from "react-icons/pi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axios from "axios";
import moment from "moment-timezone";
import { ContextAuth } from "@/presentation/provider/provider_auth";
import { find_cliente, veiculo_info } from "@/domain/entities";
import {
  CheckIcon,
  ChevronsUpDownIcon,
  CircleCheckBig,
  Plus,
  Save,
  Trash2,
  User,
  Wrench,
} from "lucide-react";
import { ContextLoading } from "@/presentation/provider/provider_loading";
import { Input } from "@/presentation/components/ui/input";
import { ContextAlert } from "@/presentation/provider/provider_alert";
import { Controller, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/presentation/components/ui/dialog";
import LabelInput from "@/presentation/components/ui/label-input";
import { Label } from "@/presentation/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";
import { MARCA_CARROS, MARCA_MOTOS } from "@/infra/constants";
import { DialogProps } from "@radix-ui/react-dialog";
import { refresh } from "next/cache";
import { IconePeca } from "../../peca";
import { MdOutlineBuild } from "react-icons/md";

export default function Info() {
  const searchParams = useSearchParams();
  const [editavel, setEditavel] = useState<boolean>(false);
  const uuid = searchParams.get("uuid-veiculo")!;
  const { headers } = useContext(ContextAuth);
  const { setStateLoading } = useContext(ContextLoading);
  const { data: veiculo, isLoading } = useQuery<veiculo_info>({
    queryKey: [`veiculo-${uuid}`],
    queryFn: async () => {
      return await axios
        .get(`/api/veiculo/find/${uuid}`, {
          headers: headers,
        })
        .then((response) => {
          return response.data.result;
        });
    },
  });

  useEffect(() => {
    setStateLoading(true);
    if (!isLoading) setStateLoading(false);
  }, [isLoading]);

  function ElementDados({
    titulo,
    data,
  }: {
    titulo: string;
    data: string | null | undefined;
  }) {
    return (
      <div className="w-[45%] max-lg:!w-[100%] p-5 text-center rounded-sm border relative font-semibold flex justify-center items-center">
        <span className="absolute text-sm text-stone-400 top-1 left-2">
          {titulo.toUpperCase()}
        </span>{" "}
        <span className="text-xl">{data ? data.toUpperCase() : "N/A"}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {veiculo && (
        <EditarVeiculo
          veiculo_info={veiculo!}
          open={editavel}
          onOpenChange={setEditavel}
        />
      )}
      <div>
        <div className="border-b py-2 flex justify-between items-center">
          <span>Informações do veiculo</span>
          <Button className=" h-[35px]" onClick={() => setEditavel(!editavel)}>
            Editar
            <FiEdit />
          </Button>
        </div>
        <div
          className={cn(
            "h-[20px] text-white rounded-b-sm text-center font-bold text-xs flex items-center justify-center",
            veiculo?.veiculo?.status === "LIVRE" ? "bg-green-600" : "bg-red-600"
          )}
        >
          {veiculo?.veiculo?.status === "LIVRE" && <span>Livre</span>}
          {veiculo?.veiculo?.status === "ALUGADO" && <span>Alugado</span>}
        </div>
      </div>
      <div className="border rounded-sm flex flex-wrap p-5 gap-5 justify-center relative">
        <span className="text-stone-600 font-bold w-full">Informações</span>
        <ElementDados titulo="tipo" data={veiculo?.veiculo?.tipo} />
        <ElementDados titulo="modelo" data={veiculo?.veiculo?.modelo} />
        <ElementDados titulo="modelo" data={veiculo?.veiculo?.marca} />
        <ElementDados titulo="placa" data={veiculo?.veiculo?.placa_veicular} />
        <ElementDados
          titulo="km"
          data={`${veiculo?.veiculo?.km.toString()}Km`}
        />
        <ElementDados titulo="renavam" data={veiculo?.veiculo?.renavam} />
        <ElementDados titulo="chassi" data={veiculo?.veiculo?.chassi} />
      </div>
      <div className="border rounded-sm flex flex-wrap p-5 gap-5 justify-center relative">
        <span className="text-stone-600 font-bold w-full">Financeiro</span>
        <div
          className={cn(
            "grow basis-[250px] p-10 text-center rounded-sm border relative font-semibold",
            veiculo?.veiculo?.status === "ALUGADO"
              ? "border-green-400 text-green-600"
              : "border-stone-400 text-stone-600"
          )}
        >
          <span className="absolute text-sm top-1 left-2 ">ALUGUEL</span>{" "}
          <span className="text-xl flex justify-center items-center">
            {Intl.NumberFormat("pt-br", {
              currency: "BRL",
              style: "currency",
            }).format(veiculo?.veiculo?.valor_aluguel!)}
            {veiculo?.veiculo?.status === "ALUGADO" ? (
              <IoCaretUpOutline />
            ) : (
              <TiMinus />
            )}
          </span>
        </div>
        <div
          className={cn(
            "grow basis-[250px] p-10 text-center rounded-sm border relative font-semibold",
            veiculo?.veiculo?.status === "ALUGADO"
              ? "border-red-400 text-red-600"
              : "border-stone-400 text-stone-600"
          )}
        >
          <span className="absolute text-sm top-1 left-2 ">MANUTENÇÃO</span>{" "}
          <span className="text-xl flex justify-center items-center">
            {Intl.NumberFormat("pt-br", {
              currency: "BRL",
              style: "currency",
            }).format(veiculo?.veiculo?.valor_manutencao!)}
            {veiculo?.veiculo?.status === "ALUGADO" ? (
              <IoCaretDownOutline />
            ) : (
              <TiMinus />
            )}
          </span>
        </div>
        <div
          className={cn(
            "grow basis-[250px] p-10 text-center rounded-sm border relative font-semibold",
            veiculo?.veiculo?.status === "ALUGADO"
              ? "border-red-400 text-red-600"
              : "border-stone-400 text-stone-600"
          )}
        >
          <span className="absolute text-sm top-1 left-2 ">SEGURO</span>{" "}
          <span className="text-xl flex justify-center items-center border-red-400 text-red-600">
            {Intl.NumberFormat("pt-br", {
              currency: "BRL",
              style: "currency",
            }).format(veiculo?.veiculo?.valor_seguro!)}
            <IoCaretDownOutline />
          </span>
        </div>
      </div>
      <div className="border rounded-sm flex flex-wrap p-5 gap-5 justify-center relative">
        <span className="text-stone-600 font-bold w-full">
          Peças vinculadas
        </span>
        {veiculo?.pecas?.map((peca, i) => {
          return (
            <div
              key={i}
              className="grow basis-[100%] text-center rounded-sm border relative font-semibold overflow-hidden"
            >
              <div
                className="absolute bg-yellow-300 h-full rounded-sm transition-all duration-500 right-0"
                style={{
                  width: `${Math.min(
                    (peca.peca.km_aviso / peca.peca.km_troca) * 100,
                    100
                  )}%`,
                  opacity: 0.3,
                }}
              >
                <span>% AVISO</span>
              </div>
              <div
                className="absolute bg-stone-300 h-full rounded-sm transition-all duration-500"
                style={{
                  width: `${Math.min(
                    (peca.veiculo_peca.km_registro / peca.peca.km_troca) * 100,
                    100
                  )}%`,
                  opacity: 0.3,
                }}
              >
                {" "}
              </div>

              <div className="relative p-5 flex items-center justify-end">
                <span className="absolute text-xs top-2 left-2">
                  {peca.peca.tipo.replaceAll("_", " ")}
                </span>

                <div className="relative rounded-lg p-2 bg-stone-200">
                  {IconePeca[peca.peca.tipo] || (
                    <MdOutlineBuild className="w-[35px] h-[35px]" />
                  )}
                </div>

                <span className="absolute text-xs bottom-0.5 left-2 text-stone-400">
                  {peca.veiculo_peca.km_registro}km | {peca.peca.km_troca}km
                </span>

                <span className="absolute text-xs bottom-0.5 right-2 text-stone-600">
                  {Math.round(
                    Math.min(
                      (peca.veiculo_peca.km_registro / peca.peca.km_troca) *
                        100,
                      100
                    )
                  )}
                  %
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {veiculo?.veiculo?.status === "ALUGADO" && (
        <div className="border rounded-sm flex flex-wrap p-5 gap-5 justify-center relative">
          <span className="text-stone-600 font-bold w-full">
            Cliente Vinculado
          </span>
          <div className="grow basis-[100%] pt-10 pl-5 pr-5 pb-5 text-center rounded-sm border relative font-semibold flex items-center justify-end">
            <span className="absolute text-sm top-2 left-2 ">
              {veiculo?.cliente?.nome_completo}
            </span>

            <div className="flex gap-3 text-xs justify-between w-full items-center">
              <div className="flex flex-col gap-2 items-start">
                <span>
                  CPF:{" "}
                  {veiculo?.cliente?.num_cpf.replace(
                    /(\d{3})(\d{3})(\d{3})(\d{1,2})/,
                    "$1.$2.$3-$4"
                  )}
                </span>
                <span>DATA DE CONTRATO: {veiculo?.cliente?.data_contrato}</span>
                {veiculo?.cliente?.data_fim_contrato && (
                  <span>
                    DATA DE VENCIMENTO: {veiculo?.cliente?.data_fim_contrato}
                  </span>
                )}
                <span>
                  VALOR FINAL:{" "}
                  {Intl.NumberFormat("pt-br", {
                    currency: "BRL",
                    style: "currency",
                  }).format(veiculo.cliente?.total_pagar!)}
                </span>
              </div>
              <div>
                <div className="relative rounded-lg p-2 bg-stone-200">
                  <PiUser
                    className={
                      "w-[20px] h-[20px] stroke-stone-500 fill-stone-500"
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type Props = React.ComponentProps<FC<DialogProps>> & {
  veiculo_info: veiculo_info;
};

function EditarVeiculo({ veiculo_info, ...props }: Props) {
  const { register, handleSubmit, setValue, control, getValues, watch } =
    useForm<veiculo_info>();
  const [open, setOpen] = useState(false);
  const { headers } = useContext(ContextAuth);
  const { drop_alert } = useContext(ContextAlert);
  const { startLoading } = useContext(ContextLoading);
  const queryClient = useQueryClient();
  const [cpf_cliente, setcpf_cliente] = useState<string>();
  const [pecas, setpecas] = useState<
    {
      veiculo_peca: veiculo_peca;
      peca: peca;
    }[]
  >([]);

  // preencher valores iniciais
  useLayoutEffect(() => {
    setValue("veiculo", veiculo_info.veiculo);
    setValue("cliente", veiculo_info.cliente);
    setpecas(veiculo_info.pecas ?? []);
    setcpf_cliente(veiculo_info.cliente?.num_cpf ?? "");
    queryClient.fetchQuery({
      queryKey: ["list_pecas"],
      queryFn: async () => {
        return await axios
          .get("/api/peca/find", {
            headers: headers,
          })
          .then((response) => {
            return response.data.result;
          });
      },
    });
    queryClient.fetchQuery({
      queryKey: ["list_clientes"],
      queryFn: async () => {
        return await axios
          .get("/api/cliente/find", {
            headers: headers,
          })
          .then((response) => {
            return response.data.result;
          });
      },
    });
  }, [veiculo_info]);

  const { mutateAsync: update_veiculo } = useMutation({
    mutationFn: async (data: veiculo_info) => {
      startLoading(
        axios
          .put(
            `/api/veiculo/update/${data.veiculo.uuid}`,
            {
              ...data,
              pecas: pecas,
              cliente: {
                num_cpf: cpf_cliente,
              },
            },
            { headers }
          )
          .then(async (response) => {
            drop_alert(response.data.type, response.data.m);
            props.onOpenChange!(false);
            queryClient.invalidateQueries({
              queryKey: [`veiculo-${data.veiculo.uuid}`],
            });
          })
          .catch((e) =>
            drop_alert(
              e.response?.data?.type ?? "error",
              e.response?.data?.m ?? "Erro ao salvar"
            )
          )
      );
    },
  });

  const add_peca = useCallback(() => {
    const nova: {
      veiculo_peca: veiculo_peca;
      peca: peca;
    } = {
      veiculo_peca: {
        veiculo_uuid: veiculo_info.veiculo.uuid,
        peca_id: 0,
        km_registro: 0,
        data_ultima_troca: new Date(),
        status: true,
      },
      peca: {
        id: null,
      },
    } as any;

    const nova_lista = [...pecas, nova];
    setpecas(nova_lista);
  }, [pecas, veiculo_info]);

  return (
    <Dialog {...props}>
      <DialogContent className="flex flex-col gap-10 max-h-[90vh] overflow-y-auto">
        <DialogTitle>Editar Veículo</DialogTitle>

        <form
          onSubmit={handleSubmit((data) => update_veiculo(data))}
          className="flex flex-col gap-5 w-full"
        >
          {/* INFORMAÇÕES BÁSICAS */}
          <div className="border rounded-sm flex flex-col gap-5 p-5">
            <LabelInput {...register("veiculo.modelo")} id="Modelo" required />
            <LabelInput
              {...register("veiculo.placa_veicular")}
              id="Placa"
              required
            />
            <LabelInput {...register("veiculo.renavam")} id="Renavam" />
            <LabelInput {...register("veiculo.chassi")} id="Chassi" />

            {/* Tipo */}
            <div className="flex flex-col gap-3 max-w-[500px]">
              <Label>Tipo</Label>
              <Controller
                control={control}
                name="veiculo.tipo"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
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

            {/* Marca */}
            <div className="flex flex-col gap-3 max-w-[500px]">
              <Label>Marca</Label>
              <Controller
                control={control}
                name="veiculo.marca"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Marca" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel className="text-white font-bold bg-primary">
                          Motos
                        </SelectLabel>
                        {MARCA_MOTOS.sort().map((m, i) => (
                          <SelectItem key={i} value={`${m}-M`}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel className="text-white font-bold bg-primary">
                          Carros
                        </SelectLabel>
                        {MARCA_CARROS.sort().map((m, i) => (
                          <SelectItem key={i} value={`${m}-C`}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <LabelInput
              {...register("veiculo.km")}
              id="Km"
              required
              type="number"
            />
          </div>

          {/* FINANCEIRO */}
          <div className="border rounded-sm flex flex-col gap-5 p-5">
            <LabelInput
              {...register("veiculo.valor_aluguel")}
              id="Valor do Aluguel"
              type="number"
            />
            <LabelInput
              {...register("veiculo.valor_seguro")}
              id="Valor do Seguro / Mês"
              type="number"
            />
          </div>

          {/* CLIENTE VINCULADO */}
          <div className="border rounded-sm flex flex-col gap-5 p-5">
            <div className="flex justify-between items-center">
              <span className="font-semibold flex items-center gap-2">
                <User className="w-4 h-4" /> Cliente Vinculado
              </span>
            </div>

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className=" justify-between"
                >
                  {queryClient.getQueryData<find_cliente>(["list_clientes"])
                    ? queryClient
                        .getQueryData<find_cliente>(["list_clientes"])
                        ?.find((c) => c.num_cpf === cpf_cliente)?.nome_completo
                    : "Selecione um cliente..."}
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command value={cpf_cliente}>
                  <CommandInput placeholder="CPF do cliente" />
                  <CommandList>
                    <CommandGroup>
                      {queryClient
                        .getQueryData<find_cliente>(["list_clientes"])
                        ?.map((c, i) => (
                          <CommandItem
                            key={i}
                            value={c.num_cpf}
                            onSelect={(currentValue) => {
                              setcpf_cliente(currentValue);
                              setOpen(false);
                            }}
                          >
                            <User className={cn("mr-2 h-4 w-4")} />
                            {`${c.nome_completo} - ${c.num_cpf.replace(
                              /(\d{3})(\d{3})(\d{3})(\d{1,2})/,
                              "$1.$2.$3-$4"
                            )}`}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* PEÇAS */}
          <div className="border rounded-sm flex flex-col gap-5 p-5">
            <div className="flex justify-between items-center">
              <span className="font-semibold flex items-center gap-2">
                <Wrench className="w-4 h-4" /> Peças vinculadas
              </span>
              <Button
                type="button"
                variant="secondary"
                onClick={add_peca}
                className="flex gap-2"
              >
                <Plus size={14} /> Adicionar peça
              </Button>
            </div>

            {pecas.length === 0 && (
              <span className="text-stone-500 text-sm">
                Nenhuma peça vinculada
              </span>
            )}

            {pecas.map((p, i) => (
              <div
                key={p.veiculo_peca.id}
                className={cn(
                  "border rounded-md px-3 pt-10 pb-5 flex flex-col gap-10 relative",
                  !p.veiculo_peca.status && "opacity-30"
                )}
              >
                <div className="absolute top-2 right-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => {
                      setpecas((prev) =>
                        prev.map((x) =>
                          x.veiculo_peca.id === p.veiculo_peca.id
                            ? {
                                ...x,
                                veiculo_peca: {
                                  ...x.veiculo_peca,
                                  status: !x.veiculo_peca.status,
                                },
                              }
                            : x
                        )
                      );
                    }}
                  >
                    {p.veiculo_peca.status ? (
                      <Trash2 className="w-4 h-4 text-red-500" />
                    ) : (
                      <CircleCheckBig className="w-4 h-4 text-green-500" />
                    )}
                  </Button>
                </div>
                <div className="flex flex-col gap-3  max-w-[500px]">
                  <Label
                    className={cn(
                      "after:ml-0.5 after:text-red-500 after:content-['*']"
                    )}
                  >
                    Peça
                  </Label>

                  <Select
                    defaultValue={p.peca.id ? p.peca.id.toString() : ""}
                    onValueChange={(e) => {
                      p.peca.id = parseInt(e);
                    }}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecionar a peça" />
                    </SelectTrigger>
                    <SelectContent>
                      {queryClient
                        .getQueryData<peca[]>(["list_pecas"])
                        ?.map((p) => (
                          <SelectItem key={p.id} value={p.id.toString()}>
                            {p.tipo.replaceAll("_", " ")} - {p.marca}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <LabelInput
                  id={`KM Registro`}
                  type="number"
                  defaultValue={p.veiculo_peca.km_registro}
                  onChange={(e) =>
                    (p.veiculo_peca.km_registro = parseInt(
                      e.currentTarget.value
                    ))
                  }
                />
                <LabelInput
                  id={`Data Última Troca`}
                  type="date"
                  defaultValue={
                    p.veiculo_peca.data_ultima_troca
                      ? new Date(p.veiculo_peca.data_ultima_troca)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    (p.veiculo_peca.data_ultima_troca = moment(
                      e.currentTarget.value
                    ).toDate())
                  }
                />
              </div>
            ))}
          </div>

          <Button type="submit">Salvar Alterações</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
