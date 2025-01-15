import { reduxBatch } from "@manaflair/redux-batch";
import {
  Middleware,
  Store as RStore,
  applyMiddleware,
  compose,
  createStore as reduxCreateStore
} from "redux";
import { ReduxAction } from "visual/redux/actions2";
import { ReduxState } from "visual/redux/types";
import rootReducer from "./reducers";

export type Store = RStore<ReduxState, ReduxAction>;

export function createStore(
  { middleware = [] }: { middleware: Middleware[] } = { middleware: [] }
): Store {
  return reduxCreateStore(
    // @ts-expect-error: not all reducers are declared in ts
    rootReducer,
    compose(reduxBatch, applyMiddleware(...middleware))
  );
}
