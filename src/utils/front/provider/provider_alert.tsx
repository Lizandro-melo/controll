import { createContext, ReactNode, useState } from "react";
import { cn } from "../lib/utils";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

export const ContextAlert = createContext(
  {} as {
    drop_alert: (tipo: "error" | "sucess", mensagem: string) => void;
  },
);

export function ProviderAlert({ children }: { children: ReactNode }) {
  const [stateAlert, setStateAlert] = useState<boolean>(false);
  const [tipo, setTipo] = useState<"error" | "sucess">();
  const [mensagem, setMensagem] = useState<string>();

  const drop_alert = (tipo: "error" | "sucess", mensagem: string) => {
    setTipo(tipo);
    setStateAlert(true);
    setMensagem(mensagem);
  };

  return (
    <ContextAlert.Provider value={{ drop_alert }}>
      {children}
      <AlertDialog open={stateAlert} onOpenChange={setStateAlert}>
        <AlertDialogContent
          className={cn(
            "border-2",
            tipo === "error" && "border-red-400",
            tipo === "sucess" && "border-green-500",
          )}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Atenção</AlertDialogTitle>
            <AlertDialogDescription>{mensagem}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Ok</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ContextAlert.Provider>
  );
}
