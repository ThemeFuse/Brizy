import { BlockTypes } from "../../types";

export interface Props<T extends BlockTypes> {
  type: T;
  value: string;
  onChange: (v: string) => void;
}

export type Choices = Array<{ id: string; label: string }>;
