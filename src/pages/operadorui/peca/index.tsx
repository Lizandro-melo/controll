import { Button } from "@/presentation/components/ui/button";
import { FiBox, FiPlus } from "react-icons/fi";
import { Input } from "@/presentation/components/ui/input";
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
import { HiOutlineFilter } from "react-icons/hi";
import { GoSearch } from "react-icons/go";
import { PiBatteryCharging, PiEngine, PiSteeringWheel } from "react-icons/pi";
import { MdLightbulb, MdOutlineBuild } from "react-icons/md";
import { GiCarWheel, GiCarDoor, GiGearStickPattern } from "react-icons/gi";
import { FaBolt, FaOilCan, FaCogs, FaFan } from "react-icons/fa";
import { TbSteeringWheel, TbEngine, TbCircleDotted } from "react-icons/tb";
import { BsFillCarFrontFill } from "react-icons/bs";
import {
  FC,
  JSX,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/presentation/components/ui/dialog";
import LabelInput from "@/presentation/components/ui/label-input";
import { Controller, useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";
import { Label } from "@/presentation/components/ui/label";
import { peca } from "@prisma/logic";
import { PiTire } from "react-icons/pi";
import { cn } from "@/presentation/lib/utils";
import { MdFilterDrama } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { X } from "lucide-react";

import { TIPO_PECA } from "@/infra/constants";
import { ContextAlert } from "@/presentation/provider/provider_alert";
import { ContextAuth } from "@/presentation/provider/provider_auth";
import { ContextLoading } from "@/presentation/provider/provider_loading";
import { response } from "@/domain/entities";

export default function Pecas() {
  const [stateNewPeca, setStateNewPeca] = useState<boolean>(false);
  const [filter, setFilter] = useState("");
  const queryClient = useQueryClient();
  const { headers } = useContext(ContextAuth);
  const { data: pecas } = useQuery<peca[]>({
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
          <div className="relative w-full flex items-center">
            <Input
              placeholder="Tipo"
              className="pr-14"
              value={filter}
              onInput={(e) => {
                setFilter(e.currentTarget.value);
                const value = e.currentTarget.value.toUpperCase();
                if (value === "") {
                  queryClient.fetchQuery({ queryKey: ["list_pecas"] });
                }
                const pecas = queryClient.getQueryData<peca[]>(["list_pecas"]);
                const find_veiculo = pecas?.filter((v) =>
                  v.tipo?.toUpperCase().includes(value)
                );
                queryClient.setQueryData(["list_pecas"], find_veiculo);
              }}
            />
            <X
              className="absolute w-[20px] h-[20px] right-5 cursor-pointer"
              onClick={() => {
                setFilter("");
                queryClient.fetchQuery({ queryKey: ["list_pecas"] });
              }}
            />
          </div>
        </div>

        {pecas && pecas.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>TIPO</TableHead>
                <TableHead>MARCA</TableHead>
                <TableHead>TEMPO DE VALIDADE</TableHead>
                <TableHead>TIPO DE VALIDADE</TableHead>
                <TableHead>KM DE TROCA</TableHead>
                <TableHead>KM PARA AVISO</TableHead>
                <TableHead>PREÇO</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pecas.map((peca, i) => (
                <ShowPeca peca={peca} key={i} />
              ))}
            </TableBody>
          </Table>
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
  const { register, handleSubmit, reset, control, watch } = useForm<peca>();
  const { headers } = useContext(ContextAuth);
  const { drop_alert } = useContext(ContextAlert);
  const { startLoading } = useContext(ContextLoading);
  const queryClient = useQueryClient();
  const tipo_vencimento = watch("tipo_vencimento");
  const { mutateAsync: create_peca } = useMutation({
    mutationFn: async (data: peca) => {
      startLoading(
        axios
          .put("/api/peca/create", data, {
            headers: headers,
          })
          .then((response) => {
            drop_alert(response.data.type, response.data.m);
            props.onOpenChange!(false);
            reset();
            queryClient.fetchQuery({ queryKey: ["list_pecas"] });
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
        <DialogTitle>Cadastrar uma nova peça</DialogTitle>
        <div className="relative overflow-y-auto min-h-[550px]">
          <form
            onSubmit={handleSubmit((data) => create_peca(data))}
            className="flex flex-col gap-5 absolute  w-full"
          >
            <div className="flex flex-col gap-5">
              <div className="border rounded-sm flex flex-col gap-5 p-5">
                <div className="flex flex-col gap-3 max-w-[500px]">
                  <Label className="after:text-red-500 after:content-['*']">
                    Tipo da Peça
                  </Label>
                  <Controller
                    control={control}
                    name="tipo"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        required
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIPO_PECA.sort().map((p, i) => {
                            return (
                              <SelectItem key={i} value={p}>
                                {p.replace("_", " ")}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <LabelInput required {...register("marca")} id="Marca" />
              </div>
              <div className="border rounded-sm flex flex-col gap-5 p-5">
                <div className="flex flex-col gap-3 max-w-[500px]">
                  <Label className="after:ml-0.5 after:text-red-500 after:content-['*']">
                    Tipo do vencimento
                  </Label>
                  <Controller
                    control={control}
                    name="tipo_vencimento"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        required
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TEMPO">Tempo</SelectItem>
                          <SelectItem value="KM">Km</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                {tipo_vencimento === "KM" && (
                  <>
                    <LabelInput
                      {...register("km_troca")}
                      id="KM para troca"
                      placeholder="Ex: 20000"
                      type="number"
                      required
                    />
                    <LabelInput
                      {...register("km_aviso")}
                      id="KM para aviso"
                      placeholder="Ex: 18000"
                      type="number"
                      required
                    />
                  </>
                )}
                {tipo_vencimento === "TEMPO" && (
                  <>
                    <div className="flex flex-col gap-3 max-w-[500px]">
                      <Label className="after:ml-0.5 after:text-red-500 after:content-['*']">
                        Tipo do vencimento
                      </Label>
                      <Controller
                        control={control}
                        name="tipo_vida_util"
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value!}
                            required
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ANOS">Anos</SelectItem>
                              <SelectItem value="MESES">Meses</SelectItem>
                              <SelectItem value="DIAS">Dias</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <LabelInput
                      id="Tempo"
                      type="number"
                      {...register("vida_util")}
                      placeholder="Digite o tempo!"
                    />
                  </>
                )}
                <LabelInput
                  {...register("preco_medio")}
                  id="Preço médio (R$)"
                  placeholder="Ex: 450"
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

function ShowPeca({ peca }: { peca: peca }) {
  const [stateEditPeca, setStateEditPeca] = useState<boolean>(false);
  const [pecaSelect, setPecaSelect] = useState<peca>();
  return (
    <>
      <EditarPeca
        open={stateEditPeca}
        onOpenChange={setStateEditPeca}
        peca={pecaSelect}
        key={peca.id}
      />
      <TableRow
        onClick={() => {
          setPecaSelect(peca);
          setStateEditPeca(true);
        }}
        className="cursor-pointer"
      >
        <TableCell className="bg-blue-400 font-extrabold text-white">
          {peca.tipo.replaceAll("_", " ")}
        </TableCell>
        <TableCell>{peca.marca}</TableCell>
        <TableCell>{peca.tipo_vencimento}</TableCell>
        <TableCell>
          {peca.vida_util} {peca.tipo_vida_util === "ANOS" && "Anos"}
          {peca.tipo_vida_util === "MESES" && "Meses"}
          {peca.tipo_vida_util === "DIAS" && "DIAS"}
        </TableCell>
        <TableCell>{peca.km_troca === 0 ? "-" : peca.km_troca} Km</TableCell>
        <TableCell className="bg-yellow-400 font-extrabold text-white">
          {peca.km_aviso === 0 ? "-" : peca.km_aviso} Km
        </TableCell>

        <TableCell className="bg-red-400 font-extrabold text-white">
          {Intl.NumberFormat("pt-br", {
            currency: "BRL",
            style: "currency",
          }).format(peca.preco_medio!)}
        </TableCell>
      </TableRow>
    </>
  );
}

function EditarPeca({
  open,
  onOpenChange,
  peca,
}: {
  open: any;
  onOpenChange: any;
  peca?: peca;
}) {
  const { register, handleSubmit, reset, control, setValue, watch } =
    useForm<peca>({
      defaultValues: {
        ...peca,
      },
    });

  const tipo_vencimento = watch("tipo_vencimento");

  const { headers } = useContext(ContextAuth);
  const { drop_alert } = useContext(ContextAlert);
  const { startLoading } = useContext(ContextLoading);
  const queryClient = useQueryClient();
  const { mutateAsync: create_peca } = useMutation({
    mutationFn: async (data: peca) => {
      startLoading(
        axios
          .post(`/api/peca/update`, data, {
            headers: headers,
          })
          .then((response) => {
            drop_alert(response.data.type, response.data.m);
            onOpenChange!(false);
            reset();
            queryClient.fetchQuery({ queryKey: ["list_pecas"] });
          })
          .catch((e) => {
            const response: response = e.response.data;
            drop_alert(response.type, response.m);
          })
      );
    },
  });

  useEffect(() => {
    if (peca) {
      reset({
        ...peca,
      });
    }
  }, [peca, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col gap-10 ">
        <DialogTitle>Editar informações da peça</DialogTitle>
        <div className="relative overflow-y-auto min-h-[550px]">
          <form
            onSubmit={handleSubmit((data) => create_peca(data))}
            className="flex flex-col gap-5 absolute  w-full"
          >
            <div className="flex flex-col gap-5">
              <div className="border rounded-sm flex flex-col gap-5 p-5">
                <div className="flex flex-col gap-3 max-w-[500px]">
                  <Label className="after:text-red-500 after:content-['*']">
                    Tipo da Peça
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
                          {TIPO_PECA.sort().map((p, i) => {
                            return (
                              <SelectItem key={i} value={p}>
                                {p.replace("_", " ")}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <LabelInput required {...register("marca")} id="Marca" />
              </div>
              <div className="border rounded-sm flex flex-col gap-5 p-5">
                {tipo_vencimento === "KM" && (
                  <>
                    <LabelInput
                      {...register("km_troca")}
                      id="KM para troca"
                      placeholder="Ex: 20000"
                      type="number"
                      required
                    />
                    <LabelInput
                      {...register("km_aviso")}
                      id="KM para aviso"
                      placeholder="Ex: 18000"
                      type="number"
                      required
                    />
                  </>
                )}
                {tipo_vencimento === "TEMPO" && (
                  <>
                    <div className="flex flex-col gap-3 max-w-[500px]">
                      <Label className="after:ml-0.5 after:text-red-500 after:content-['*']">
                        Tipo do vencimento
                      </Label>
                      <Controller
                        control={control}
                        name="tipo_vida_util"
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value!}
                            required
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ANOS">Anos</SelectItem>
                              <SelectItem value="MESES">Meses</SelectItem>
                              <SelectItem value="DIAS">Dias</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <LabelInput
                      id="Tempo"
                      type="number"
                      {...register("vida_util")}
                      placeholder="Digite o tempo!"
                    />
                  </>
                )}

                <LabelInput
                  {...register("preco_medio")}
                  id="Preço médio (R$)"
                  placeholder="Ex: 450"
                  type="text"
                  required
                />
              </div>
            </div>
            <Button>Editar</Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const IconePeca: Record<string, JSX.Element> = {
  PNEU: <PiTire className="w-[35px] h-[35px]" />,
  PASTILHA_FREIO: <MdOutlineBuild className="w-[35px] h-[35px]" />,
  DISCO_FREIO: <MdOutlineBuild className="w-[35px] h-[35px]" />,
  SAPATA_FREIO: <MdOutlineBuild className="w-[35px] h-[35px]" />,

  EMBREAGEM_PLATO: <GiGearStickPattern className="w-[35px] h-[35px]" />,
  EMBREAGEM_DISCO: <GiGearStickPattern className="w-[35px] h-[35px]" />,
  EMBREAGEM_ROLAMENTO: <GiGearStickPattern className="w-[35px] h-[35px]" />,
  MOLAS_EMBREAGEM: <GiGearStickPattern className="w-[35px] h-[35px]" />,

  CORRENTE_TRANSMISSAO: <FaCogs className="w-[35px] h-[35px]" />,
  COROA_TRANSMISSAO: <FaCogs className="w-[35px] h-[35px]" />,
  PINHAO_TRANSMISSAO: <FaCogs className="w-[35px] h-[35px]" />,

  CORREIA_DENTADA: <FaCogs className="w-[35px] h-[35px]" />,
  CORREIA_ALTERNADOR: <FaCogs className="w-[35px] h-[35px]" />,
  CORREIA_ACESSORIOS: <FaCogs className="w-[35px] h-[35px]" />,

  VELA_IGNICAO: <FaBolt className="w-[35px] h-[35px]" />,

  // AMORTECEDOR: <GiCarSuspension className="w-[35px] h-[35px]" />,
  // AMORTECEDOR_DIANTEIRO: <GiCarSuspension className="w-[35px] h-[35px]" />,
  // AMORTECEDOR_TRASEIRO: <GiCarSuspension className="w-[35px] h-[35px]" />,
  // BUCHA_SUSPENSAO: <GiCarSuspension className="w-[35px] h-[35px]" />,
  // PIVO_SUSPENSAO: <GiCarSuspension className="w-[35px] h-[35px]" />,

  TERMINAL_DIRECAO: <TbSteeringWheel className="w-[35px] h-[35px]" />,
  ROLAMENTO_DIRECAO: <TbCircleDotted className="w-[35px] h-[35px]" />,

  COXIM_MOTOR: <TbEngine className="w-[35px] h-[35px]" />,
  COXIM_CAMBIO: <TbEngine className="w-[35px] h-[35px]" />,

  BATERIA: <PiBatteryCharging className="w-[35px] h-[35px]" />,
  ESCOVA_ALTERNADOR: <PiEngine className="w-[35px] h-[35px]" />,
  ESCOVA_MOTOR_PARTIDA: <PiEngine className="w-[35px] h-[35px]" />,
  LAMPADA: <MdLightbulb className="w-[35px] h-[35px]" />,

  ROLAMENTO_RODA: <GiCarWheel className="w-[35px] h-[35px]" />,

  CABO_EMBREAGEM: <GiCarDoor className="w-[35px] h-[35px]" />,
  CABO_ACELERADOR: <GiCarDoor className="w-[35px] h-[35px]" />,
  CABO_FREIO: <GiCarDoor className="w-[35px] h-[35px]" />,

  FILTRO_AR: <MdFilterDrama className="w-[35px] h-[35px]" />,
  FILTRO_OLEO: <FaOilCan className="w-[35px] h-[35px]" />,
  FILTRO_COMBUSTIVEL: <FaOilCan className="w-[35px] h-[35px]" />,
  FILTRO_CABINE: <FaFan className="w-[35px] h-[35px]" />,

  CONSUMIVEL_OLEO_MOTOR: <FaOilCan className="w-[35px] h-[35px]" />,
  CONSUMIVEL_FLUIDO_FREIO: <FaOilCan className="w-[35px] h-[35px]" />,
  CONSUMIVEL_FLUIDO_ARREFECIMENTO: <FaOilCan className="w-[35px] h-[35px]" />,

  MANOPLA: <BsFillCarFrontFill className="w-[35px] h-[35px]" />,
  PEDALEIRA: <BsFillCarFrontFill className="w-[35px] h-[35px]" />,
};
