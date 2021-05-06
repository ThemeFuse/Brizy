import { _apply, get, set, setter2 } from "visual/utils/model";
import {
  getHex,
  getOpacity,
  getPalette
} from "visual/component/Options/types/dev/ColorPicker/model";
import * as ColorPicker from "visual/component/Options/types/dev/ColorPicker/model";
import {
  fieldsEnabled,
  toggleColor,
  toggleFields,
  toggleType
} from "visual/component/Options/types/dev/BoxShadow/utils";
import * as Palette from "visual/component/Options/types/dev/ColorPicker/entities/palette";
import * as Type from "./entities/Type";
import { capitalize } from "visual/utils/string";
import { Value } from "./entities/Value";
import * as Hex from "visual/utils/color/Hex";
import * as Opacity from "visual/utils/cssProps/opacity";

/**
 * @param {object} m
 * @return {string}
 */
export const getType = <V extends Value>(m: V): V["type"] => m.type;

/**
 * Set box shadow type
 *
 * @param {string} v
 * @param {object} m
 * @return {object}
 */
export const setType = (v: Type.Type, m: Value): Value => {
  if (undefined === Type.read(v) || getType(m) === v) {
    return m;
  }

  const isNone = v === Type.empty;
  const setters = [
    [set, "tempType", isNone ? get("type", m) : undefined],
    [set, "type", v],
    [toggleFields, !isNone],
    [toggleColor, !isNone]
  ];

  return _apply(setters, m);
};

/**
 * Set box shadow opacity
 *
 * @param {number} v
 * @param {object} m
 * @return {object}
 */
export const setOpacity = (v: Opacity.Opacity, m: Value): Value => {
  if (getOpacity(m) === v) {
    return m;
  }

  const enable = v > 0;
  return _apply(
    [
      [ColorPicker.setOpacity, v],
      [toggleType, enable]
    ],
    m
  );
};

/**
 * Set box shadow hex
 *
 * @param {string} v
 * @param {object} m
 * @return {object}
 */
export const setHex = (v: Hex.Hex, m: Value): Value => {
  if (getHex(m) === v) {
    return m;
  }

  const enable = v !== "";
  return _apply(
    [
      [ColorPicker.setHex, v],
      [toggleType, enable]
    ],
    m
  );
};

/**
 * Set box shadow palette
 *
 * @param {string} v
 * @param {object} m
 * @return {object}
 */
export const setPalette = (v: Palette.Palette, m: Value): Value => {
  if (getPalette(m) === v) {
    return m;
  }

  const enable = v !== Palette.empty;

  return _apply(
    [
      [ColorPicker.setPalette, v],
      [toggleType, enable]
    ],
    m
  );
};

/**
 * @param {object} m
 * @return {number}
 */
export const getBlur = <V extends Value>(m: V): V["blur"] => m.blur;

const setTempField = <K extends keyof Value>(
  k: K,
  v: Value[K],
  m: Value
): Value => {
  return set(
    `temp${capitalize(k)}` as keyof Value,
    (v ? v : fieldsEnabled(m) ? 0 : m[k] || undefined) as Value[K],
    m
  );
};

/**
 * Set box shadow blur
 *
 * @param {number} v
 * @param {object} m
 * @return {object}
 */
export const setBlur = setter2(getBlur, (v, m) =>
  _apply(
    [
      [set, "blur", v],
      [setTempField, "blur", v],
      [(m: Value): Value => toggleType(fieldsEnabled(m), m)]
    ],
    m
  )
);

/**
 * @param {object} m
 */
export const getSpread = <V extends Value>(m: V): V["spread"] => m.spread;

/**
 * Set box shadow spread
 *
 * @param {number} v
 * @param {object} m
 * @return {object}
 */
export const setSpread = setter2(getSpread, (v, m) =>
  _apply(
    [
      [set, "spread", v],
      [setTempField, "spread", v],
      [(m: Value): Value => toggleType(fieldsEnabled(m), m)]
    ],
    m
  )
);

export const getHorizontal = <V extends Value>(m: V): V["horizontal"] =>
  m.horizontal;

/**
 * Set box shadow horizontal
 *
 * @param {number} v
 * @param {object} m
 * @return {object}
 */
export const setHorizontal = setter2(getHorizontal, (v, m) =>
  _apply(
    [
      [set, "horizontal", v],
      [set, "tempHorizontal", v]
    ],
    m
  )
);

/**
 * @param {object} m
 */
export const getVertical = <V extends Value>(m: V): V["vertical"] => m.vertical;

/**
 * Set box shadow vertical
 *
 * @param {number} v
 * @param {object} m
 * @return {object}
 */
export const setVertical = setter2(getVertical, (v, m) =>
  _apply(
    [
      [set, "vertical", v],
      [set, "tempVertical", v]
    ],
    m
  )
);

export { getHex, getOpacity, getPalette };
