import { Button } from "@/utils/front/components/ui/button";
import { FiUsers, FiPlus } from "react-icons/fi";
import { Input } from "@/utils/front/components/ui/input";
import { HiOutlineFilter } from "react-icons/hi";
import { GoSearch } from "react-icons/go";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/utils/front/components/ui/dialog";
import LabelInput from "@/utils/front/components/ui/label-input";
import { useForm } from "react-hook-form";
import { Label } from "@/utils/front/components/ui/label";
import { cn } from "@/utils/front/lib/utils";
import { PiUser } from "react-icons/pi";
import { auth, pessoa } from "@prisma/client";

// --------------------
// MOCK DE CLIENTES
// --------------------
export type ClienteFull = auth;

export default function Clientes() {
  const [stateNewCliente, setStateNewCliente] = useState<boolean>();

  return (
    <>
      {/* <NovoCliente open={stateNewCliente} onOpenChange={setStateNewCliente} /> */}
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

// function NovoCliente({ ...props }: React.ComponentProps<FC<any>>) {
//   const { register, handleSubmit } = useForm<ClienteFull>();

//   return (
//     <Dialog {...props}>
//       <DialogContent className="flex flex-col gap-10 ">
//         <DialogTitle>Cadastrar novo cliente</DialogTitle>
//         <div className="relative overflow-y-auto min-h-[550px]">
//           <form className="flex flex-col gap-5 absolute w-full">
//             <div className="flex flex-col gap-5">
//               <div className="border rounded-sm flex flex-col gap-5 p-5">
//                 <LabelInput {...register("nome")} id="Nome de usuário" />
//                 <LabelInput {...register("email")} id="E-mail de acesso" />
//                 <LabelInput
//                   {...register("codigo_registro")}
//                   id="Código de registro"
//                 />
//                 <LabelInput {...register("senha")} id="Senha" type="password" />
//               </div>
//               <div className="border rounded-sm flex flex-col gap-5 p-5">
//                 <LabelInput
//                   {...register("pessoa.0.nome_completo" as const)}
//                   id="Nome completo"
//                 />
//                 <LabelInput {...register("pessoa.0.cpf" as const)} id="CPF" />
//                 <LabelInput
//                   {...register("pessoa.0.numero_celular" as const)}
//                   id="Celular"
//                 />
//                 <LabelInput {...register("pessoa.0.cep" as const)} id="CEP" />
//                 <Label> Status </Label>
//                 <select
//                   {...register("status")}
//                   className="border rounded-sm p-2 text-sm outline-none"
//                 >
//                   <option value="true">Ativo</option>
//                   <option value="false">Inativo</option>
//                 </select>
//               </div>
//             </div>
//             <Button>Cadastrar</Button>
//           </form>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

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
