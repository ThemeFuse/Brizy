declare const _tag: unique symbol;

export type StringDate = string & { [_tag]: "StringDate" };

export const fromDate = (date: Date): StringDate =>
  date.toString() as StringDate;

export const toDate = (date: StringDate): Date => new Date(date);
