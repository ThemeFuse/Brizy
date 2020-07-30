import {
  isDesktop,
  isMobile,
  ResponsiveMode
} from "visual/utils/responsiveMode";
import { MRead, Reader } from "visual/utils/types/Type";
import { Append, Concat } from "visual/utils/types/Monoid";
import { IsEqual } from "visual/utils/types/Eq";
import { String } from "visual/utils/string/specs";

export type Device = "all" | "desktop" | "responsive";

export type WithDevice = { devices?: Device };

/**
 * Returns all devices list
 * First device should be the default one.
 *
 * @returns {String[]}
 */
export const devices: Device[] = ["all", "desktop", "responsive"];

export const read: Reader<Device> = v => {
  if (typeof v === "string") {
    return devices.includes(v as Device) ? (v as Device) : undefined;
  }

  return undefined;
};

/**
 * Default device
 */
export const empty: Device = "all";

export const append: Append<Device> = (a, b) => (a === empty ? b : a);

export const concat: Concat<Device> = as => as.reduce(append, empty);

export const eq: IsEqual<Device> = String.eq;

/**
 * Takes a value and checks if is a valid device.
 *  - if it is, return the value
 *  - otherwise, return default device
 */
export const mRead: MRead<Device> = v => read(v) ?? empty;

export const ALL: Device = "all";
export const DESKTOP: Device = "desktop";
export const RESPONSIVE: Device = "responsive";

/**
 * Returns option supported devices
 * If the option value is not set or invalid return default device
 *
 * @param {object} o
 * @returns {string}
 */
export const getDevice = (o: WithDevice): Device => mRead((o ?? {}).devices);

/**
 * Check if the option has a specific device
 *
 * @param {string} device
 * @param {object} o option
 * @returns {boolean}
 */
export const hasDevice = (device: Device, o: WithDevice): boolean =>
  device === getDevice(o);

/**
 * Check if the device supports a specific responsive mode
 * - The 'all' devices should support all responsive modes
 * - The 'responsive' devices should support only modes part for mobileModes()
 * - The 'desktop' devices should support only modes part for desktopModes()
 *
 * @param {string} mode
 * @param {string} device
 * @returns {boolean}
 */
export const supportsMode = (mode: ResponsiveMode, device: Device): boolean => {
  switch (device) {
    case "all":
      return true;
    case "responsive":
      return isMobile(mode);
    case "desktop":
      return isDesktop(mode);
  }
};
