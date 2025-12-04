import { Middleware } from "redux";
import { thunk } from "redux-thunk";
import { GetConfig } from "visual/providers/ConfigProvider/types";
import sideEffects from "visual/redux/middleware/sideEffects";

export function getMiddleware({
  getConfig
}: {
  getConfig: GetConfig;
}): Array<Middleware> {
  if (typeof window === "undefined") {
    return [thunk];
  }

  return [
    thunk,
    sideEffects({ document, parentDocument: window.parent.document, getConfig })
  ];
}
