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
 * @param {function(o:*, parentOption:*):*} f
 * @param option
 * @param {*=}parentOption
 * @return {*}
 */

export const optionMap = (f, option, parentOption) => {
  return isOption(option)
    ? map(optionMap.bind(null, f), f(option, parentOption), parentOption)
    : map(optionMap.bind(null, f), option, parentOption);
};
