import { Base } from "./Base";
import * as Close from "./Close";
import * as Redirect from "./Redirect";

export type InputMessage = Close.Close | Redirect.Redirect;

export const readInputMessage = (
  m: Base<unknown, unknown>
): InputMessage | undefined => {
  return Close.fromBase(m) ?? Redirect.fromBase(m);
};
