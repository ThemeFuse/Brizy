import { Base, isNoPayload, NoPayload } from "./Base";

export type Close = NoPayload<"close">;

export const fromBase = (m: Base<unknown, unknown>): Close | undefined => {
  const isClose = isNoPayload(m) && m.type === "close";

  return isClose ? { type: "close" } : undefined;
};
