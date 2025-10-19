import React, { ReactNode } from "react";
import { Input } from "./input";
import { Label } from "./label";

export default function LabelInput({
  ...propsInput
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-3 w-[100%] max-w-[500px]">
      <Label htmlFor={propsInput.id}>{propsInput.id}</Label>
      <Input
        {...propsInput}
        id={propsInput.id}
        className={`${propsInput.className} `}
      />
    </div>
  );
}
