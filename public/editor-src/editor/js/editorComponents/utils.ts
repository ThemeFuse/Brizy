import { camelCase } from "visual/utils/string";
import * as State from "visual/utils/stateMode";
import { hasState } from "visual/utils/stateMode/editorComponent";
import * as Responsive from "visual/utils/responsiveMode";
import * as Device from "visual/utils/devices";
import { getDevice, supportsMode } from "visual/utils/devices";
import { ElementModel } from "visual/component/Elements/Types";

/**
 * Create an complete option id that consists from 2 parts: base id and suffix
 * - The result is a string in camelCase style
 * - If the suffix === 'value', return id without suffixing it
 *
 * @param {string} id
 * @param {string} suffix
 * @returns {string}
 */
export const createOptionId = (id: string, suffix: string): string => {
  const temp = suffix.startsWith("temp") ? "temp" : "";
  const key = temp.length ? suffix.substr(4) : suffix;
  const _suffix = key === "value" || key === "Value" ? "" : key;

  return camelCase([temp, id, _suffix]);
};

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
export const setOptionPrefix = (
  prefix: string,
  option: ElementModel
): ElementModel => {
  if (option && typeof option === "object") {
    return Object.keys(option).reduce((acc, k) => {
      acc[createOptionId(prefix, k)] = option[k];
      return acc;
    }, {} as ElementModel);
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
export const inDevelopment = (type: string): boolean =>
  String(type).endsWith("-dev");

/**
 * Checks if the option supports provided state
 *  - if it does, return the current state
 *  - if it doesn't, return default state mode
 *
 * @param {string} state
 * @param {object} option
 * @returns {string}
 */
export const optionState = (
  state: State.State,
  option: { states: State.State[] }
): State.State => (hasState(state, option) ? state : State.empty);

/**
 * Checks if the option supports provided responsive mode
 *  - if it does, return the current mode
 *  - if it doesn't, return default mode
 *
 * @param mode
 * @param option
 * @returns {string}
 */
export const optionMode = (
  mode: Responsive.ResponsiveMode,
  option: { devices: Device.Device }
): Responsive.ResponsiveMode =>
  supportsMode(mode, getDevice(option)) ? mode : Responsive.empty;

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const makeToolbarPropsFromConfigDefaults = options => {
  const allowExtend = options.allowExtend ?? true;
  const allowExtendFromParent = options.allowExtendFromParent ?? allowExtend;
  const allowExtendFromChild = options.allowExtendFromChild ?? allowExtend;
  const allowExtendFromThirdParty =
    options.allowExtendFromThirdParty ?? allowExtend;

  const allowSidebarExtend = options.allowSidebarExtend ?? allowExtend;
  const allowSidebarExtendFromParent =
    options.allowSidebarExtendFromParent ??
    options.allowSidebarExtend ??
    allowExtendFromParent;
  const allowSidebarExtendFromChild =
    options.allowSidebarExtendFromChild ??
    options.allowSidebarExtend ??
    allowExtendFromChild;
  const allowSidebarExtendFromThirdParty =
    options.allowSidebarExtendFromThirdParty ??
    options.allowSidebarExtend ??
    allowExtendFromThirdParty;

  return {
    ...options,
    allowExtend,
    allowExtendFromParent,
    allowExtendFromChild,
    allowExtendFromThirdParty,
    allowSidebarExtend,
    allowSidebarExtendFromParent,
    allowSidebarExtendFromChild,
    allowSidebarExtendFromThirdParty
  };
};
