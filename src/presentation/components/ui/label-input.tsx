import React, { ReactNode } from "react";
import { Input } from "./input";
import { Label } from "./label";
import { cn } from "@/presentation/lib/utils";

export default function LabelInput({
  ...propsInput
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-3  max-w-[500px]">
      <Label
        className={cn(
          propsInput.required &&
            "after:ml-0.5 after:text-red-500 after:content-['*']",
        )}
        htmlFor={propsInput.id}
      >
        {propsInput.id}
      </Label>
      <Input
        {...propsInput}
        id={propsInput.id}
        className={`${propsInput.className} `}
      />
    </div>
  );
}
