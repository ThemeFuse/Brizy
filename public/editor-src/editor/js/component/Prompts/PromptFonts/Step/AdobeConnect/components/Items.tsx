import React from "react";
import InputPlaceholder from "visual/component/Controls/InputPlaceholder";
import { Props } from "./types";

export const Items = ({ data, onChange }: Props) => (
  <>
    {data.map(({ title, name, value }, index: number) => (
      <InputPlaceholder
        key={index}
        title={title}
        value={value}
        required={true}
        onChange={(e) => onChange(e.target.value, name)}
      />
    ))}
  </>
);
