import { Base, WithPayload } from "./Base";
import * as Str from "visual/utils/reader/string";

export type Redirect = WithPayload<"redirect", string>;

export const fromBase = (m: Base<unknown, unknown>): Redirect | undefined => {
  const type = m.type === "redirect" ? "redirect" : undefined;
  const payload = Str.read((m as Redirect)?.payload);

  return type && payload ? { type, payload } : undefined;
};
