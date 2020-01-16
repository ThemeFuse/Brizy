import { isDesktop, isMobile } from "visual/utils/responsiveMode";

export const ALL = "all";
export const DESKTOP = "desktop";
export const RESPONSIVE = "responsive";

/**
 * Returns the default device
 *
 * @returns {string}
 */
export const defaultDevice = () => ALL;

/**
 * Returns all devices list
 * First device should be the default one.
 *
 * @returns {String[]}
 */
export const devices = () => [ALL, DESKTOP, RESPONSIVE];

/**
 * Check if the provided value is a valid device
 *
 * @param {string} v
 * @returns {boolean}
 */
export const isDevice = v => devices().includes(v);

/**
 * Takes a value and checks if is a valid device.
 *  - if it is, return the value
 *  - otherwise, return default device
 *
 * @param {string} v
 * @returns {string}
 */
export const toDevice = v => (isDevice(v) ? v : defaultDevice());

/**
 * Returns option supported devices
 * If the option value is not set or invalid return default device
 *
 * @param {object} o
 * @returns {string}
 */
export const getDevice = o => toDevice((o || {}).devices);

/**
 * Check if the option has a specific device
 *
 * @param {string} device
 * @param {object} o option
 * @returns {boolean}
 */
export const hasDevice = (device, o) => toDevice(device) === getDevice(o);

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
export const supportsMode = (mode, device) => {
  switch (toDevice(device)) {
    case ALL:
      return true;
    case RESPONSIVE:
      return isMobile(mode);
    default:
      return isDesktop(mode);
  }
};
