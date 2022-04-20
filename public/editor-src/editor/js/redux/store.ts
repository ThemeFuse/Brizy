import {
  createStore as reduxCreateStore,
  applyMiddleware,
  compose,
  Store as RStore
} from "redux";
import { reduxBatch } from "@manaflair/redux-batch";
import rootReducer from "./reducers";
import { ReduxState } from "visual/redux/types";
import { ReduxAction } from "visual/redux/actions2";

export type Store = RStore<ReduxState, ReduxAction>;

let store: Store;

export function createStore({ middleware = [] } = {}): Store {
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
