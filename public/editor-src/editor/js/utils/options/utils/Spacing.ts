import { Type } from "./Type";

export interface Spacing<V, U> {
  type: Type;
  value: V;
  unit: U;
  tempTop: V;
  tempTopUnit: U;
  tempRight: V;
  tempRightUnit: U;
  tempBottom: V;
  tempBottomUnit: U;
  tempLeft: V;
  tempLeftUnit: U;
  tempValue: V;
  tempUnit: U;
  top: V;
  topUnit: U;
  right: V;
  rightUnit: U;
  bottom: V;
  bottomUnit: U;
  left: V;
  leftUnit: U;
}

interface Grouped<V, U> extends Spacing<V, U> {
  type: "grouped";
}

interface Ungrouped<V, U> extends Spacing<V, U> {
  type: "ungrouped";
}

export const fromUngrouped = <V, U>(m: Ungrouped<V, U>): Grouped<V, U> => ({
  ...m,
  type: "grouped",
  value: m.tempValue,
  unit: m.tempUnit,

  tempTop: m.top,
  tempTopUnit: m.topUnit,

  tempRight: m.right,
  tempRightUnit: m.rightUnit,

  tempBottom: m.bottom,
  tempBottomUnit: m.bottomUnit,

  tempLeft: m.left,
  tempLeftUnit: m.leftUnit
});

export const fromGrouped = <V, U>(m: Grouped<V, U>): Ungrouped<V, U> => ({
  ...m,
  type: "ungrouped",

  tempValue: m.value,
  tempUnit: m.unit,

  top: m.tempTop,
  topUnit: m.tempTopUnit,

  right: m.tempRight,
  rightUnit: m.tempRightUnit,

  bottom: m.tempBottom,
  bottomUnit: m.tempBottomUnit,

  left: m.tempLeft,
  leftUnit: m.tempLeftUnit
});

export const getType = <V, U>(m: Spacing<V, U>): Type => m.type;

export function setType<V, U>(v: Type, m: Spacing<V, U>): Spacing<V, U> {
  switch (v) {
    case "ungrouped":
      return m.type === "grouped" ? fromGrouped<V, U>(m as Grouped<V, U>) : m;
    case "grouped":
      return m.type === "ungrouped"
        ? fromUngrouped<V, U>(m as Ungrouped<V, U>)
        : m;
  }
}

// region Value
export const getValue = <V, U>(m: Spacing<V, U>): V => m.value;

export const setValue = <V, U>(value: V, m: Spacing<V, U>): Spacing<V, U> => ({
  ...m,
  value: value,
  top: value,
  right: value,
  bottom: value,
  left: value,
  tempTop: value,
  tempRight: value,
  tempBottom: value,
  tempLeft: value,
  tempTopUnit: m.unit,
  tempRightUnit: m.unit,
  tempBottomUnit: m.unit,
  tempLeftUnit: m.unit
});

export const getUnit = <V, U>(m: Spacing<V, U>): U => m.unit;

export const setUnit = <V, U>(unit: U, m: Spacing<V, U>): Spacing<V, U> => ({
  ...m,
  unit,
  topUnit: unit,
  rightUnit: unit,
  bottomUnit: unit,
  leftUnit: unit,
  tempTop: m.value,
  tempRight: m.value,
  tempBottom: m.value,
  tempLeft: m.value,
  tempTopUnit: unit,
  tempRightUnit: unit,
  tempBottomUnit: unit,
  tempLeftUnit: unit
});
// endregion

// region Top
export const getTop = <V, U>(m: Spacing<V, U>): V => m.top;

export const setTop = <V, U>(top: V, m: Spacing<V, U>): Spacing<V, U> => ({
  ...m,
  top,
  tempTop: top
});

export const getTopUnit = <V, U>(m: Spacing<V, U>): U => m.topUnit;

export const setTopUnit = <V, U>(
  topUnit: U,
  m: Spacing<V, U>
): Spacing<V, U> => ({
  ...m,
  topUnit,
  tempTopUnit: topUnit
});

// endregion

// region Right
export const getRight = <V, U>(m: Spacing<V, U>): V => m.right;

export const setRight = <V, U>(right: V, m: Spacing<V, U>): Spacing<V, U> => ({
  ...m,
  right,
  tempRight: right
});

export const getRightUnit = <V, U>(m: Spacing<V, U>): U => m.rightUnit;

export const setRightUnit = <V, U>(
  rightUnit: U,
  m: Spacing<V, U>
): Spacing<V, U> => ({
  ...m,
  rightUnit,
  tempRightUnit: rightUnit
});

// endregion

// region Bottom
export const getBottom = <V, U>(m: Spacing<V, U>): V => m.bottom;

export const setBottom = <V, U>(
  bottom: V,
  m: Spacing<V, U>
): Spacing<V, U> => ({
  ...m,
  bottom,
  tempBottom: bottom
});

export const getBottomUnit = <V, U>(m: Spacing<V, U>): U => m.bottomUnit;

export const setBottomUnit = <V, U>(
  bottomUnit: U,
  m: Spacing<V, U>
): Spacing<V, U> => ({
  ...m,
  bottomUnit,
  tempBottomUnit: bottomUnit
});

// endregion

// region Left
export const getLeft = <V, U>(m: Spacing<V, U>): V => m.left;

export const setLeft = <V, U>(left: V, m: Spacing<V, U>): Spacing<V, U> => ({
  ...m,
  left,
  tempLeft: left
});

export const getLeftUnit = <V, U>(m: Spacing<V, U>): U => m.leftUnit;

export const setLeftUnit = <V, U>(
  leftUnit: U,
  m: Spacing<V, U>
): Spacing<V, U> => ({
  ...m,
  leftUnit,
  tempLeftUnit: leftUnit
});

// endregion
