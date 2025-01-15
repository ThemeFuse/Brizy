import { KeyboardEvent } from "react";

export interface Choice {
  id: string;
  name: string;
}

export interface RadioItemProps {
  choices: Choice[];
  name: string;
  onChange: (value: string, name: string) => void;
  isEditor: boolean;
}

interface DataField {
  title: string;
  name: string;
  value: string;
  type: string;
  description: string;
  choices: Choice[];
}

export interface InputFieldProps {
  field: DataField;
  onChange: (value: string, name: string) => void;
  handleKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

export interface ConnectProps {
  img?: string;
  title?: string;
  docsUrl?: string;
  descriptions?: string;
  data?: DataField[];
  error?: string;
  nextLoading?: boolean;
  prevLoading?: boolean;
  onNext: VoidFunction;
  onPrev: VoidFunction;
  onChange: (value: string, name: string) => void;
}
