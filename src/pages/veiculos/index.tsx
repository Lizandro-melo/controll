import { Button } from "@/components/ui/button";
import { LuCar } from "react-icons/lu";
import { FiPlus } from "react-icons/fi";

export default function Veiculos() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Gestão de Veículos</h1>
        <Button className="cursor-pointer">
          <FiPlus /> Novo veiculo
        </Button>
      </div>
      <div className="relative border item-resume p-10 rounded-lg flex flex-col justify-center items-center gap-3">
        <LuCar className="stroke-stone-500 w-[30px] h-[30px]" />
        <div className="flex flex-col items-center">
          <span className="font-semibold">Nenhum veículo cadastrado</span>
          <span className="font-semibold text-sm text-stone-400">
            Comece adicionando um novo veículo à sua frota
          </span>
        </div>
      </div>
    </div>
  );
}
