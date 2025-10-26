import { Button } from "@/utils/components/ui/button";
import { FiUsers, FiPlus } from "react-icons/fi";
import { Input } from "@/utils/components/ui/input";
import { HiOutlineFilter } from "react-icons/hi";
import { GoSearch } from "react-icons/go";
import { FC, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/utils/components/ui/dialog";
import LabelInput from "@/utils/components/ui/label-input";
import { useForm } from "react-hook-form";
import { Label } from "@/utils/components/ui/label";
import { cn } from "@/utils/lib/utils";
import { PiUser } from "react-icons/pi";
import { auth, pessoa } from "@prisma/client";

// --------------------
// MOCK DE CLIENTES
// --------------------
export type ClienteFull = auth & { pessoa: pessoa[] };

export const clientes_dev: ClienteFull[] = [
  {
    uuid: "u001",
    nome: "João Silva",
    codigo_registro: "CLI-001",
    email: "joao.silva@email.com",
    senha: "123456",
    status: true,
    tipo: "USER" as any,
    otp_enviado: null,
    otp_update: null,
    pessoa: [
      {
        uuid: "p001",
        nome_completo: "João da Silva",
        data_nascimento: "1990-05-12",
        cpf: "123.456.789-00",
        numero_celular: "(11) 98765-4321",
        email: "joao.silva@email.com",
        cep: "01010-000",
        foto: "",
      },
    ],
  },
  {
    uuid: "u002",
    nome: "Maria Oliveira",
    codigo_registro: "CLI-002",
    email: "maria.oliveira@email.com",
    senha: "123456",
    status: false,
    tipo: "USER" as any,
    otp_enviado: null,
    otp_update: null,
    pessoa: [
      {
        uuid: "p002",
        nome_completo: "Maria Oliveira Souza",
        data_nascimento: "1988-10-02",
        cpf: "987.654.321-00",
        numero_celular: "(21) 98888-1212",
        email: "maria.oliveira@email.com",
        cep: "22070-000",
        foto: "",
      },
    ],
  },
  {
    uuid: "u003",
    nome: "Carlos Santos",
    codigo_registro: "CLI-003",
    email: "carlos.santos@email.com",
    senha: "123456",
    status: true,
    tipo: "USER" as any,
    otp_enviado: null,
    otp_update: null,
    pessoa: [
      {
        uuid: "p003",
        nome_completo: "Carlos Alberto dos Santos",
        data_nascimento: "1992-03-20",
        cpf: "321.654.987-00",
        numero_celular: "(31) 99555-6677",
        email: "carlos.santos@email.com",
        cep: "30110-000",
        foto: "",
      },
    ],
  },
];

export default function Clientes() {
  const [stateNewCliente, setStateNewCliente] = useState<boolean>();

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

        {clientes_dev && clientes_dev.length > 0 ? (
          <div className="flex flex-col gap-5">
            {clientes_dev.map((cliente, i) => (
              <ShowCliente cliente={cliente} key={i} />
            ))}
          </div>
        ) : (
          <div className="relative border item-resume p-10 rounded-lg flex flex-col justify-center items-center gap-3">
            <FiUsers className="stroke-stone-500 w-[30px] h-[30px]" />
            <div className="flex flex-col items-center">
              <span className="font-semibold">Nenhum cliente cadastrado</span>
              <span className="font-semibold text-sm text-stone-400">
                Comece cadastrando seus clientes na plataforma
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function NovoCliente({ ...props }: React.ComponentProps<FC<any>>) {
  const { register, handleSubmit } = useForm<ClienteFull>();

  return (
    <Dialog {...props}>
      <DialogContent className="flex flex-col gap-10 ">
        <DialogTitle>Cadastrar novo cliente</DialogTitle>
        <div className="relative overflow-y-auto min-h-[550px]">
          <form className="flex flex-col gap-5 absolute w-full">
            <div className="flex flex-col gap-5">
              <div className="border rounded-sm flex flex-col gap-5 p-5">
                <LabelInput {...register("nome")} id="Nome de usuário" />
                <LabelInput {...register("email")} id="E-mail de acesso" />
                <LabelInput
                  {...register("codigo_registro")}
                  id="Código de registro"
                />
                <LabelInput {...register("senha")} id="Senha" type="password" />
              </div>
              <div className="border rounded-sm flex flex-col gap-5 p-5">
                <LabelInput
                  {...register("pessoa.0.nome_completo" as const)}
                  id="Nome completo"
                />
                <LabelInput {...register("pessoa.0.cpf" as const)} id="CPF" />
                <LabelInput
                  {...register("pessoa.0.numero_celular" as const)}
                  id="Celular"
                />
                <LabelInput {...register("pessoa.0.cep" as const)} id="CEP" />
                <Label> Status </Label>
                <select
                  {...register("status")}
                  className="border rounded-sm p-2 text-sm outline-none"
                >
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
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

function ShowCliente({ cliente }: { cliente: ClienteFull }) {
  const pessoa = cliente.pessoa[0];

  return (
    <div
      key={cliente.uuid}
      className={cn(
        "relative border p-5 rounded-lg flex gap-3 cursor-pointer active:scale-95 transition-all",
        cliente.status ? "border-green-600" : "border-red-600",
      )}
    >
      <div className="grid place-content-center basis-0.5 grow max-lg:hidden">
        <PiUser className="w-[35px] h-[35px]" />
      </div>
      <div className="basis-0.5 flex-col text-xs gap-2 flex grow justify-center">
        <div>
          <span>Nome: {pessoa?.nome_completo}</span>
        </div>
        <div>
          <span>CPF: {pessoa?.cpf}</span>
        </div>
        <div>
          <span>Celular: {pessoa?.numero_celular}</span>
        </div>
        <div>
          <span>Status: {cliente.status ? "Ativo" : "Inativo"}</span>
        </div>
      </div>
      <div className="basis-0.5 flex-col text-xs gap-2 flex grow justify-center">
        <span className="text-stone-600">E-mail: {cliente.email}</span>
        <span className="text-stone-400">
          Código: {cliente.codigo_registro}
        </span>
      </div>
    </div>
  );
}
