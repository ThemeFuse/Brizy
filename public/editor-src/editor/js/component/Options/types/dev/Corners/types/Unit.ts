import { pass } from "visual/utils/fp";

export type Unit = "px";

export const is = (v: string): v is Unit => v === "px";

export const fromString = pass(is);
