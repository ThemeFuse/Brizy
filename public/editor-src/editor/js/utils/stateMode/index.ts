import { MRead, MReader, Reader, Type } from "visual/utils/types/Type";
import { String } from "visual/utils/string/specs";
import { Append, Concat, Monoid } from "visual/utils/types/Monoid";

export type State = "normal" | "hover" | "active";

export const NORMAL: State = "normal";
export const HOVER: State = "hover";
export const ACTIVE: State = "active";

/**
 * Returns all states list, with the default state as first element
 *
 * @return {StateMode[]}
 */
export const states = (): State[] => [NORMAL, HOVER, ACTIVE];

/**
 * Converts a value to a valid state mode value
 * If value cannot be converted, return undefined
 */
export const read: Reader<State> = v => {
  const s = String.read(v);

  if (s === undefined) {
    return undefined;
  }

  const _v = s === "tabNormal" ? NORMAL : s === "tabHover" ? HOVER : s;

  return states().includes(_v as State) ? (_v as State) : undefined;
};

/**
 * The state that is considered as default
 */
export const empty = NORMAL;

export const append: Append<State> = (a, b) => (a !== empty ? a : b);

/**
 * Reduce array os states to the first none empty state
 */
export const concat: Concat<State> = as => as.reduce(append, empty);

/**
 * Converts a value to a valid state mode value
 * If value cannot be converted, return the empty state
 */
export const mRead: MRead<State> = v => read(v) ?? empty;

/**
 * Return the model value that should be saved in database based on the state
 * Normally the value should be the same as state name, but this is not required.
 *
 * @param {StateMode} state
 * @returns {string}
 */
export const toString = (state: State): string => {
  switch (state) {
    case NORMAL:
      return "tabNormal";
    case HOVER:
      return "tabHover";
    default:
      return state;
  }
};

export const StateSpec: Type<State> & Monoid<State> & MReader<State> = {
  read,
  empty,
  append,
  concat,
  mRead
};
