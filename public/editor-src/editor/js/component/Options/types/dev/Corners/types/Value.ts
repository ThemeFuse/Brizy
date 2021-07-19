import { Unit } from "./Unit";
import { Positive } from "visual/utils/math/Positive";
import { Type } from "visual/component/Options/utils/Type";

export interface Value {
  type: Type;
  value: Positive;
  unit: Unit;
  topLeft: Positive;
  tempTopLeft: Positive;
  topLeftUnit: Unit;
  tempTopLeftUnit: Unit;
  topRight: Positive;
  tempTopRight: Positive;
  topRightUnit: Unit;
  tempTopRightUnit: Unit;
  bottomRight: Positive;
  tempBottomRight: Positive;
  bottomRightUnit: Unit;
  tempBottomRightUnit: Unit;
  bottomLeft: Positive;
  tempBottomLeft: Positive;
  bottomLeftUnit: Unit;
  tempBottomLeftUnit: Unit;
}

// region Grouped
interface Grouped extends Value {
  type: "grouped";
}

export const fromUngrouped = (m: Ungrouped): Grouped => ({
  ...m,
  type: "grouped",

  topRight: m.value,
  topRightUnit: m.unit,
  topLeft: m.value,
  topLeftUnit: m.unit,
  bottomRight: m.value,
  bottomRightUnit: m.unit,
  bottomLeft: m.value,
  bottomLeftUnit: m.unit
});
// endregion

// region Ungrouped
interface Ungrouped extends Value {
  type: "ungrouped";
}

export const fromGrouped = (m: Grouped): Ungrouped => ({
  ...m,
  type: "ungrouped",

  topLeft: m.tempTopLeft,
  topLeftUnit: m.tempTopLeftUnit,

  topRight: m.tempTopRight,
  topRightUnit: m.tempTopRightUnit,

  bottomRight: m.tempBottomRight,
  bottomRightUnit: m.tempBottomRightUnit,

  bottomLeft: m.tempBottomLeft,
  bottomLeftUnit: m.tempBottomLeftUnit
});
// endregion

// region Type
export const getType = (m: Value): Type => m.type;

export function setType(v: Type, m: Value): Value {
  switch (v) {
    case "ungrouped":
      return m.type === "grouped" ? fromGrouped(m as Grouped) : m;
    case "grouped":
      return m.type === "ungrouped" ? fromUngrouped(m as Ungrouped) : m;
  }
}
// endregion

// region Value
export const getValue = (m: Value): Positive => m.value;

export const setValue = (value: Positive, m: Value): Value => ({
  ...m,
  value: value,
  topLeft: value,
  topRight: value,
  bottomRight: value,
  bottomLeft: value,
  tempTopLeft: value,
  tempTopRight: value,
  tempBottomRight: value,
  tempBottomLeft: value,
  tempTopLeftUnit: m.unit,
  tempTopRightUnit: m.unit,
  tempBottomRightUnit: m.unit,
  tempBottomLeftUnit: m.unit
});

export const getUnit = (m: Value): Unit => m.unit;

export const setUnit = (unit: Unit, m: Value): Value => ({
  ...m,
  unit,
  topLeftUnit: unit,
  topRightUnit: unit,
  bottomRightUnit: unit,
  bottomLeftUnit: unit,
  tempTopLeft: m.value,
  tempTopRight: m.value,
  tempBottomRight: m.value,
  tempBottomLeft: m.value,
  tempTopLeftUnit: unit,
  tempTopRightUnit: unit,
  tempBottomRightUnit: unit,
  tempBottomLeftUnit: unit
});
// endregion

// region Top Left
export const getTopLeft = (m: Value): Positive => m.topLeft;

export const setTopLeft = (topLeft: Positive, m: Value): Value => ({
  ...m,
  topLeft,
  tempTopLeft: topLeft
});

export const getTopLeftUnit = (m: Value): Unit => m.topLeftUnit;

export const setTopLeftUnit = (topLeftUnit: Unit, m: Value): Value => ({
  ...m,
  topLeftUnit,
  tempTopLeftUnit: topLeftUnit
});

// endregion

// region Top Right
export const getTopRight = (m: Value): Positive => m.topRight;

export const setTopRight = (topRight: Positive, m: Value): Value => ({
  ...m,
  topRight,
  tempTopRight: topRight
});

export const getTopRightUnit = (m: Value): Unit => m.topRightUnit;

export const setTopRightUnit = (topRightUnit: Unit, m: Value): Value => ({
  ...m,
  topRightUnit,
  tempTopRightUnit: topRightUnit
});

// endregion

// region Bottom Right
export const getBottomRight = (m: Value): Positive => m.bottomRight;

export const setBottomRight = (bottomRight: Positive, m: Value): Value => ({
  ...m,
  bottomRight,
  tempBottomRight: bottomRight
});

export const getBottomRightUnit = (m: Value): Unit => m.bottomRightUnit;

export const setBottomRightUnit = (bottomRightUnit: Unit, m: Value): Value => ({
  ...m,
  bottomRightUnit,
  tempBottomRightUnit: bottomRightUnit
});

// endregion

// region Bottom Left
export const getBottomLeft = (m: Value): Positive => m.bottomLeft;

export const setBottomLeft = (bottomLeft: Positive, m: Value): Value => ({
  ...m,
  bottomLeft,
  tempBottomLeft: bottomLeft
});

export const getBottomLeftUnit = (m: Value): Unit => m.bottomLeftUnit;

export const setBottomLeftUnit = (bottomLeftUnit: Unit, m: Value): Value => ({
  ...m,
  bottomLeftUnit,
  tempBottomLeftUnit: bottomLeftUnit
});

// endregion
