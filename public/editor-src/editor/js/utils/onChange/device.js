import { capitalize } from "visual/utils/string";

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

export function defaultValueValue({
  v,
  key,
  device = "desktop",
  state = "normal"
}) {
  const deviceKey = defaultValueKey({ key, device, state });

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
