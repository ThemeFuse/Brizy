export const DESKTOP = "desktop";
export const TABLET = "tablet";
export const MOBILE = "mobile";

/**
 * Return default responsive mode
 *
 * @returns {string}
 */
export const defaultMode = () => DESKTOP;

/**
 * Returns all responsive modes list.
 * First mode should be the default one.
 *
 * @returns {[string, string, string]}
 */
export const modes = () => [DESKTOP, TABLET, MOBILE];

/**
 * Check if hte value a is valid responsive mode value
 *
 * @param {string} v
 * @returns {boolean}
 */
export const isMode = v => modes().includes(v);

/**
 * Takes a value and checks if is a valid responsive mode.
 *  - if it is, return the value
 *  - otherwise, return default responsive mode
 *
 * @param v
 * @returns {string}
 */
export const toMode = v => (isMode(v) ? v : defaultMode());

/**
 * Returns responsive modes that refer to mobile devices
 * Note: Do not confuse MOBILE mode with mobile devices
 * TABLET is part of mobile deices too
 *
 * @returns {string[]}
 */
export const mobileModes = () => [TABLET, MOBILE];

/**
 * Check if the responsive mode is a mobile responsive mode
 *
 * @param {string} mode
 * @returns {boolean}
 */
export const isMobile = mode => mobileModes().includes(toMode(mode));

/**
 * Returns responsive modes that refer to desktop devices
 *
 * @returns {string[]}
 */
export const desktopModes = () => [DESKTOP];

/**
 * Check if the responsive mode is a desktop responsive mode
 *
 * @param {string} mode
 * @returns {boolean}
 */
export const isDesktop = mode => desktopModes().includes(toMode(mode));
