import { veiculo, veiculo_peca, cliente, tipo_peca } from "@prisma/logic";

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
  veiculos_alerta: { veiculo_link: string; tipo_peca: tipo_peca[] }[];
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
  cliente?: cliente | null;
};

export type create_cliente = {
  nome_completo: string;
  num_cpf: string;
  data_nascimento: string;
  correio_eletronico: string;
  observacao?: string;
  num_cel: string;
  codigo_postal: string;
  numero_residencial: string;
  data_contrato: string;
  data_fim_contrato: string;
};
