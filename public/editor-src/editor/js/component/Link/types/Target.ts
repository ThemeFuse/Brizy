import { MRead, Reader } from "visual/utils/types/Type";

export type Target = "on" | "off";

export const read: Reader<Target> = v =>
  v === "on" || v === "off" ? v : undefined;

export const empty: Target = "off";

export const mRead: MRead<Target> = v => read(v) ?? empty;
