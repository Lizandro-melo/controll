import {
  auth,
  cliente,
  peca,
  pessoa,
  Tipo_User,
  veiculo,
} from "@prisma/client";
import { PRISMA } from "../db";
import moment from "moment-timezone";
import { DAYS_EXPIRE_SESSION } from "../constants";
import { dash_data, veiculo_info } from "@/utils/types";
import Veiculos from "@/pages/operadorui/veiculos";

export const consult_pessoa_uuid_by_cpf = async (
  cpf: string,
): Promise<{ uuid: string; id_sub: string; id_asaas: string }> => {
  const pessoa = await PRISMA.pessoa
    .findUniqueOrThrow({ where: { num_cpf: cpf }, include: { auth: true } })
    .then((response) => response)
    .catch(() => {
      throw new Error("Login ou senha inválidos");
    });

  return {
    uuid: pessoa.uuid,
    id_sub: pessoa.auth.id_sub!,
    id_asaas: pessoa.auth.id_asaas!,
  };
};

export const consult_senhaCrypt_by_uuid = async (
  uuid: string,
): Promise<string> => {
  return await PRISMA.historico_senha
    .findFirstOrThrow({
      where: {
        uuid: uuid,
        status: true,
      },
    })
    .then(async (response) => response.senha)
    .catch(() => {
      throw new Error("Login ou senha invalidos");
    });
};

export const consult_session_by_uuid = async (
  uuid: string,
): Promise<string | undefined> => {
  return await PRISMA.historico_session
    .findMany({
      where: {
        uuid_auth: uuid,
      },
    })
    .then(
      (response) =>
        response.find(
          (log) =>
            moment()
              .tz("America/Sao_Paulo")
              .diff(moment(log.expira_time).tz("America/Sao_Paulo"), "d") <
            DAYS_EXPIRE_SESSION,
        )?.uuid,
    );
};

export const consult_uuid_auth_by_session = async (
  session: string,
): Promise<{ uuid: string; id_sub: string; id_asaas: string }> => {
  const uuid_auth = await PRISMA.historico_session
    .findUniqueOrThrow({
      where: {
        uuid: session,
      },
    })
    .then((response) => {
      if (
        moment()
          .tz("America/Sao_Paulo")
          .diff(moment(response?.expira_time).tz("America/Sao_Paulo"), "d") <
        DAYS_EXPIRE_SESSION
      )
        return response?.uuid_auth;
    })
    .catch(() => {
      throw new Error("Sessão Invalida");
    });
  const auth = await PRISMA.auth
    .findUnique({
      where: {
        uuid: uuid_auth,
      },
    })
    .then((response) => response);

  return {
    uuid: auth?.uuid!,
    id_asaas: auth?.id_asaas!,
    id_sub: auth?.id_sub!,
  };
};

export const consult_tipo_user_by_uuid = async (
  uuid: string,
): Promise<Tipo_User | undefined> => {
  return await PRISMA.auth
    .findUniqueOrThrow({
      where: {
        uuid: uuid,
      },
    })
    .then((response) => response?.role)
    .catch(() => {
      throw new Error("/");
    });
};

export const validation_token_register = async (token: string) => {
  await PRISMA.register_token
    .findUniqueOrThrow({
      where: {
        uuid: token,
        status: true,
      },
    })
    .catch(() => {
      throw new Error("Token de registro invalido, peça um novo link!");
    });
};

export const export_dash_data_by_uuid = async (
  uuid: string,
): Promise<dash_data> => {
  const auth = await PRISMA.auth
    .findUnique({
      where: {
        uuid: uuid,
      },
      include: {
        veiculo_operador: true,
        peca_operador: true,
        operador_cliente: true,
      },
    })
    .then((response) => response);
  const veiculos = await PRISMA.veiculo.findMany({
    where: {
      uuid: { in: auth?.veiculo_operador.map((v) => v.uuid_veiculo) },
    },
  });
  const veiculos_alugados = veiculos.filter((v) => v.status == "ALUGADO");
  const pecas = await PRISMA.peca_operador.findMany({
    where: {
      id_peca: {
        in: auth?.peca_operador.map((p) => p.id_peca),
      },
    },
  });
  const clientes = auth?.operador_cliente.filter((row) => row.status);
  const receita_potencial = veiculos_alugados.reduce(
    (acc, v) => acc + (v.valor_aluguel || 0),
    0,
  );
  const ticket_medio =
    veiculos_alugados.length > 0
      ? receita_potencial / veiculos_alugados.length
      : 0;

  return {
    total_veiculos: veiculos ? veiculos.length : 0,
    total_veiculos_alugados: veiculos_alugados ? veiculos_alugados.length : 0,
    total_pecas: pecas ? pecas.length : 0,
    receita_potencial: receita_potencial,
    ticket_medio: ticket_medio ? ticket_medio : 0,
    veiculos_alerta: 10,
    total_clientes_ativos: clientes ? clientes.length : 0,
  };
};

export const consult_veiculos_by_uuid_auth = async (
  uuid_auth: string,
): Promise<veiculo[]> => {
  return await PRISMA.veiculo_operador
    .findMany({
      where: {
        uuid_auth: uuid_auth,
      },
      include: {
        veiculo: true,
      },
    })
    .then((response) => {
      return response.map((v) => v.veiculo);
    });
};

export const consult_pecas_by_uuid_auth = async (
  uuid_auth: string,
): Promise<peca[]> => {
  return await PRISMA.peca_operador
    .findMany({
      where: {
        uuid_auth: uuid_auth,
      },
      include: {
        peca: true,
      },
    })
    .then((response) => {
      return response.map((p) => p.peca);
    });
};

export const consult_veiculo_info_by_uuid_veiculo = async (
  uuid: string,
): Promise<veiculo_info> => {
  const { cliente, pecas, veiculo } = await PRISMA.veiculo
    .findUniqueOrThrow({
      where: {
        uuid: uuid,
      },
      include: {
        veiculo_peca: true,
        cliente: true,
      },
    })
    .then((response) => {
      return {
        veiculo: response,
        pecas: response.veiculo_peca,
        cliente: response.cliente,
      };
    })
    .catch(() => {
      throw new Error("Veiculo não encontrado");
    });
  const pessoa = cliente
    ? await PRISMA.pessoa.findUnique({
        where: {
          uuid: cliente?.uuid_pessoa,
        },
      })
    : undefined;

  return {
    cliente: cliente
      ? undefined
      : {
          pessoa: pessoa!,
          cliente: cliente!,
        },
    pecas: pecas,
    veiculo: veiculo,
  };
};

export const consult_peca_by_id = async (id: string): Promise<peca> => {
  const peca = await PRISMA.peca
    .findUniqueOrThrow({
      where: {
        id: parseInt(id),
      },
    })
    .then((response) => response)
    .catch(() => {
      throw new Error("Peça não encontrada");
    });

  return peca;
};
