import { clsx, type ClassValue } from "clsx";
import { FormEvent } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PART_TYPES = [
  "PNEU",
  "PASTILHA_FREIO",
  "DISCO_FREIO",
  "SAPATA_FREIO",
  "EMBREAGEM_PLATO",
  "EMBREAGEM_DISCO",
  "EMBREAGEM_ROLAMENTO",
  "MOLAS_EMBREAGEM",
  "CORRENTE_TRANSMISSAO",
  "COROA_TRANSMISSAO",
  "PINHAO_TRANSMISSAO",
  "CORREIA_DENTADA",
  "CORREIA_ALTERNADOR",
  "CORREIA_ACESSORIOS",
  "VELA_IGNICAO",
  "AMORTECEDOR",
  "AMORTECEDOR_DIANTEIRO",
  "AMORTECEDOR_TRASEIRO",
  "BUCHA_SUSPENSAO",
  "PIVO_SUSPENSAO",
  "TERMINAL_DIRECAO",
  "ROLAMENTO_DIRECAO",
  "COXIM_MOTOR",
  "COXIM_CAMBIO",
  "BATERIA",
  "ESCOVA_ALTERNADOR",
  "ESCOVA_MOTOR_PARTIDA",
  "LAMPADA",
  "ROLAMENTO_RODA",
  "CABO_EMBREAGEM",
  "CABO_ACELERADOR",
  "CABO_FREIO",
  "FILTRO_AR",
  "FILTRO_OLEO",
  "FILTRO_COMBUSTIVEL",
  "FILTRO_CABINE",
  "CONSUMIVEL_OLEO_MOTOR",
  "CONSUMIVEL_FLUIDO_FREIO",
  "CONSUMIVEL_FLUIDO_ARREFECIMENTO",
  "MANOPLA",
  "PEDALEIRA",
];

export const formatInputLogin = (e: FormEvent<HTMLInputElement>) => {
  // e.currentTarget.value = e.currentTarget.value
  //   .replace(/\D/g, "")
  //   .slice(0, 11);
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
