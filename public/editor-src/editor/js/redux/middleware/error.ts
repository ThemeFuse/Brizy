import { type Dispatch, Middleware } from "redux";
import { errorSelector } from "visual/redux/selectors";
import { IRREPARABLE_ERRORS } from "visual/utils/errors";
import { ReduxAction } from "../actions2";
import type { ReduxState } from "../types";

export const errorMiddleware: Middleware<
  Record<string, never>,
  ReduxState,
  Dispatch<ReduxAction>
> = (store) => (next) => (action) => {
  const error = errorSelector(store.getState());

  if (!error || !IRREPARABLE_ERRORS.includes(error.code)) {
    next(action);
  }
};
