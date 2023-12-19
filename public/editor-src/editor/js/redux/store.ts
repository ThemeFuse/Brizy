import { reduxBatch } from "@manaflair/redux-batch";
import {
  applyMiddleware,
  compose,
  createStore as reduxCreateStore,
  Middleware,
  Store as RStore
} from "redux";
import { ReduxAction } from "visual/redux/actions2";
import { ReduxState } from "visual/redux/types";
import rootReducer from "./reducers";

export type Store = RStore<ReduxState, ReduxAction>;

let store: Store;

export function createStore(
  { middleware = [] }: { middleware: Middleware[] } = { middleware: [] }
): Store {
  if (store) {
    throw new Error("store is already created");
  }

  store = reduxCreateStore(
    // @ts-expect-error: not all reducers are declared in ts
    rootReducer,
    compose(reduxBatch, applyMiddleware(...middleware))
  );

  return store;
}

export function getStore(): Store {
  if (!store) {
    throw new Error("store is not yet created");
  }

  return store;
}
