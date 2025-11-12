import { register } from "@/domain/entities";
import IAuthRepository from "@/domain/repositories/IAuthRepository";
import { ASSAS, DAYS_EXPIRE_SESSION, SALT_ROUNDS } from "@/infra/constants";
import { Prisma_auth, Prisma_logic } from "@/infra/db";
import { Tipo_User } from "@prisma/auth";
import { hash } from "bcrypt";
import moment from "moment-timezone";

export default class AuthRepository implements IAuthRepository {
  async consult_uuid_auth_by_session({
    session,
  }: {
    session: string;
  }): Promise<{ uuid_auth: string; id_sub: string; id_asaas: string }> {
    const auth = await Prisma_auth.historico_session
      .findUniqueOrThrow({
        where: {
          uuid: session,
        },
        include: {
          auth: true,
        },
      })
      .then((response) => {
        if (
          moment()
            .tz("America/Sao_Paulo")
            .diff(moment(response?.expira_time).tz("America/Sao_Paulo"), "d") <
          DAYS_EXPIRE_SESSION
        )
          return response?.auth;
      })
      .catch(() => {
        throw new Error("Sessão expirada!");
      });

    return {
      uuid_auth: auth?.uuid!,
      id_asaas: auth?.id_asaas!,
      id_sub: auth?.id_sub!,
    };
  }
  async consult_tipo_user_by_uuid({
    uuid_auth,
  }: {
    uuid_auth: string;
  }): Promise<Tipo_User | undefined> {
    return await Prisma_auth.auth
      .findUniqueOrThrow({
        where: {
          uuid: uuid_auth,
        },
      })
      .then((response) => response?.role)
      .catch(() => {
        throw new Error("/");
      });
  }
  async consult_uuid_auth_by_cpf({
    cpf,
  }: {
    cpf: string;
  }): Promise<{ uuid_auth: string; id_sub: string; id_asaas: string }> {
    const operador = await Prisma_logic.operador
      .findUniqueOrThrow({ where: { num_cpf: cpf } })
      .then((response) => response)
      .catch(() => {
        throw new Error("Login ou senha inválidos");
      });
    const auth = await Prisma_auth.auth
      .findUniqueOrThrow({
        where: {
          uuid: operador.uuid,
        },
      })
      .then((response) => response)
      .catch(() => {
        throw new Error("Login ou senha inválidos");
      });
    return {
      uuid_auth: auth.uuid,
      id_sub: auth.id_sub!,
      id_asaas: auth.id_asaas!,
    };
  }
  async generate_session_by_uuid({
    uuid_auth,
  }: {
    uuid_auth: string;
  }): Promise<string> {
    return await Prisma_auth.historico_session
      .create({
        data: {
          uuid_auth: uuid_auth,
          expira_time: moment()
            .tz("America/Sao_Paulo")
            .add(DAYS_EXPIRE_SESSION, "d")
            .format(),
        },
      })
      .then((response) => response.uuid);
  }
  async consult_senha_crypt_by_uuid({
    uuid_auth,
  }: {
    uuid_auth: string;
  }): Promise<string> {
    return await Prisma_auth.historico_senha
      .findFirstOrThrow({
        where: {
          uuid: uuid_auth,
          status: true,
        },
      })
      .then(async (response) => response.senha)
      .catch(() => {
        throw new Error("Login ou senha invalidos");
      });
  }
  async consult_session_by_uuid({
    uuid_auth,
  }: {
    uuid_auth: string;
  }): Promise<string> {
    return await Prisma_auth.historico_session
      .findMany({
        where: {
          uuid_auth: uuid_auth,
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
          )?.uuid!,
      );
  }
  async token_register_validation({ token }: { token: string }): Promise<void> {
    await Prisma_auth.register_token
      .findUniqueOrThrow({
        where: {
          uuid: token,
          status: true,
        },
      })
      .catch(() => {
        throw new Error("Por favor peça um novo link!");
      });
  }
  async create_operador({ ...props }: register): Promise<void> {
    const id_asaas = await ASSAS.create_client({
      cpfCnpj: props.num_cpf,
      mobilePhone: props.num_cel,
      name: props.nome_completo,
      addressNumber: props.numero_residencial,
      email: props.correio_eletronico,
      postalCode: props.codigo_postal,
    });
    const id_sub = await ASSAS.create_assinatura(id_asaas);
    const uuid_auth = (
      await Prisma_auth.auth.create({
        data: {
          role: "OPERADOR",
          id_asaas: id_asaas,
          id_sub: id_sub,
        },
      })
    ).uuid;
    await Prisma_auth.historico_senha.create({
      data: {
        senha: await hash(props.senha, SALT_ROUNDS),
        uuid: uuid_auth,
      },
    });
    await Prisma_logic.operador.create({
      data: {
        correio_eletronico: props.correio_eletronico,
        nome_completo: props.nome_completo,
        num_cpf: props.num_cpf,
        uuid: uuid_auth,
        data_nascimento: moment(props.data_nascimento).toDate(),
      },
    });
    await Prisma_logic.celular_operador.create({
      data: {
        num_cel: props.num_cel,
        uuid_operador: uuid_auth,
      },
    });
    await Prisma_logic.endereco_operador.create({
      data: {
        uuid_operador: uuid_auth,
        codigo_postal: props.codigo_postal,
        numero_residencial: props.numero_residencial,
      },
    });
  }
  async disable_token_register({ token }: { token: string }): Promise<void> {
    await Prisma_auth.register_token.update({
      where: {
        uuid: token,
        status: true,
      },
      data: { status: false },
    });
  }
}
