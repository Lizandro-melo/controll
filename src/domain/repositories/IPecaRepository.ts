import { peca } from "@prisma/logic";

export default interface IPecaRepository {
  consult_pecas_by_uuid_auth({
    uuid_auth,
  }: {
    uuid_auth: string;
  }): Promise<peca[]>;
  create_peca({
    peca,
    uuid_auth,
  }: {
    peca: peca;
    uuid_auth: string;
  }): Promise<void>;
  update_peca_by_uuid_auth({
    peca,
    uuid_auth,
  }: {
    peca: peca;
    uuid_auth: string;
  }): Promise<void>;
}
