import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { cn } from "../lib/utils";

export const ContextLoading = createContext(
  {} as {
    startLoading: (promise: Promise<any>) => void;
    setStateLoading: Dispatch<SetStateAction<boolean>>;
  }
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
        setStateLoading,
      }}
    >
      <div
        className={cn(
          "w-full h-full place-content-center absolute bg-white opacity-40 hidden z-[100]",
          stateLoading && "!grid"
        )}
      >
        <AiOutlineLoading className="w-[100px] h-[100px] animate-spin" />
      </div>
      {children}
    </ContextLoading.Provider>
  );
}
