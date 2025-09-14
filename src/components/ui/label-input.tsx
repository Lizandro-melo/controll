import React, { ReactNode } from "react";
import { Input } from "./input";
import { Label } from "./label";

export default function LabelInput(
  { ...propsInput }: React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <div className="flex flex-col gap-3 w-[300px]">
      <Label htmlFor={propsInput.name}>{propsInput.name}</Label>
      <Input
        {...propsInput}
        id={propsInput.name}
        className={`${propsInput.className} `}
      />
    </div>
  );
}
