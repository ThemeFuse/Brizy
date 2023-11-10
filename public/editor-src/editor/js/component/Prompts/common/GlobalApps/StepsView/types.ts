import { KeyboardEvent } from "react";

export interface Choice {
  id: string;
  name: string;
}

export interface RadioItemProps {
  choices: Choice[];
  name: string;
  onChange: (value: string, name: string) => void;
}

export interface InputFieldProps {
  field: {
    title: string;
    name: string;
    value: string;
    type: string;
    choices?: Choice[];
  };
  onChange: (value: string, name: string) => void;
  handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}
