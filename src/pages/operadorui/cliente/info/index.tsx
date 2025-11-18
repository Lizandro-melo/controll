import {
  cliente,
  endereco_cliente,
  peca,
  veiculo,
  veiculo_peca,
} from "@prisma/logic";
import { useSearchParams } from "next/navigation";
import Router from "next/router";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/presentation/components/ui/table";
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
  Trash,
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
import { Textarea } from "@/presentation/components/ui/textarea";
import { celular_cliente } from "@prisma/logic";
import { BsWhatsapp } from "react-icons/bs";
import { ShowVeiculo } from "../../veiculos";

export default function Info() {
  const searchParams = useSearchParams();
  const { register, handleSubmit, setValue, control, getValues, watch } =
    useForm<cliente_info>();
  const queryClient = useQueryClient();
  const [contatos, setContatos] = useState<celular_cliente[]>([]);
  const [enderecos, setEnderecos] = useState<endereco_cliente[]>([]);
  const [enderecosAll, setEnderecosAll] = useState<
    {
      state: string;
      city: string;
      neighborhood: string;
      street: string;
      service: string;
    }[]
  >([]);
  const [veiculos, setVeiculos] = useState<veiculo[]>([]);
  const uuid = searchParams.get("uuid-cliente")!;
  const { headers } = useContext(ContextAuth);
  const { setStateLoading, startLoading } = useContext(ContextLoading);
  const { drop_alert } = useContext(ContextAlert);
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

  const { mutateAsync: update_cliente } = useMutation({
    mutationFn: async (data: cliente_info) => {
      startLoading(
        axios
          .put(
            `/api/cliente/update`,
            {
              ...data,
              telefones: contatos,
              enderecos: enderecos,
            },
            { headers }
          )
          .then(async (response) => {
            drop_alert(response.data.type, response.data.m);
            queryClient.invalidateQueries({
              queryKey: [`cliente-${uuid}`],
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

  useLayoutEffect(() => {
    setValue("cliente", cliente?.cliente!);
    setContatos(cliente?.telefones ?? []);
    setEnderecos(cliente?.enderecos ?? []);
    setVeiculos(cliente?.veiculos_vinculados ?? []);
    for (const e of cliente?.enderecos ?? []) {
      axios
        .get(`https://brasilapi.com.br/api/cep/v1/${e.codigo_postal}`)
        .then((response) => {
          setEnderecosAll((prev) => [...prev, { ...response.data }]);
        })
        .catch(() => {
          return;
        });
    }
  }, [cliente]);

  const verificarCepUnique = (value: string, i: number) => {
    axios
      .get(`https://brasilapi.com.br/api/cep/v1/${value}`)
      .then((response) => {
        setEnderecosAll((prev) =>
          prev.map((endereco, index) => index === i && { ...response.data })
        );
      })
      .catch(() => {
        return;
      });
  };

  useEffect(() => {
    setStateLoading(true);
    if (!isLoading) setStateLoading(false);
  }, [isLoading]);

  const dados = (data: any) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit((data) => update_cliente(data))}
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col gap-5">
        <div className="border rounded-sm flex flex-col gap-5 p-5 w-full">
          <span className="font-semibold text-sm">Dados pessoais</span>
          <div className="flex flex-wrap gap-5 justify-center w-full">
            <LabelInput
              className="grow basis-[400px] h-[50px]"
              id="Nome completo"
              required
              {...register("cliente.nome_completo")}
            />
            <LabelInput
              className="grow basis-[400px] h-[50px]"
              id="CPF"
              disabled
              readOnly
              {...register("cliente.num_cpf", {
                disabled: true,
              })}
            />
            <LabelInput
              required
              className="grow basis-[400px] h-[50px]"
              id="Data de nascimento"
              type="date"
              {...register("cliente.data_nascimento")}
            />
            <LabelInput
              required
              className="grow basis-[400px] h-[50px]"
              id="E-mail"
              type=""
              {...register("cliente.correio_eletronico")}
            />
          </div>
        </div>
        <div className="border rounded-sm flex flex-col gap-5 p-5 w-full">
          <span className="font-semibold text-sm">Contrato</span>
          <div className="flex flex-wrap gap-5 justify-center w-full">
            <LabelInput
              className="grow basis-[400px] h-[50px]"
              id="Inicio de contrato"
              required
              type="date"
              {...register("cliente.data_contrato")}
            />
            <LabelInput
              className="grow basis-[400px] h-[50px]"
              id="Final de contrato"
              type="date"
              {...register("cliente.data_fim_contrato")}
            />
          </div>
        </div>
        <div className="border rounded-sm flex flex-col gap-5 p-5 w-full">
          <div className="flex flex-wrap gap-5 justify-center w-full">
            <div className={`flex flex-col gap-3 w-full grow basis-[400px] `}>
              <Label className={cn()}>Observação do Cliente</Label>
              <Textarea {...register("cliente.observacao")} />
            </div>
          </div>
        </div>
        <div className="border rounded-sm flex flex-col gap-5 p-5 w-full">
          <span className="font-semibold text-sm">Contatos</span>
          <div className="flex flex-wrap gap-5 justify-center w-full">
            {contatos.map((c, i) => {
              return (
                <div className="flex w-full items-end gap-5">
                  <LabelInput
                    key={i}
                    value={c.num_cel}
                    onChange={(ev) => {
                      const value = ev.currentTarget.value ?? "";
                      setContatos((prev) =>
                        prev.map((contato, index) =>
                          index === i ? { ...contato, num_cel: value } : contato
                        )
                      );
                    }}
                    id={`Contato ${i}`}
                    required
                  />
                  <Button
                    type="button"
                    className="cursor-pointer bg-[#25D366]"
                    onClick={() => {
                      Router.push(
                        `https://api.whatsapp.com/send?phone=${c.num_cel}`
                      );
                    }}
                  >
                    <BsWhatsapp />
                  </Button>
                  <Button
                    type="button"
                    className="cursor-pointer bg-red-700"
                    onClick={() => {
                      setContatos((prev) =>
                        prev.filter((co, index) => i !== index)
                      );
                    }}
                  >
                    <Trash />
                  </Button>
                </div>
              );
            })}
          </div>
          <Button
            type="button"
            className="cursor-pointer"
            onClick={() => {
              setContatos((prev) => {
                const newContato: celular_cliente = {
                  id: 0,
                  num_cel: "",
                  status: true,
                  uuid_cliente: uuid,
                };
                return [...prev, newContato];
              });
            }}
          >
            <Plus />
          </Button>
        </div>
        <div className="border rounded-sm flex flex-col gap-5 p-5 w-full">
          <span className="font-semibold text-sm">Endereços</span>
          <div className="flex flex-wrap gap-5 justify-center w-full">
            {enderecos.map((e, i) => {
              return (
                <div className="flex flex-wrap gap-5 w-full border p-5">
                  <div className="flex flex-wrap gap-5 w-full">
                    <LabelInput
                      className="grow basis-[400px] h-[50px]"
                      key={i}
                      value={e.codigo_postal}
                      onChange={(ev) => {
                        const value = ev.currentTarget.value ?? "";

                        verificarCepUnique(value, i);

                        setEnderecos((prev) =>
                          prev.map((endereco, index) =>
                            index === i
                              ? { ...endereco, codigo_postal: value }
                              : endereco
                          )
                        );
                      }}
                      id={`CEP`}
                      required
                    />
                    <LabelInput
                      className="grow basis-[400px] h-[50px]"
                      key={i}
                      value={enderecosAll[i]?.street ?? ""}
                      id={`Endereço`}
                      disabled
                      readOnly
                    />
                    <LabelInput
                      className="grow basis-[400px] h-[50px]"
                      key={i}
                      value={e.numero_residencial}
                      id={`Nº`}
                      required
                    />
                    <LabelInput
                      className="grow basis-[400px] h-[50px]"
                      key={i}
                      value={enderecosAll[i]?.city ?? ""}
                      id={`Cidade`}
                      disabled
                      readOnly
                    />
                    <LabelInput
                      className="grow basis-[400px] h-[50px]"
                      key={i}
                      value={enderecosAll[i]?.state ?? ""}
                      id={`UF`}
                      disabled
                      readOnly
                    />
                    <LabelInput
                      className="grow basis-[400px] h-[50px]"
                      key={i}
                      value={enderecosAll[i]?.neighborhood ?? ""}
                      id={`Bairro`}
                      disabled
                      readOnly
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="border rounded-sm flex flex-col gap-5 p-5 w-full">
          <span className="font-semibold text-sm">Veiculos vinculados</span>
          <div className="flex flex-wrap gap-5 justify-center w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>TIPO</TableHead>
                  <TableHead>MODELO</TableHead>
                  <TableHead>MARCA</TableHead>
                  <TableHead>PLACA</TableHead>
                  <TableHead>KM</TableHead>
                  <TableHead>VALOR SEGURO</TableHead>
                  <TableHead>VALOR MANUTENÇÃO</TableHead>
                  <TableHead>VALOR ALUGUEL</TableHead>
                  <TableHead>STATUS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {veiculos.map((veiculo, i) => {
                  return <ShowVeiculo veiculo={veiculo} key={i} />;
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        <Button>Atualizar informações</Button>
      </div>
    </form>
  );
}
