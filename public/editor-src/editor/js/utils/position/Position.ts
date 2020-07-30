import { Reader } from "visual/utils/types/Type";

export type Position = "relative" | "absolute" | "fixed";

export const positions: Position[] = ["relative", "absolute", "fixed"];

export const read: Reader<Position> = v =>
  positions.includes(v as Position) ? (v as Position) : undefined;
