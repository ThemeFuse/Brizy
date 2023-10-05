import { Nullish } from "./types";

export const isNullish = (v: unknown): v is Nullish =>
  v === undefined || v === null || (typeof v === "number" && Number.isNaN(v));
