import * as redux from "redux";
import rootReducer from "./reducers";

let store;

export function createStore({ middleware = [] } = {}) {
  if (store) {
    throw new Error("store is already created");
  }

  store = redux.createStore(rootReducer, redux.applyMiddleware(...middleware));

  return store;
}

export function getStore() {
  if (!store) {
    throw new Error("store is not yet created");
  }

  return store;
}
