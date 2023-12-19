import { mPipe } from "fp-utilities";
import { pass, pipe } from "visual/utils/fp";
import * as Str from "visual/utils/string/specs";
import { onNullish } from "visual/utils/value";

export type State = "normal" | "hover" | "active";

export const NORMAL: Extract<State, "normal"> = "normal";
export const HOVER: Extract<State, "hover"> = "hover";
export const ACTIVE: Extract<State, "active"> = "active";

/**
 * Returns all states list, with the default state as first element
 *
 * @return {StateMode[]}
 */
export const states = (): State[] => [NORMAL, HOVER, ACTIVE];

export const is = (s: string): s is State => states().includes(s as State);

/**
 * Converts a value to a valid state mode value
 * If value cannot be converted, return undefined
 */
export const fromString = pass(is);

/**
 * The state that is considered as default
 */
export const empty: "normal" = NORMAL;

/**
 * @deprecated, use fromSting
 */
export const mRead = pipe(
  Str.read,
  mPipe(fromString),
  onNullish(empty as State)
);
