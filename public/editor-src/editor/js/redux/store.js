import {
  createStore as reduxCreateStore,
  applyMiddleware,
  compose
} from "redux";
import { reduxBatch } from "@manaflair/redux-batch";
import rootReducer from "./reducers";

let store;

export function createStore({ middleware = [] } = {}) {
  if (store) {
    throw new Error("store is already created");
  }

  store = reduxCreateStore(
    rootReducer,
    compose(
      reduxBatch,
      applyMiddleware(...middleware)
    )
  );

  return store;
}

export function getStore() {
  if (!store) {
    throw new Error("store is not yet created");
  }

  return store;
}
