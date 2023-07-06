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

export interface ChoicesAsync {
  load: (abortSignal?: AbortSignal) => Promise<Choice[]>;
  emptyLoad?: {
    title?: string;
  };
}
