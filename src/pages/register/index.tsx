import { register } from "@/domain/entities";
import { Button } from "@/presentation/components/ui/button";
import LabelInput from "@/presentation/components/ui/label-input";
import { formatInputLogin } from "@/presentation/lib/utils";
import { ContextAlert } from "@/presentation/provider/provider_alert";
import { ContextLoading } from "@/presentation/provider/provider_loading";


import axios from "axios";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";

export default function Auth() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [registerBool, setRegisterBool] = useState<boolean>(false);
  const { startLoading } = useContext(ContextLoading);
  const { drop_alert } = useContext(ContextAlert);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<register>();

  const registrar_conta = async (data: register) => {
    startLoading(
      axios
        .post("/api/auth/register", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          drop_alert(response.data.type, response.data.m);
          setRegisterBool(true);
        })
        .catch((e) => {
          drop_alert(e.response.data.type, e.response.data.m);
        }),
    );
  };

  return (
    <form
      onSubmit={handleSubmit(registrar_conta)}
      className="border shadow-2xl rounded-xl p-14 max-sm:px-5 max-sm:py-14 w-full flex justify-center items-center flex-col gap-10"
    >
      <div>
        <Image
          src={"/assets/letreiro.png"}
          width={250}
          height={200}
          alt="Logo"
        />
      </div>
      {registerBool ? (
        <span className="text-2xl">Bem vindo ao Controll</span>
      ) : (
        <>
          <div className="flex max-lg:flex-col w-full h-full ">
            <div className="w-full h-full p-5 flex flex-col items-center gap-5 lg:items-end">
              <LabelInput
                className="w-full"
                id="Nome Sobrenome"
                {...register("nome_completo", { required: true })}
              />
              <LabelInput
                className="w-full"
                id="CPF"
                onInput={formatInputLogin}
                {...register("num_cpf", { required: true })}
              />
              <LabelInput
                className="w-full"
                id="Num. Celular"
                type="tel"
                {...register("num_cel", { required: true, maxLength: 11 })}
              />
              <LabelInput
                className="w-full"
                id="E-mail"
                type="email"
                {...register("correio_eletronico", { required: true })}
              />
              <LabelInput
                className="w-full"
                id="Data de nascimento"
                type="date"
                {...register("data_nascimento", { required: true })}
              />
            </div>
            <div className="w-full h-full p-5 flex flex-col items-center gap-5 lg:items-start">
              <LabelInput
                className="w-full"
                id="CEP"
                {...register("codigo_postal", { required: true, maxLength: 8 })}
              />
              <LabelInput
                className="w-full"
                id="Numero residencial"
                {...register("numero_residencial", {
                  required: true,
                  maxLength: 4,
                })}
              />
              <LabelInput
                className="w-full"
                id="Senha"
                type="password"
                {...register("senha", { required: true, minLength: 8 })}
              />
              <LabelInput
                className="w-full"
                id="Confirmar Senha"
                type="password"
                {...register("senha_confirmacao", {
                  required: true,
                  minLength: 8,
                })}
              />
            </div>
          </div>
          <p className="text-red-400">
            {errors && "Todos os campos são obrigatorios"}
          </p>
          <p className="text-red-400">
            {(errors.senha || errors.senha_confirmacao) &&
              "A senha tem que ter no mínimo 8 caracteres"}
          </p>
          <div>
            <Button type="submit" className="px-10 text-sm cursor-pointer">
              Registrar
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
