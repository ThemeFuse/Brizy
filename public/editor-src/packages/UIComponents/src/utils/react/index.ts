import { SyntheticEvent } from "react";

type WithValue = HTMLElement & { value: string };

export const inputValue = (e: SyntheticEvent<WithValue>): string =>
  (e.target as WithValue).value;
