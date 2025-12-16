import { Reader } from "./types";

export const readWithChoices =
  <T>(choices: T[]): Reader<T> =>
  (v) => {
    return choices.includes(v as T) ? (v as T) : undefined;
  };
