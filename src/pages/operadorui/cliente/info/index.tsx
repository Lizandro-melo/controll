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
import { cliente_info, find_cliente, veiculo_info } from "@/domain/entities";
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
  const { register, handleSubmit, setValue, control, getValues, watch } =
    useForm<cliente_info>();
  const uuid = searchParams.get("uuid-cliente")!;
  const { headers } = useContext(ContextAuth);
  const { setStateLoading } = useContext(ContextLoading);
  const { data: cliente, isLoading } = useQuery<cliente_info>({
    queryKey: [`cliente-${uuid}`],
    queryFn: async () => {
      return await axios
        .get(`/api/cliente/find/${uuid}`, {
          headers: headers,
        })
        .then((response) => {
          return response.data.result;
        });
    },
  });

  useLayoutEffect(() => {
    setValue("cliente", cliente?.cliente!);
  }, [cliente]);

  useEffect(() => {
    setStateLoading(true);
    if (!isLoading) setStateLoading(false);
  }, [isLoading]);

  return (
    <div className="flex flex-col gap-5">
      {/* {cliente && (
        <EditarVeiculo
          veiculo_info={veiculo!}
          open={editavel}
          onOpenChange={setEditavel}
        />
      )} */}
      <div className="">
        <div className="border rounded-sm flex flex-col gap-5 p-5 w-full">
          <span className="font-semibold text-sm">Dados pessoais</span>
          <div className="flex flex-wrap gap-5 justify-center w-full">
            <LabelInput
              className="grow  basis-[300px] h-[50px]"
              id="Nome completo"
              required
              {...register("cliente.nome_completo")}
            />
            <LabelInput
              className="grow  basis-[300px] h-[50px]"
              id="CPF"
              disabled
              readOnly
              {...register("cliente.num_cpf", {
                disabled: true,
              })}
            />
            <LabelInput
              required
              className="grow  basis-[300px] h-[50px]"
              id="Data de nascimento"
              type="date"
              defaultValue={moment(cliente?.cliente.data_nascimento)
                .toDate()
                .toISOString()}
              {...register("cliente.data_nascimento")}
            />
            <LabelInput
              className="grow  basis-[300px] h-[50px]"
              id="CPF"
              {...register("cliente.num_cpf")}
            />
            <LabelInput
              className="grow  basis-[300px] h-[50px]"
              id="CPF"
              {...register("cliente.num_cpf")}
            />
            <LabelInput
              className="grow  basis-[300px] h-[50px]"
              id="CPF"
              {...register("cliente.num_cpf")}
            />
            <LabelInput
              className="grow  basis-[300px] h-[50px]"
              id="CPF"
              {...register("cliente.num_cpf")}
            />
          </div>
        </div>
      </div>
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
                <Command>
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
