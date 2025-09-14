import { Button } from "@/components/ui/button";
import LabelInput from "@/components/ui/label-input";
import Image from "next/image";
import { FormEvent, FormEventHandler } from "react";
import { useForm } from "react-hook-form";

export default function Auth() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const formatInputLogin = (e: FormEvent<HTMLInputElement>) => {
    e.currentTarget.value = e.currentTarget.value
      .replace(/\D/g, "")
      .slice(0, 11);
    if (e.currentTarget.value.length <= 3)
      e.currentTarget.value = e.currentTarget.value;
    if (e.currentTarget.value.length <= 6)
      e.currentTarget.value = e.currentTarget.value.replace(
        /(\d{3})(\d{1,3})/,
        "$1.$2",
      );
    if (e.currentTarget.value.length <= 9)
      e.currentTarget.value = e.currentTarget.value.replace(
        /(\d{3})(\d{3})(\d{1,3})/,
        "$1.$2.$3",
      );
    e.currentTarget.value = e.currentTarget.value.replace(
      /(\d{3})(\d{3})(\d{3})(\d{1,2})/,
      "$1.$2.$3-$4",
    );
  };

  return (
    <form className="border shadow-2xl rounded-xl p-14 max-sm:px-5 max-sm:py-14 max-sm:w-full flex justify-center items-center flex-col gap-10">
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
          {...register("Login")}
          maxLength={14}
          onInput={formatInputLogin}
        />
        <div className="flex flex-col gap-2">
          <LabelInput {...register("Senha")} type="password" />
          <span className="text-xs">
            Esqueceu a senha?{" "}
            <a className="text-[val(--text-prymary-color)]" href="#">
              clique aqui!
            </a>
          </span>
        </div>
      </div>
      <div>
        <Button className="px-10 text-lg">Entrar</Button>
      </div>
    </form>
  );
}
