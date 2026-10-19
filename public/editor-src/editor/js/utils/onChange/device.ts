import { memoize } from "es-toolkit";
import type { ElementModel } from "visual/component/Elements/Types";
import * as Responsive from "visual/utils/responsiveMode";
import * as State from "visual/utils/stateMode";
import { camelCase } from "visual/utils/string";
import { onNullish } from "visual/utils/value";

interface KeyParams {
  key: string;
  device?: Responsive.ResponsiveMode;
  state?: State.State;
}

interface ValueParams extends KeyParams {
  v: ElementModel;
}

interface DeviceState {
  device: Responsive.ResponsiveMode;
  state: State.State;
}

function syncOnChange(device: string, v: ElementModel, key: string): unknown {
  const capKey = String(key).charAt(0).toUpperCase() + String(key).substr(1);
  const deviceKey = device + capKey;

  return onNullish(v[key], v[deviceKey]);
}

export function tabletSyncOnChange(v: ElementModel, key: string): unknown {
  return syncOnChange("tablet", v, key);
}

export function mobileSyncOnChange(v: ElementModel, key: string): unknown {
  return syncOnChange("mobile", v, key);
}

export function defaultValueKey({
  key,
  device = "desktop",
  state = "normal"
}: KeyParams): string {
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
 */
export function defaultValueKey2({ key, device, state }: KeyParams): string {
  const _state = State.mRead(state);
  const _device = Responsive.mRead(device);

  const statePrefix = _state === State.empty ? "" : _state;
  const devicePrefix = _device === Responsive.empty ? "" : _device;

  return camelCase([statePrefix, devicePrefix, key]);
}

export function defaultValueValue({
  v,
  key,
  device = "desktop",
  state = "normal"
  // biome-ignore lint/suspicious/noExplicitAny: documented exception, callers read the stored value untyped
}: ValueParams): any {
  const deviceKey = defaultValueKey({ key, device, state });
  const _key = defaultValueKey({ key, device, state: State.empty });
  const __key = defaultValueKey({ key, device: Responsive.empty, state });
  const ___key = defaultValueKey({
    key,
    device: Responsive.empty,
    state: State.empty
  });

  return onNullish(
    v[___key],
    onNullish(onNullish(v[__key], v[_key]), v[deviceKey])
  );
}

/**
 * Returns a combination of all devices and states
 */
const states = memoize(() => {
  return Responsive.types.reduce<DeviceState[]>((acc, device) => {
    const item = State.states().reduce<DeviceState[]>((acc, state) => {
      acc.push({ device, state });
      return acc;
    }, []);

    return acc.concat(item);
  }, []);
});

export function deviceStateValueByKey(v: ElementModel, key: string) {
  return states().reduce((acc, state) => {
    return acc || defaultValueValue({ v, key, ...state });
  }, "");
}

export function validateKeyByProperty(
  v: ElementModel,
  key: string,
  property: unknown
) {
  return states().some((state) => {
    const value = defaultValueValue({ v, key, ...state });

    return value && value !== property;
  });
}

export function makeKeyByStateDevice(_v: ElementModel, key: string) {
  return states().map((state) => defaultValueKey({ key, ...state }));
}
