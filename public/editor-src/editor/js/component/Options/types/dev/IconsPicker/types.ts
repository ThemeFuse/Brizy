import { Literal } from "visual/utils/types/Literal";

export interface Config {
  icons: Array<{
    id: string;
    title: string;
    icon: string;
  }>;
}

export type Choice = {
  icon: string;
  title: string;
  value: Literal;
};

export interface Value {
  value: Array<Literal>;
  active?: Literal;
}
