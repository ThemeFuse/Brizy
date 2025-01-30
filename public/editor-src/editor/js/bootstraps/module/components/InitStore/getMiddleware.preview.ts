import thunk from "redux-thunk";
import sideEffects from "visual/redux/middleware/sideEffects";

export function getMiddleware() {
  if (typeof window === "undefined") {
    return [thunk];
  }

  return [thunk, sideEffects({ document })];
}
