import { parseStrict } from "fp-utilities";
import {
  FromElementModel,
  FromElementModelGetter,
  ToElementModel
} from "visual/component/Options/Type";
import { mPipe, pipe } from "visual/utils/fp";
import * as Positive from "visual/utils/math/Positive";
import * as Num from "visual/utils/math/number";
import * as Unit from "visual/utils/options/utils/SpacingUnit";
import * as Type from "visual/utils/options/utils/Type";
import * as Str from "visual/utils/string/specs";
import { onNullish } from "visual/utils/value";
import { callGetter } from "../utils/wrap";
import { Value } from "./types/Value";

export const defaultValue: Value = {
  type: "grouped",
  value: Positive.Zero,
  tempValue: Positive.Zero,
  unit: "px",
  tempUnit: "px",
  top: Positive.Zero,
  tempTop: Positive.Zero,
  topUnit: "px",
  tempTopUnit: "px",
  right: Positive.Zero,
  tempRight: Positive.Zero,
  rightUnit: "px",
  tempRightUnit: "px",
  bottom: Positive.Zero,
  tempBottom: Positive.Zero,
  bottomUnit: "px",
  tempBottomUnit: "px",
  left: Positive.Zero,
  tempLeft: Positive.Zero,
  leftUnit: "px",
  tempLeftUnit: "px"
};

export const fromElementModel: FromElementModel<"padding"> = parseStrict<
  FromElementModelGetter,
  Value
>({
  type: pipe(
    mPipe(callGetter("type"), Str.read, Type.fromString),
    onNullish(defaultValue.type)
  ),
  value: pipe(
    mPipe(callGetter("value"), Num.read, Positive.fromNumber),
    onNullish(defaultValue.value)
  ),
  tempValue: pipe(
    mPipe(callGetter("tempValue"), Num.read, Positive.fromNumber),
    onNullish(defaultValue.tempValue)
  ),
  unit: pipe(
    mPipe(callGetter("suffix"), Str.read, Unit.fromString),
    onNullish(defaultValue.unit)
  ),
  tempUnit: pipe(
    mPipe(callGetter("tempSuffix"), Str.read, Unit.fromString),
    onNullish(defaultValue.tempUnit)
  ),
  top: pipe(
    mPipe(callGetter("top"), Num.read, Positive.fromNumber),
    onNullish(defaultValue.top)
  ),
  tempTop: pipe(
    mPipe(callGetter("tempTop"), Num.read, Positive.fromNumber),
    onNullish(defaultValue.tempTop)
  ),
  topUnit: pipe(
    mPipe(callGetter("topSuffix"), Str.read, Unit.fromString),
    onNullish(defaultValue.topUnit)
  ),
  tempTopUnit: pipe(
    mPipe(callGetter("tempTopSuffix"), Str.read, Unit.fromString),
    onNullish(defaultValue.tempTopUnit)
  ),
  right: pipe(
    mPipe(callGetter("right"), Num.read, Positive.fromNumber),
    onNullish(defaultValue.right)
  ),
  tempRight: pipe(
    mPipe(callGetter("tempRight"), Num.read, Positive.fromNumber),
    onNullish(defaultValue.tempRight)
  ),
  rightUnit: pipe(
    mPipe(callGetter("rightSuffix"), Str.read, Unit.fromString),
    onNullish(defaultValue.rightUnit)
  ),
  tempRightUnit: pipe(
    mPipe(callGetter("tempRightSuffix"), Str.read, Unit.fromString),
    onNullish(defaultValue.tempRightUnit)
  ),
  bottom: pipe(
    mPipe(callGetter("bottom"), Num.read, Positive.fromNumber),
    onNullish(defaultValue.bottom)
  ),
  tempBottom: pipe(
    mPipe(callGetter("tempBottom"), Num.read, Positive.fromNumber),
    onNullish(defaultValue.tempBottom)
  ),
  bottomUnit: pipe(
    mPipe(callGetter("bottomSuffix"), Str.read, Unit.fromString),
    onNullish(defaultValue.bottomUnit)
  ),
  tempBottomUnit: pipe(
    mPipe(callGetter("tempBottomSuffix"), Str.read, Unit.fromString),
    onNullish(defaultValue.tempBottomUnit)
  ),
  left: pipe(
    mPipe(callGetter("left"), Num.read, Positive.fromNumber),
    onNullish(defaultValue.left)
  ),
  tempLeft: pipe(
    mPipe(callGetter("tempLeft"), Num.read, Positive.fromNumber),
    onNullish(defaultValue.tempLeft)
  ),
  leftUnit: pipe(
    mPipe(callGetter("leftSuffix"), Str.read, Unit.fromString),
    onNullish(defaultValue.leftUnit)
  ),
  tempLeftUnit: pipe(
    mPipe(callGetter("tempLeftSuffix"), Str.read, Unit.fromString),
    onNullish(defaultValue.tempLeftUnit)
  )
});

export const toElementModel: ToElementModel<"padding"> = (v) => {
  return {
    type: v.type,
    value: v.value,
    tempValue: v.tempValue,
    suffix: v.unit,
    tempSuffix: v.tempUnit,
    top: v.top,
    tempTop: v.tempTop,
    topSuffix: v.topUnit,
    tempTopSuffix: v.tempTopUnit,
    right: v.right,
    tempRight: v.tempRight,
    rightSuffix: v.rightUnit,
    tempRightSuffix: v.tempRightUnit,
    bottom: v.bottom,
    tempBottom: v.tempBottom,
    bottomSuffix: v.bottomUnit,
    tempBottomSuffix: v.tempBottomUnit,
    left: v.left,
    tempLeft: v.tempLeft,
    leftSuffix: v.leftUnit,
    tempLeftSuffix: v.tempLeftUnit
  };
};
