import Image from "next/image";
import { ReactNode, useContext } from "react";
import { IoBarChartOutline } from "react-icons/io5";
import { FiAlertTriangle, FiBox, FiMenu, FiUsers } from "react-icons/fi";
import { Button } from "./button";
import { useSearchParams } from "next/navigation";
import Router from "next/router";
import { cn } from "@/presentation/lib/utils";
import { LuDoorOpen } from "react-icons/lu";

import { LuCar } from "react-icons/lu";
import { ContextAuth } from "@/presentation/provider/provider_auth";

export default function Nav({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const status = eval(searchParams.get("status")!);
  const asPath = Router.asPath.replace(/\?\D+/, "");
  const { loginOff } = useContext(ContextAuth);

  const handleState = (status: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", `${status}`);
    Router.push(`?${params.toString()}`);
  };

  const ItemList = ({
    icon,
    title,
    path,
  }: {
    icon: ReactNode;
    title: string;
    path?: string;
  }) => {
    return (
      <li
        className={cn(
          "hover:bg-stone-100 bg-white cursor-pointer text-xs w-full p-3 flex gap-5 items-end rounded-lg font-bold transition-colors",
          path === asPath && "bg-stone-100!",
        )}
        onClick={() => {
          switch (path) {
            case "/":
              loginOff();
              break;
            default:
              Router.push(path!);
              break;
          }
        }}
      >
        {icon}
        {title}
      </li>
    );
  };

  const NavItens = () => {
    return (
      <ul className="flex flex-col gap-2 w-full overflow-auto">
        <ItemList
          icon={<IoBarChartOutline className="w-[20px] h-[20px]" />}
          title="Dashboard"
          path="/operadorui"
        />
        <ItemList
          icon={<LuCar className="w-[20px] h-[20px]" />}
          title="Veiculos"
          path="/operadorui/veiculos"
        />
        <ItemList
          icon={<FiBox className="w-[20px] h-[20px]" />}
          title="Peças"
          path="/operadorui/peca"
        />
        <ItemList
          icon={<FiUsers className="w-[20px] h-[20px]" />}
          title="Clientes"
          path="/operadorui/cliente"
        />
        <ItemList
          icon={<FiAlertTriangle className="w-[20px] h-[20px]" />}
          title="Alertas"
          path="/operadorui/alert"
        />
        <ItemList
          icon={<LuDoorOpen className="w-[20px] h-[20px]" />}
          title="Sair"
          path="/"
        />
      </ul>
    );
  };

  return (
    <>
      <nav
        className={cn(
          "relative bg-white h-full px-5 py-10 w-[300px] flex items-center justify-start border-r gap-10 flex-col max-lg:-left-full max-lg:absolute z-40 transition-all",
          status && "left-0!",
        )}
      >
        <Image
          src={"/assets/letreiro.png"}
          width={150}
          height={100}
          alt="Logo"
        />
        <NavItens />
      </nav>
      <div className="sticky bg-white top-0 w-full h-[80px] flex items-center justify-between px-5 border-b min-lg:hidden z-40">
        <Image
          src={"/assets/letreiro.png"}
          width={120}
          height={100}
          alt="Logo"
        />
        <Button
          variant={"ghost"}
          className="cursor-pointer"
          onClick={() => handleState(!status)}
        >
          <FiMenu />
        </Button>
      </div>
      <div className="relative w-[calc(100%-300px)] h-full overflow-auto p-5 max-lg:w-full max-lg:h-[calc(100%-80px)]!">
        {children}
      </div>
    </>
  );
}
