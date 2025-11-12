import AuthRepository from "@/data/repositories/AuthRepository";
import VeiculoRepository from "@/data/repositories/VeiculoRepository";
import { veiculo_info } from "@/domain/entities";
import { veiculo } from "@prisma/logic";

const auth_repository = new AuthRepository();
const veiculo_repository = new VeiculoRepository();

export async function findAllVeiculos({
  session,
}: {
  session: string;
}): Promise<veiculo[]> {
  const { uuid_auth } = await auth_repository.consult_uuid_auth_by_session({
    session,
  });
  return await veiculo_repository.consult_veiculos_by_uuid_auth({ uuid_auth });
}

export async function findUniqueVeiculo({
  session,
  uuid_veiculo,
}: {
  session: string;
  uuid_veiculo: string;
}): Promise<veiculo_info> {
  const { uuid_auth } = await auth_repository.consult_uuid_auth_by_session({
    session,
  });
  return await veiculo_repository.consult_veiculo_info_by_uuid_veiculo({
    uuid_veiculo,
    uuid_auth,
  });
}

export async function createVeiculo({
  session,
  veiculo,
}: {
  session: string;
  veiculo: veiculo;
}) {
  const { uuid_auth } = await auth_repository.consult_uuid_auth_by_session({
    session,
  });
  await veiculo_repository.create_veiculo({ veiculo, uuid_auth });
}
