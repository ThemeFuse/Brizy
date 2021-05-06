import { PageError } from "visual/utils/errors";
import { isNullish, MNullish } from "visual/utils/value";

export const errOnEmpty = (m: string) => <T>(t: MNullish<T>): T => {
  if (isNullish(t)) {
    throw new PageError(m);
  }

  return t;
};

export const onCatch = (m: string) => (): never => {
  throw new PageError(m);
};
