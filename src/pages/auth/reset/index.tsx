import { Button } from "@/components/ui/button";
import LabelInput from "@/components/ui/label-input";
import { formatInputLogin } from "@/lib/utils";
import { ContextAuth, LoginData } from "@/provider/provider_auth";
import Image from "next/image";
import { FormEvent, FormEventHandler, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Router from "next/router";

export default function Reset() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ cpf: string }>();
  const [stateVerify, setStateVerify] = useState<boolean>();
  const [otp, setOtp] = useState<string>();

  const verificarUser = () => {};

  return (
    <>
      {stateVerify ? (
        <form
          method="post"
          className="border shadow-2xl rounded-xl p-14 max-sm:px-5 max-sm:py-14 max-sm:w-full flex justify-center items-center flex-col gap-10"
        >
          <p className="text-center">
            Enviamos um código para o e-mail cadastrado. Informe o código abaixo
            para continuar a redefinição da sua senha.
          </p>
          <InputOTP
            maxLength={6}
            value={otp}
            onInput={(e) => setOtp(e.currentTarget.value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <Button className="cursor-pointer">Verificar</Button>
        </form>
      ) : (
        <form
          onSubmit={handleSubmit(verificarUser)}
          method="post"
          className="border shadow-2xl rounded-xl p-14 max-sm:px-5 max-sm:py-14 max-sm:w-full flex justify-center items-center flex-col gap-10"
        >
          <p className="text-center">
            Relaxa, a gente vai te guiar para você recuperar o acesso à sua
            conta.
          </p>
          <LabelInput
            {...register("cpf")}
            placeholder="Informe seu CPF"
            maxLength={14}
            onInput={formatInputLogin}
            id="CPF"
          />
          <Button
            onClick={() => Router.push("/auth/reset/pass")}
            className="cursor-pointer"
          >
            Enviar código
          </Button>
        </form>
      )}
    </>
  );
}
