import { MRead, Reader } from "visual/utils/types/Type";

export type Type =
  | "external"
  | "anchor"
  | "lightBox"
  | "popup"
  | "upload"
  | "action";

export const types: Type[] = [
  "external",
  "anchor",
  "lightBox",
  "popup",
  "upload",
  "action"
];

export const read: Reader<Type> = v =>
  types.includes(v as Type) ? (v as Type) : undefined;

export const empty: Type = "external";

export const mRead: MRead<Type> = v => read(v) ?? empty;
