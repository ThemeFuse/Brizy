import { onUndefined } from "visual/utils/value";

export type IconSizeType = "small" | "medium" | "large" | "custom";

export type Reader<T> = (a: unknown) => T | undefined;

export type MRead<T> = (a: unknown) => T;

export type ToValue<T> = (orElse: T, a: unknown) => T;

export interface Type<T> {
  read: Reader<T>;
}

export type MReader<T> = {
  mRead: MRead<T>;
};

export function toValue<T>(read: Reader<T>): ToValue<T> {
  return (orElse, a): T => onUndefined(read(a), orElse);
}

export const readIconSize: Reader<IconSizeType> = (v) =>
  v === "small" || v === "medium" || v === "large" || v === "custom"
    ? v
    : undefined;
