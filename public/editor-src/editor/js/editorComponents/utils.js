import { capByPrefix } from "visual/utils/string";
import { defaultState, hasState } from "visual/utils/stateMode";
import { getDevice, supportsMode } from "visual/utils/devices";
import { defaultMode } from "visual/utils/responsiveMode";

/**
 * Create an complete option id that consists from 2 parts: base id and suffix
 * - The result is a string in camelCase style
 * - If the suffix === 'value', return id without suffixing it
 *
 * @param id
 * @param suffix
 * @returns {string}
 */
export const createOptionId = (id, suffix) =>
  suffix === "value" ? id : capByPrefix(id, suffix);

/**
 * Prefixes option value keys with a specific prefix
 * - If the option is not an object, then the original option is returned
 * - If the object key is equal to "value", prefix is used as full key
 *   because value under "value" key is considered as root value
 *
 * @param {string} prefix
 * @param {object} option
 * @return {object|*}
 */
export const setOptionPrefix = (prefix, option) => {
  if (option && typeof option === "object") {
    return Object.keys(option).reduce((acc, k) => {
      acc[createOptionId(prefix, k)] = option[k];
      return acc;
    }, {});
  }

  return option;
};

/**
 * Check if the option type is in development
 * Options that are in development should always end with "-dev" in type name
 *
 * @param type
 * @return {boolean}
 */
export const inDevelopment = type => String(type).endsWith("-dev");

/**
 * Checks if the option supports provided state
 *  - if it does, return the current state
 *  - if it doesn't, return default state mode
 *
 * @param {string} state
 * @param {object} option
 * @returns {string}
 */
export const optionState = (state, option) =>
  hasState(state, option) ? state : defaultState();

/**
 * Checks if the option supports provided responsive mode
 *  - if it does, return the current mode
 *  - if it doesn't, return default mode
 *
 * @param mode
 * @param option
 * @returns {string}
 */
export const optionMode = (mode, option) =>
  supportsMode(mode, getDevice(option)) ? mode : defaultMode();
