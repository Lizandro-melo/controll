import { Button } from "@/presentation/components/ui/button";
import LabelInput from "@/presentation/components/ui/label-input";
import { formatInputLogin } from "@/presentation/lib/utils";
import Image from "next/image";
import { useForm } from "react-hook-form";

export default function Pass() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ nova_senha: string; conf_senha: string }>();

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
          {...register("nova_senha", {
            required: true,
          })}
          id="Nova senha"
          placeholder="Digite sua nova senha"
          maxLength={14}
          onInput={formatInputLogin}
        />
        <div className="flex flex-col gap-2">
          <LabelInput
            placeholder="Confirme sua nova senha"
            id="Confirmar senha"
            {...register("conf_senha", { required: true })}
            type="password"
          />
        </div>
      </div>
      <div>
        <Button type="submit" className="px-10 text-sm">
          Entrar
        </Button>
      </div>
    </form>
  );
}
