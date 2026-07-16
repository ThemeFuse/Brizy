import { Middleware, isAction } from "redux";
import UIEvents, { UIEventType } from "visual/global/UIEvents";

export interface ActionPerfInfo {
  type: string;
  duration: number;
  timestamp: number;
}

export const perfMiddleware: Middleware = () => (next) => (action) => {
  if (!isAction(action)) {
    return next(action);
  }

  const start = performance.now();
  const result = next(action);
  const duration = performance.now() - start;

  const info: ActionPerfInfo = {
    type: action.type,
    duration,
    timestamp: Date.now(),
  };

  UIEvents.emit(UIEventType.ReduxActionPerf, info);

  return result;
};
