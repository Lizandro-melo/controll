import { useSearchParams } from "next/navigation";
import Router from "next/router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export default function ResponseAlert() {
  const searchParams = useSearchParams();
  const status = eval(searchParams.get("alertStatus")!);
  const tipo = searchParams.get("alertType");
  const mensagem = searchParams.get("alertMensagem");

  const handleState = (status: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("alertStatus", `${status}`);
    Router.push(`?${params.toString()}`);
  };

  return (
    <AlertDialog open={status} onOpenChange={handleState}>
      <AlertDialogContent
        className={cn(
          "border-2",
          tipo === "error" && "border-red-400",
          tipo === "sucesso" && "border-green-500",
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
  );
}
