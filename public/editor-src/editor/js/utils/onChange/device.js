import { camelCase, capitalize } from "visual/utils/string";
import { defaultMode, toMode } from "visual/utils/responsiveMode";
import { defaultState, valueToState } from "visual/utils/stateMode";

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

  return v[deviceKey] === null ? v[key] : v[deviceKey];
}

export function tabletSyncOnChange(v, key) {
  return syncOnChange("tablet", v, key);
}

export function mobileSyncOnChange(v, key) {
  return syncOnChange("mobile", v, key);
}

// Utilities
export function keySyncOnChange(key, deviceKey) {
  return deviceKey === null ? key : deviceKey;
}

export function defaultValueKey({ key, device = "desktop", state = "normal" }) {
  return device && state
    ? defaultValueKeyByDevice(defaultValueKeyByState(key, state), device)
    : device
    ? defaultValueKeyByDevice(key, device)
    : state
    ? defaultValueKeyByState(key, state)
    : key;
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
  const _state = valueToState(state);
  const _device = toMode(device);

  const statePrefix = _state === defaultState() ? "" : _state;
  const devicePrefix = _device === defaultMode() ? "" : _device;

  return camelCase([statePrefix, devicePrefix, key]);
}

export function defaultValueValue({
  v,
  key,
  device = "desktop",
  state = "normal"
}) {
  const deviceKey = defaultValueKey({ key, device, state });

  return v[deviceKey] === null ? v[key] : v[deviceKey];
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

  return v[deviceKey] === null ? v[key] : v[deviceKey];
}

function defaultValueKeyByState(key, state) {
  return key.substr(0, 4) === "temp" && state === "hover"
    ? `tempHover${key.substr(4)}`
    : state === "hover"
    ? `hover${capitalize(key)}`
    : key;
}

function defaultValueKeyByDevice(key, device) {
  return key.substr(0, 4) === "temp" && device === "mobile"
    ? `tempMobile${key.substr(4)}`
    : key.substr(0, 4) === "tempHover" && device === "mobile"
    ? `tempHoverMobile${key.substr(9)}`
    : device === "mobile"
    ? `mobile${capitalize(key)}`
    : key.substr(0, 4) === "temp" && device === "tablet"
    ? `tempTablet${key.substr(4)}`
    : key.substr(0, 4) === "tempHover" && device === "tablet"
    ? `tempHoverTablet${key.substr(9)}`
    : device === "tablet"
    ? `tablet${capitalize(key)}`
    : key;
}

export function deviceStateValueByKey(v, key) {
  const states = [
    { device: "desktop", state: "normal" },
    { device: "desktop", state: "hover" },
    { device: "tablet", state: "normal" },
    { device: "mobile", state: "normal" }
  ];

  return states.reduce((acc, state) => {
    return acc || defaultValueValue({ v, key, ...state });
  }, "");
}

export function makeKeyByStateDevice(v, key) {
  const states = [
    { device: "desktop", state: "normal" },
    { device: "desktop", state: "hover" },
    { device: "tablet", state: "normal" },
    { device: "tablet", state: "hover" },
    { device: "mobile", state: "normal" },
    { device: "mobile", state: "hover" }
  ];

  return states.map(state => defaultValueKey({ key, ...state }));
}
