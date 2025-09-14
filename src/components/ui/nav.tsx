import Image from "next/image";
import { ReactNode } from "react";
import { IoBarChartOutline } from "react-icons/io5";
import { FiMenu } from "react-icons/fi";
import { Button } from "./button";
import { useSearchParams } from "next/navigation";
import Router from "next/router";
import { cn } from "@/lib/utils";
import { LuCar } from "react-icons/lu";

export default function Nav({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const status = eval(searchParams.get("status")!);
  const asPath = Router.asPath.replace(/\?\D+/, "");

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
          if (path) Router.push(path);
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
          path="/"
        />
        <ItemList
          icon={<LuCar className="w-[20px] h-[20px]" />}
          title="Veiculos"
          path="/veiculos"
        />
      </ul>
    );
  };

  return (
    <>
      <nav
        className={cn(
          "relative bg-white h-full px-5 py-10 w-[300px] flex items-center justify-start border-r gap-10 flex-col max-sm:-left-full max-sm:absolute z-40 transition-all",
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
      <div className="sticky bg-white top-0 w-full h-[80px] flex items-center justify-between px-5 border-b min-sm:hidden z-40">
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

      <div className="relative w-[calc(100%-300px)] h-full overflow-auto p-5 max-sm:w-full max-sm:h-[calc(100%-80px)]">
        {children}
      </div>
    </>
  );
}
