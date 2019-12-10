import { onEmpty } from "visual/utils/array";

export const NORMAL = "normal";
export const HOVER = "hover";
/**
 * Returns the state that is considered as default
 *
 * @return {string}
 */
export const defaultState = () => NORMAL;

/**
 * Converts any string to a valid stateMode value
 * If the string does not correspond to any state, return default state;
 *
 * @param state
 * @return {string}
 */
export const valueToState = state => {
  switch (state) {
    case HOVER:
    case "tabHover":
      return HOVER;
    default:
      return NORMAL;
  }
};

/**
 * Return the model value that should be saved in database based on the state
 * Normally the value should be the same as state name, but this is not required.
 *
 * @param {string} state
 * @returns {string}
 */
export const stateToValue = state =>
  valueToState(state) === HOVER ? "tabHover" : "tabNormal";

/**
 * Returns all states list, with the default state as first element
 *
 * @return {[string, string]}
 */
export const states = () => [NORMAL, HOVER];

/**
 * Check if option supports specific state mode
 *  - By default every option supports defaultState()
 *    if the `states` key is not defined or empty
 *
 * @param {string} s
 * @param {{states: [string]}} o
 * @return {boolean}
 */
export const hasState = (s, o) =>
  onEmpty([defaultState()], o.states).includes(s);

/**
 * Check if at least on option supports specific mode
 *
 * @param {string} s state mode
 * @param {[{states: [string]}]} opts options
 * @return {boolean}
 */
export const haveState = (s, opts) => opts.some(hasState.bind(null, s));
