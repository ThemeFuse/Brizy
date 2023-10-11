import { PageError } from "visual/utils/errors";

export const onCatch = (m: string) => (): never => {
  throw new PageError(m);
};
