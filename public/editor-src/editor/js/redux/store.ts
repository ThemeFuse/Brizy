import { reduxBatch } from "@manaflair/redux-batch";
import {
  Middleware,
  Store as RStore,
  applyMiddleware,
  compose,
  createStore as reduxCreateStore
} from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import type { ReduxAction } from "visual/redux/actions2";
import type { ReduxState } from "visual/redux/types";
import rootReducer from "./reducers";

export type Store = RStore<ReduxState, ReduxAction>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TypedDispatch = ThunkDispatch<ReduxState, any, ReduxAction>;
export type TypedThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  ReduxState,
  unknown,
  ReduxAction
>;

export function createStore(
  { middleware = [] }: { middleware: Middleware[] } = { middleware: [] }
): Store {
  return reduxCreateStore(
    // @ts-expect-error: not all reducers are declared in ts
    rootReducer,
    compose(reduxBatch, applyMiddleware(...middleware))
  );
}
