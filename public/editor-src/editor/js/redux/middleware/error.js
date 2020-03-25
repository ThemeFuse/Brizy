import { errorSelector } from "visual/redux/selectors";
import { IRREPARABLE_ERRORS } from "visual/utils/errors";

export const errorMiddleware = store => next => action => {
  const error = errorSelector(store.getState());

  if (!error || !IRREPARABLE_ERRORS.includes(error.code)) {
    next(action);
  }
};
