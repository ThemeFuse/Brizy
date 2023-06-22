import { Literal } from "../utils/types";

interface Choice {
  icon?: {
    name?: string;
    className?: string;
  };
  title: string;
  value: Literal;
}

export type ChoicesSync = Choice[];
