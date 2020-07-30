import { onNullish } from "visual/utils/value";
import { memoize } from "underscore";
import { camelCase } from "visual/utils/string";
import * as Responsive from "visual/utils/responsiveMode";
import * as State from "visual/utils/stateMode";

/**
 * Returns default device
 *
 * @return {string}
 */
export const defaultDevice = () => "desktop";

/**
 * Check if the device is the default device;
 *
 * @param {string} device
 * @return {boolean}
 */
export const isDefault = device => device === defaultDevice();

function syncOnChange(device, v, key) {
  const capKey =
    String(key)
      .charAt(0)
      .toUpperCase() + String(key).substr(1);
  const deviceKey = device + capKey;

  return onNullish(v[key], v[deviceKey]);
}

export function tabletSyncOnChange(v, key) {
  return syncOnChange("tablet", v, key);
}

export function mobileSyncOnChange(v, key) {
  return syncOnChange("mobile", v, key);
}

// Utilities
export function keySyncOnChange(key, deviceKey) {
  return onNullish(key, deviceKey);
}

/**
 *
 * @param {{
 *   key: string,
 *   device: string,
 *   state: StateMode,
 * }} v
 * @return {string}
 */
export function defaultValueKey({ key, device = "desktop", state = "normal" }) {
  const temp = key.substr(0, 4) === "temp" ? "temp" : "";
  const newKey = temp.length > 0 ? key.substr(4) : key;

  return camelCase([temp, defaultValueKey2({ key: newKey, device, state })]);
}

/**
 * Create model key based on device and state
 *  - Always prefix the id is with device|state keys
 *  - If the device is equal with default responsive mode it does not prefix
 *  - If the state is equal with default state it does not prefix
 *  - The result key is a  string in camelCase style
 *  - The prefixes are added in this strict order: {state}{device}{key} => "stateDeviceKey"
 *
 *  Note: It is similar to `defaultValueKey`, the difference is that it does treat `temp` prefixes
 *
 * @param {string} key
 * @param {string} device
 * @param {string} state
 * @returns {string}
 */
export function defaultValueKey2({ key, device, state }) {
  const _state = State.mRead(state);
  const _device = Responsive.toMode(device);

  const statePrefix = _state === State.empty ? "" : _state;
  const devicePrefix = _device === Responsive.defaultMode() ? "" : _device;

  return camelCase([statePrefix, devicePrefix, key]);
}

export function defaultValueValue({
  v,
  key,
  device = "desktop",
  state = "normal"
}) {
  const deviceKey = defaultValueKey({ key, device, state });

  return onNullish(v[key], v[deviceKey]);
}

/**
 * Returns specific value from model based on key, device and state
 *  - If the result value from specifies device or state is null, return value from base original key
 *
 * Note: This is similar to `defaultValueValue`, but uses `defaultValueKey2` instead of `defaultValueKey`
 *
 * @param {object} v
 * @param {string} key
 * @param {string} device
 * @param {string} state
 * @returns {*}
 */
export function defaultValueValue2({ v, key, device, state }) {
  const deviceKey = defaultValueKey2({ key, device, state });

  return onNullish(v[key], v[deviceKey]);
}

/**
 * Returns a combination of all devices and states
 *
 * @return {({device: string, state: StateMode}[])}
 */
const states = memoize(() => {
  return Responsive.modes().reduce((acc, device) => {
    const item = State.states().reduce((acc, state) => {
      acc.push({ device, state });
      return acc;
    }, []);

    return acc.concat(item);
  }, []);
});

export function deviceStateValueByKey(v, key) {
  return states().reduce((acc, state) => {
    return acc || defaultValueValue({ v, key, ...state });
  }, "");
}

export function validateKeyByProperty(v, key, property) {
  return states().some(state => {
    const value = defaultValueValue({ v, key, ...state });

    return value && value !== property;
  });
}

export function makeKeyByStateDevice(v, key) {
  return states().map(state => defaultValueKey({ key, ...state }));
}
