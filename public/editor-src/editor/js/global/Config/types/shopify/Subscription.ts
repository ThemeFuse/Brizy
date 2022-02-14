import { mPipe, pass } from "fp-utilities";
import * as Str from "visual/utils/string/specs";

export enum Subscription {
  Free = "free",
  Silver = "silver",
  Gold = "gold",
  Platinum = "platinum"
}

export const is = (s: unknown): s is Subscription =>
  Object.values(Subscription).includes(s as Subscription);

export const read = mPipe(Str.read, pass(is));
