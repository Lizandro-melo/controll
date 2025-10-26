import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import Router from "next/router";
import { Montserrat } from "next/font/google";
import { setCookie, parseCookies, destroyCookie } from "nookies";

import Image from "next/image";
import Central from "@/utils/components/ui/central";
import Nav from "@/utils/components/ui/nav";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { AiOutlineLoading } from "react-icons/ai";
import { cn } from "../lib/utils";

const montFont = Montserrat({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export type LoginData = {
  login: string;
  senha: string;
};

export const ContextLoading = createContext(
  {} as {
    startLoading: (promise: Promise<any>) => void;
  },
);

export function ProviderLoading({ children }: { children: ReactNode }) {
  const [stateLoading, setStateLoading] = useState<boolean>(false);

  const startLoading = async (promise: Promise<any>) => {
    if (stateLoading) return;
    setStateLoading(true);
    try {
      await promise;
    } finally {
      setStateLoading(false);
    }
  };

  return (
    <ContextLoading.Provider
      value={{
        startLoading,
      }}
    >
      <div
        className={cn(
          "w-full h-full place-content-center absolute bg-white opacity-40 hidden z-50",
          stateLoading && "!grid",
        )}
      >
        <AiOutlineLoading className="w-[100px] h-[100px] animate-spin" />
      </div>
      {children}
    </ContextLoading.Provider>
  );
}
