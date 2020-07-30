import { Append, Concat } from "visual/utils/types/Monoid";
import { MRead, Reader } from "visual/utils/types/Type";
import { IsEqual } from "visual/utils/types/Eq";

export type ResponsiveMode = "desktop" | "tablet" | "mobile";

export const DESKTOP = "desktop";
export const TABLET = "tablet";
export const MOBILE = "mobile";

export const types: ResponsiveMode[] = ["desktop", "tablet", "mobile"];

/**
 * Takes a value and checks if is a valid responsive mode.
 *  - if it is, return the value
 *  - otherwise, return undefined
 */
export const read: Reader<ResponsiveMode> = v =>
  types.includes(v as ResponsiveMode) ? (v as ResponsiveMode) : undefined;

/**
 * Compare 2 responsive modes for equality
 */
export const eq: IsEqual<ResponsiveMode> = (a, b) => a === b;

/**
 * Default responsive mode
 */
export const empty: ResponsiveMode = "desktop";

/**
 * Choice between 2 responsive modes,
 * return the first one that is not the default one
 */
export const append: Append<ResponsiveMode> = (a, b) => (a === empty ? b : a);

/**
 * Reduce array of modes to the first none default mode
 */
export const concat: Concat<ResponsiveMode> = as => as.reduce(append, empty);

/**
 * Takes a value and checks if is a valid responsive mode.
 *  - if it is, return the value
 *  - otherwise, return default responsive mode
 */
export const mRead: MRead<ResponsiveMode> = v => read(v) ?? empty;

/**
 * Return default responsive mode
 *
 * @returns {string}
 *
 * @deprecated Use `empty` variable instead
 */
export const defaultMode = (): ResponsiveMode => DESKTOP;

/**
 * Returns all responsive modes list.
 * First mode should be the default one.
 *
 * @returns {[string, string, string]}
 *
 * @deprecated Use `types` variable instead
 */
export const modes = (): ResponsiveMode[] => ["desktop", "tablet", "mobile"];

/**
 * Check if the value a is valid responsive mode value
 *
 * @param {string} v
 * @returns {boolean}
 */
export const isMode = (v: unknown): boolean => !!read(v);

/**
 * Takes a value and checks if is a valid responsive mode.
 *  - if it is, return the value
 *  - otherwise, return default responsive mode
 *
 * @param v
 * @returns {string}
 *
 * @deprecated, use `mRead`
 */
export const toMode = mRead;

/**
 * Returns responsive modes that refer to mobile devices
 * Note: Do not confuse MOBILE mode with mobile devices
 * TABLET is part of mobile deices too
 */
export const mobileModes = (): ResponsiveMode[] => [TABLET, MOBILE];

/**
 * Check if the responsive mode is a mobile responsive mode
 */
export const isMobile = (mode: ResponsiveMode): boolean =>
  mobileModes().includes(mode);

/**
 * Returns responsive modes that refer to desktop devices
 */
export const desktopModes = (): ResponsiveMode[] => [DESKTOP];

/**
 * Check if the responsive mode is a desktop responsive mode
 */
export const isDesktop = (mode: ResponsiveMode): boolean =>
  desktopModes().includes(mode);
