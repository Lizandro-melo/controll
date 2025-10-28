import { createContext, ReactNode, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { cn } from "../lib/utils";

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
