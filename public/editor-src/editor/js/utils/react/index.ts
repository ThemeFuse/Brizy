import { Ref, SyntheticEvent } from "react";

type WithValue = HTMLElement & { value: string };

export const inputValue = (e: SyntheticEvent<WithValue>): string =>
  (e.target as WithValue).value;

export function attachRef<T>(t: T | null, ref: Ref<T>): void {
  if (typeof ref === "function") {
    ref(t);
  } else if (ref && t) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (ref as any).current = t;
  }
}
