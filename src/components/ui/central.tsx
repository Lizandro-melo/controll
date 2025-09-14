import { ReactNode } from "react";

export default function Central({ children }: { children: ReactNode }) {
  return (
    <div className="w-full h-full flex justify-center items-center">
      {children}
    </div>
  );
}
