import { cliente, peca, pessoa, veiculo, veiculo_peca } from "@prisma/client";

export type response = {
  result?: any;
  m?: any;
  type: "sucess" | "error";
};

export type dash_data = {
  total_veiculos: number;
  total_veiculos_alugados: number;
  total_pecas: number;
  total_clientes_ativos: number;
  receita_potencial: number;
  veiculos_alerta: number;
  ticket_medio: number;
};

export type register = {
  nome_completo: string;
  num_cpf: string;
  num_cel: string;
  correio_eletronico: string;
  data_nascimento: string;
  codigo_postal: string;
  numero_residencial: string;
  senha: string;
  senha_confirmacao: string;
};

export type veiculo_info = {
  veiculo: veiculo;
  pecas?: veiculo_peca[];
  cliente?: { pessoa: pessoa; cliente: cliente } | undefined;
};
