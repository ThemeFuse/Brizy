import { hasProps, map } from "visual/utils/object";
import mergeOptions from "./mergeOptions";
import optionTraverse from "./optionTraverse";

export { mergeOptions, optionTraverse };

/**
 * Check if object has option signature
 *
 * Option has both `id` and `type` properties
 *
 * @property {object} object
 * @return {boolean};
 */
export const isOption = (object) => hasProps(["id", "type"], object);

/**
 * Maps a function over a nested options structure
 *
 * @param {function(o:object):object} f
 * @param option
 * @return {*}
 */
export const optionMap = (f, option) => {
  return isOption(option)
    ? map(optionMap.bind(null, f), f(option))
    : map(optionMap.bind(null, f), option);
};
