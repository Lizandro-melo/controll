import { Button } from "@/components/ui/button";
import { LuCar } from "react-icons/lu";
import { FiBox, FiPlus, FiUsers } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { HiOutlineFilter } from "react-icons/hi";
import { GoSearch } from "react-icons/go";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import LabelInput from "@/components/ui/label-input";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tipo_veiculo } from "@prisma/client";

export default function Clientes() {
  // const [stateNewVeiculo, setStateNewVeiculo] = useState<boolean>();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  return (
    <div className="flex flex-col gap-5">
      {/* <Dialog open={stateNewVeiculo} onOpenChange={setStateNewVeiculo}>
        <DialogContent className="flex flex-col gap-10">
          <DialogTitle>Cadastrar um veiculo</DialogTitle>
          <form className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <LabelInput {...register("modelo")} />
              <div className="flex flex-col gap-3 min-w-[300px] max-w-[500px]">
                <Label>Tipo do veiculo</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MOTO">Moto</SelectItem>
                    <SelectItem value="CARRO">Carro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <LabelInput {...register("km")} />
              <LabelInput {...register("seguro")} />
              <LabelInput {...register("placa")} />
            </div>
            <Button>Cadastrar</Button>
          </form>
        </DialogContent>
      </Dialog> */}
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Gestão de clientes</h1>
        <div className="flex gap-4">
          <Button
            className="cursor-pointer"
            type="button"
            // onClick={() => setStateNewVeiculo(true)}
          >
            <FiPlus /> Novo cliente
          </Button>
        </div>
      </div>
      <div className="flex">
        <Button className="cursor-pointer">
          <HiOutlineFilter />
        </Button>
        <div className="relative w-full flex items-center">
          <Input placeholder="Nome do cliente" className="pr-14" />
          <GoSearch className="absolute w-[20px] h-[20px] right-5" />
        </div>
      </div>
      <div className="relative border item-resume p-10 rounded-lg flex flex-col justify-center items-center gap-3">
        <FiUsers className="stroke-stone-500 w-[30px] h-[30px]" />
        <div className="flex flex-col items-center">
          <span className="font-semibold">Nenhum cliente cadastrado</span>
          <span className="font-semibold text-sm text-stone-400">
            Comece cadastrar seus clientes na plataforma
          </span>
        </div>
      </div>
    </div>
  );
}
