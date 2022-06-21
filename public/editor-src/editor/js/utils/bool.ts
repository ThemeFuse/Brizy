import { pass } from "visual/utils/fp";

export function is(v: boolean): true;
export function is<
  T extends Exclude<Primitive, boolean> | Record<string, unknown>
>(v: T): false;
export function is(v: unknown): v is boolean;
export function is(v: unknown): v is boolean {
  return typeof v === "boolean";
}

export const fromUnknown = pass(is);
