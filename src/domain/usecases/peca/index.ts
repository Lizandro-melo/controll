import AuthRepository from "@/data/repositories/AuthRepository";
import PecaRepository from "@/data/repositories/PecaRepository";
import { peca } from "@prisma/logic";

const auth_repository = new AuthRepository();
const peca_repository = new PecaRepository();

export async function findAllPeca({
  session,
}: {
  session: string;
}): Promise<peca[]> {
  const { uuid_auth } = await auth_repository.consult_uuid_auth_by_session({
    session,
  });
  return await peca_repository.consult_pecas_by_uuid_auth({ uuid_auth });
}

export async function createPeca({
  session,
  peca,
}: {
  session: string;
  peca: peca;
}) {
  const { uuid_auth } = await auth_repository.consult_uuid_auth_by_session({
    session,
  });
  try {
    await peca_repository.create_peca({ peca, uuid_auth });
  } catch {
    throw new Error("Não foi possivel criar a peça!");
  }
}

export async function updatePeca({
  session,
  peca,
}: {
  session: string;
  peca: peca;
}) {
  const { uuid_auth } = await auth_repository.consult_uuid_auth_by_session({
    session,
  });

  try {
    await peca_repository.update_peca_by_uuid_auth({ peca, uuid_auth });
  } catch {
    throw new Error("Não foi possivel editar a peça!");
  }
}
