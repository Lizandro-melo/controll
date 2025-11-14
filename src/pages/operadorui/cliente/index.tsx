import { Button } from "@/presentation/components/ui/button";
import { FiUsers, FiPlus } from "react-icons/fi";
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
import { useForm } from "react-hook-form";
import { Label } from "@/presentation/components/ui/label";
import { cn } from "@/presentation/lib/utils";
import { PiUser } from "react-icons/pi";
import { cliente } from "@prisma/logic";
import { create_cliente, find_cliente, response } from "@/domain/entities";
import moment from "moment-timezone";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ContextAlert } from "@/presentation/provider/provider_alert";
import { ContextLoading } from "@/presentation/provider/provider_loading";
import axios from "axios";
import { ContextAuth } from "@/presentation/provider/provider_auth";

export default function Clientes() {
  const [stateNewCliente, setStateNewCliente] = useState<boolean>();
  const { headers } = useContext(ContextAuth);
  const { drop_alert } = useContext(ContextAlert);
  const { startLoading } = useContext(ContextLoading);
  const { data: list_clientes } = useQuery<find_cliente>({
    queryKey: ["list_clientes"],
    queryFn: async () => {
      return await axios
        .get("/api/cliente/create", {
          headers: headers,
        })
        .then((response) => {
          return response.data.result;
        });
    },
  });

  return (
    <>
      <NovoCliente open={stateNewCliente} onOpenChange={setStateNewCliente} />
      <div className="flex flex-col gap-5">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Gestão de Clientes</h1>
          <div className="flex gap-4">
            <Button
              className="cursor-pointer"
              type="button"
              onClick={() => setStateNewCliente(true)}
            >
              <FiPlus /> Novo cliente
            </Button>
          </div>
        </div>

        <div className="flex">
          <Button className="cursor-pointer">
            <HiOutlineFilter />
          </Button>
          <div className="relative w-full flex items-center">
            <Input placeholder="Nome do cliente" className="pr-14" />
            <GoSearch className="absolute w-[20px] h-[20px] right-5" />
          </div>
        </div>

        <div className="relative border item-resume p-10 rounded-lg flex flex-col justify-center items-center gap-3">
          <FiUsers className="stroke-stone-500 w-[30px] h-[30px]" />
          <div className="flex flex-col items-center">
            <span className="font-semibold">Nenhum cliente cadastrado</span>
            <span className="font-semibold text-sm text-stone-400">
              Comece cadastrando seus clientes na plataforma
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

function NovoCliente({ ...props }: React.ComponentProps<FC<any>>) {
  const { register, handleSubmit, reset } = useForm<create_cliente>();

  const queryClient = useQueryClient();
  const { drop_alert } = useContext(ContextAlert);
  const { startLoading } = useContext(ContextLoading);
  const { headers } = useContext(ContextAuth);
  const { mutateAsync: cadastrar } = useMutation({
    mutationFn: async (create_cliente: create_cliente) => {
      startLoading(
        axios
          .put("/api/cliente/create", create_cliente, {
            headers: headers,
          })
          .then((response) => {
            drop_alert(response.data.type, response.data.m);
            props.onOpenChange!(false);
            reset();
            queryClient.invalidateQueries({ queryKey: ["list_clientes"] });
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
        <DialogTitle>Cadastrar novo cliente</DialogTitle>
        <div className="relative overflow-y-auto min-h-[550px]">
          <form
            className="flex flex-col gap-5 absolute w-full"
            onSubmit={handleSubmit((data) => cadastrar(data))}
          >
            <div className="flex flex-col gap-5">
              <div>
                <span>Dados pessoais</span>
                <div className="border rounded-sm flex flex-col gap-5 p-5">
                  <LabelInput
                    required
                    {...register("nome_completo")}
                    id="Nome do cliente"
                  />
                  <LabelInput
                    required
                    {...register("data_nascimento")}
                    type="date"
                    id="Data de nascimento"
                    value={new Date().toISOString().split("T")[0]}
                  />
                  <LabelInput required {...register("num_cpf")} id="CPF" />
                  <LabelInput
                    required
                    {...register("num_cel")}
                    id="Numero de celular"
                    type="tel"
                  />
                  <LabelInput
                    required
                    {...register("correio_eletronico")}
                    id="E-mail"
                    type="email"
                  />
                </div>
              </div>
              <div>
                <span>Endereço</span>
                <div className="border rounded-sm flex flex-col gap-5 p-5">
                  <LabelInput
                    required
                    {...register("numero_residencial")}
                    id="CEP"
                  />
                  <LabelInput required {...register("codigo_postal")} id="N°" />
                </div>
              </div>
              <div>
                <span>Dados de contrato</span>
                <div className="border rounded-sm flex flex-col gap-5 p-5">
                  <LabelInput
                    required
                    {...register("data_contrato")}
                    id="Data de inicio do contrato"
                    type="date"
                  />
                  <LabelInput
                    {...register("data_fim_contrato")}
                    id="Data final"
                    type="date"
                  />
                </div>
              </div>
            </div>
            <Button>Cadastrar</Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// function ShowCliente({ cliente }: { cliente: ClienteFull }) {
//   const pessoa = cliente.pessoa[0];

//   return (
//     <div
//       key={cliente.uuid}
//       className={cn(
//         "relative border p-5 rounded-lg flex gap-3 cursor-pointer active:scale-95 transition-all",
//         cliente.status ? "border-green-600" : "border-red-600",
//       )}
//     >
//       <div className="grid place-content-center basis-0.5 grow max-lg:hidden">
//         <PiUser className="w-[35px] h-[35px]" />
//       </div>
//       <div className="basis-0.5 flex-col text-xs gap-2 flex grow justify-center">
//         <div>
//           <span>Nome: {pessoa?.nome_completo}</span>
//         </div>
//         <div>
//           <span>CPF: {pessoa?.cpf}</span>
//         </div>
//         <div>
//           <span>Celular: {pessoa?.numero_celular}</span>
//         </div>
//         <div>
//           <span>Status: {cliente.status ? "Ativo" : "Inativo"}</span>
//         </div>
//       </div>
//       <div className="basis-0.5 flex-col text-xs gap-2 flex grow justify-center">
//         <span className="text-stone-600">E-mail: {cliente.email}</span>
//         <span className="text-stone-400">
//           Código: {cliente.codigo_registro}
//         </span>
//       </div>
//     </div>
//   );
// }
