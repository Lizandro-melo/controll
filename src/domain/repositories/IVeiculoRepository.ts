import { veiculo } from "@prisma/logic";
import { veiculo_info } from "../entities";

export default interface IVeiculoRepository {
  consult_veiculos_by_uuid_auth({
    uuid_auth,
  }: {
    uuid_auth: string;
  }): Promise<veiculo[]>;
  update_veiculo_by_uuid_veiculo({
    veiculo_info,
    uuid_auth,
  }: {
    veiculo_info: veiculo_info;
    uuid_auth: string;
  }): Promise<void>;
  consult_veiculo_info_by_uuid_veiculo({
    uuid_veiculo,
    uuid_auth,
  }: {
    uuid_veiculo: string;
    uuid_auth: string;
  }): Promise<veiculo_info>;
  create_veiculo({
    veiculo,
    uuid_auth,
  }: {
    veiculo: veiculo;
    uuid_auth: string;
  }): Promise<void>;
}
