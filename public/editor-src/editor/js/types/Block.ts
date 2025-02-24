import { Screenshot } from "./Screenshot";

export type Block = {
  type: string;
  value: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  blockId: string;
  deleted?: boolean;
  meta?: Screenshot;
};
