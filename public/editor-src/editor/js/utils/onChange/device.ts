import { lowerFirst, memoize } from "es-toolkit";
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

const TEMP = "temp";

/**
 * Strip a camelCase prefix: ("tablet", "tabletPaddingTop") → "paddingTop".
 * Returns undefined when the prefix is not a whole word of the key — "template"
 * is not a temp key.
 */
function withoutPrefix(prefix: string, key: string): string | undefined {
  const rest = key.slice(prefix.length);

  return key.startsWith(prefix) && /^[A-Z]/.test(rest)
    ? lowerFirst(rest)
    : undefined;
}

/**
 * The first of `prefixes` the key starts with, and what is left after it.
 */
function splitPrefix<T extends string>(
  prefixes: readonly T[],
  key: string
): [T, string] | undefined {
  for (const prefix of prefixes) {
    const rest = withoutPrefix(prefix, key);
    if (rest !== undefined) return [prefix, rest];
  }

  return undefined;
}

/**
 * The key a value is parked under while its option is switched off: a colour
 * set to opacity 0 keeps the opacity it had in `tempBgColorOpacity`.
 */
export function tempValueKey(key: string): string {
  return camelCase([TEMP, key]);
}

export function defaultValueKey({
  key,
  device = "desktop",
  state = "normal"
}: KeyParams): string {
  const untemp = withoutPrefix(TEMP, key);
  const valueKey = defaultValueKey2({ key: untemp ?? key, device, state });

  return untemp === undefined ? valueKey : tempValueKey(valueKey);
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

const prefixedStates: State.State[] = State.states().filter(
  (s) => s !== State.empty
);

const prefixedDevices: Responsive.ResponsiveMode[] = Responsive.types.filter(
  (d) => d !== Responsive.empty
);

/**
 * Split a model key into the key, device and state it is built from — the
 * inverse of `defaultValueKey`, which builds the same key back from them:
 *  - "tabletPaddingTop" → paddingTop, tablet, normal
 *  - "activeMobileBgColorHex" → bgColorHex, mobile, active
 *  - "tempTabletBgColorOpacity" → tempBgColorOpacity, tablet, normal
 *  - "paddingTop" → paddingTop, desktop, normal
 */
export function parseDefaultValueKey(key: string): {
  key: string;
  device: Responsive.ResponsiveMode;
  state: State.State;
} {
  const untemp = withoutPrefix(TEMP, key);
  const [state, stateless] = splitPrefix(prefixedStates, untemp ?? key) ?? [
    State.empty,
    untemp ?? key
  ];
  const [device, bare] = splitPrefix(prefixedDevices, stateless) ?? [
    Responsive.empty,
    stateless
  ];

  return {
    key: untemp === undefined ? bare : tempValueKey(bare),
    device,
    state
  };
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
