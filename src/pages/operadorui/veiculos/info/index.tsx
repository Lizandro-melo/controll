import { peca, veiculo, veiculo_peca } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import Router from "next/router";
import { useLayoutEffect, useState } from "react";
import { veiculos_dev } from "..";
import { Button } from "@/utils/front/components/ui/button";
import { FiEdit } from "react-icons/fi";
import { cn } from "@/utils/front/lib/utils";
import { IoCaretDownOutline, IoCaretUpOutline } from "react-icons/io5";
import { TiMinus } from "react-icons/ti";
import { PiTire, PiUser } from "react-icons/pi";

export default function Info() {
  const searchParams = useSearchParams();
  const uuid = searchParams.get("uuid-veiculo")!;
  const [veiculo, setVeiculo] = useState<veiculo>();

  useLayoutEffect(() => {
    switch (uuid) {
      case "":
        Router.push("/");
        break;
      default:
        setVeiculo(veiculos_dev.filter((v) => v.uuid === uuid)[0]);
        break;
    }
  }, []);

  function ElementDados({
    titulo,
    data,
  }: {
    titulo: string;
    data: string | null | undefined;
  }) {
    return (
      <div className="w-[45%] max-lg:!w-[100%] p-5 text-center rounded-sm border relative font-semibold">
        <span className="absolute text-sm text-stone-400 top-1 left-2">
          {titulo.toUpperCase()}
        </span>{" "}
        <span className="text-xl">{data ? data.toUpperCase() : "N/A"}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="border-b py-2 flex justify-between items-center">
          <span>Informações do veiculo</span>
          <Button className=" h-[35px]">
            Editar
            <FiEdit />
          </Button>
        </div>
        <div
          className={cn(
            "h-[20px] text-white rounded-b-sm text-center font-bold text-xs flex items-center justify-center",
            veiculo?.status === "LIVRE" ? "bg-green-600" : "bg-red-600",
          )}
        >
          {veiculo?.status === "LIVRE" && <span>Livre</span>}
          {veiculo?.status === "ALUGADO" && <span>Alugado</span>}
        </div>
      </div>
      <div className="border rounded-sm flex flex-wrap p-5 gap-5 justify-center relative">
        <span className="text-stone-600 font-bold w-full">Informações</span>
        <ElementDados titulo="tipo" data={veiculo?.tipo} />
        <ElementDados titulo="modelo" data={veiculo?.modelo} />
        <ElementDados titulo="placa" data={veiculo?.placa_veicular} />
        <ElementDados titulo="km" data={veiculo?.km.toString()} />
        <ElementDados titulo="renavam" data={veiculo?.renavam} />
        <ElementDados titulo="chassi" data={veiculo?.chassi} />
      </div>
      <div className="border rounded-sm flex flex-wrap p-5 gap-5 justify-center relative">
        <span className="text-stone-600 font-bold w-full">Financeiro</span>
        <div
          className={cn(
            "grow basis-[250px] p-10 text-center rounded-sm border relative font-semibold",
            veiculo?.status === "ALUGADO"
              ? "border-green-400 text-green-600"
              : "border-stone-400 text-stone-600",
          )}
        >
          <span className="absolute text-sm top-1 left-2 ">ALUGUEL</span>{" "}
          <span className="text-xl flex justify-center items-center">
            {Intl.NumberFormat("pt-br", {
              currency: "BRL",
              style: "currency",
            }).format(veiculo?.valor_aluguel!)}
            {veiculo?.status === "ALUGADO" ? <IoCaretUpOutline /> : <TiMinus />}
          </span>
        </div>
        <div
          className={cn(
            "grow basis-[250px] p-10 text-center rounded-sm border relative font-semibold",
            veiculo?.status === "ALUGADO"
              ? "border-red-400 text-red-600"
              : "border-stone-400 text-stone-600",
          )}
        >
          <span className="absolute text-sm top-1 left-2 ">MANUTENÇÃO</span>{" "}
          <span className="text-xl flex justify-center items-center">
            {Intl.NumberFormat("pt-br", {
              currency: "BRL",
              style: "currency",
            }).format(veiculo?.valor_manutencao!)}
            {veiculo?.status === "ALUGADO" ? (
              <IoCaretDownOutline />
            ) : (
              <TiMinus />
            )}
          </span>
        </div>
        <div
          className={cn(
            "grow basis-[250px] p-10 text-center rounded-sm border relative font-semibold",
            veiculo?.status === "ALUGADO"
              ? "border-red-400 text-red-600"
              : "border-stone-400 text-stone-600",
          )}
        >
          <span className="absolute text-sm top-1 left-2 ">SEGURO</span>{" "}
          <span className="text-xl flex justify-center items-center">
            {Intl.NumberFormat("pt-br", {
              currency: "BRL",
              style: "currency",
            }).format(veiculo?.valor_seguro!)}
            <IoCaretDownOutline />
          </span>
        </div>
      </div>
      <div className="border rounded-sm flex flex-wrap p-5 gap-5 justify-center relative">
        <span className="text-stone-600 font-bold w-full">
          Peças vinculadas
        </span>
        {Array.from<veiculo_peca>({ length: 5 }).map((peca, i) => {
          return (
            <div className="grow basis-[100%]  text-center rounded-sm border relative font-semibold ">
              <div className="absolute opacity-30 bg-stone-300 w-[60%] h-full rounded-sm"></div>
              <div className="relative p-5 flex items-center justify-end">
                <span className="absolute text-xs top-2 left-2 ">
                  TIPO DA PEÇA
                </span>
                <div className="relative rounded-lg p-2 bg-stone-200">
                  <PiTire
                    className={
                      "w-[20px] h-[20px] stroke-stone-500 fill-stone-500"
                    }
                  />
                </div>
                <span className="absolute text-xs bottom-0.5 left-2 text-stone-400">
                  00000km | 00000km
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {veiculo?.status === "ALUGADO" && (
        <div className="border rounded-sm flex flex-wrap p-5 gap-5 justify-center relative">
          <span className="text-stone-600 font-bold w-full">
            Cliente Vinculado
          </span>
          <div className="grow basis-[100%] pt-10 pl-5 pr-5 pb-5 text-center rounded-sm border relative font-semibold flex items-center justify-end">
            <span className="absolute text-sm top-2 left-2 ">
              NOME COMPLRETO
            </span>

            <div className="flex gap-3 text-xs justify-between w-full items-center">
              <div className="flex flex-col gap-2 items-start">
                <span>CPF: 000.000.000-00</span>
                <span>DATA DE CONTRATO: 00/00/0000</span>
                <span>DATA DE VENCIMENTO: 00/00/0000</span>
                <span>
                  TOTAL PAGO:{" "}
                  {Intl.NumberFormat("pt-br", {
                    currency: "BRL",
                    style: "currency",
                  }).format(veiculo?.valor_aluguel!)}
                </span>
              </div>
              <div>
                <div className="relative rounded-lg p-2 bg-stone-200">
                  <PiUser
                    className={
                      "w-[20px] h-[20px] stroke-stone-500 fill-stone-500"
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
