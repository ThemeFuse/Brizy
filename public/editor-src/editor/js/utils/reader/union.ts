import { Reader } from "./types";

export const readWithChoices =
  <T>(
    choices: T[]
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  ): Reader<T> =>
  (v) => {
    return choices.includes(v as T) ? (v as T) : undefined;
  };
