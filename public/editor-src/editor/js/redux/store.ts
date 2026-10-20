import { reduxBatch } from "@manaflair/redux-batch";
import {
  applyMiddleware,
  compose,
  type Middleware,
  type Store as RStore,
  createStore as reduxCreateStore
} from "redux";
import type { ThunkAction, ThunkDispatch } from "redux-thunk";
import type { ReduxAction } from "visual/redux/actions2";
import type { ReduxState } from "visual/redux/types";
import rootReducer from "./reducers";

export type Store = RStore<ReduxState, ReduxAction>;

// biome-ignore lint/suspicious/noExplicitAny: migrated from eslint
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
