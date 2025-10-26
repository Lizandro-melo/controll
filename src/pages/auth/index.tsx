import { Button } from "@/utils/components/ui/button";
import LabelInput from "@/utils/components/ui/label-input";
import { formatInputLogin } from "@/utils/lib/utils";
import { ContextAuth, LoginData } from "@/utils/provider/provider_auth";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, FormEventHandler, useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

export default function Auth() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();
  const { loginIn } = useContext(ContextAuth);

  return (
    <form
      onSubmit={handleSubmit(loginIn)}
      className="border shadow-2xl rounded-xl p-14 max-sm:px-5 max-sm:py-14 max-sm:w-full flex justify-center items-center flex-col gap-10 w-[600px]"
    >
      <div>
        <Image
          src={"/assets/letreiro.png"}
          width={250}
          height={200}
          alt="Logo"
        />
      </div>
      <div className="flex flex-col gap-4">
        <LabelInput
          {...register("login", {
            required: true,
          })}
          id="Login"
          placeholder="CPF"
          maxLength={14}
          className="w-[300px]"
          onInput={formatInputLogin}
        />
        <div className="flex flex-col gap-2">
          <LabelInput
            placeholder="Senha"
            id="Senha"
            className="w-[300px]"
            {...register("senha", { required: true })}
            type="password"
          />
          <span className="text-xs">
            Esqueceu a senha?{" "}
            <Link
              className="text-[val(--text-prymary-color)] underline cursor-pointer"
              href="/auth/reset"
            >
              clique aqui!
            </Link>
            <p className="text-red-400">
              {(errors.login || errors.senha) &&
                "Todos os campos são obrigatorios"}
            </p>
          </span>
        </div>
      </div>
      <div>
        <Button type="submit" className="px-10 text-sm cursor-pointer">
          Entrar
        </Button>
      </div>
    </form>
  );
}
