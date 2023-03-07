import {
  callGetter,
  FromElementModel,
  FromElementModelGetter,
  ToElementModel
} from "visual/component/Options/Type";
import { Value } from "visual/component/Options/types/dev/Padding/types/Value";
import { parseStrict } from "visual/utils/reader/readWithParser";
import { mPipe, pipe } from "visual/utils/fp";
import * as Str from "visual/utils/string/specs";
import * as Type from "visual/component/Options/utils/Type";
import { onNullish } from "visual/utils/value";
import * as Num from "visual/utils/math/number";
import * as Positive from "visual/utils/math/Positive";
import * as Unit from "visual/component/Options/utils/SpacingUnit";

export const fromElementModel: FromElementModel<"padding-dev"> = parseStrict<
  FromElementModelGetter,
  Value
>({
  type: pipe(
    mPipe(callGetter("type"), Str.read, Type.fromString),
    onNullish("grouped" as Type.Type)
  ),
  value: pipe(
    mPipe(callGetter("value"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  tempValue: pipe(
    mPipe(callGetter("tempValue"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  unit: pipe(
    mPipe(callGetter("suffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  ),
  tempUnit: pipe(
    mPipe(callGetter("tempSuffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  ),
  top: pipe(
    mPipe(callGetter("top"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  tempTop: pipe(
    mPipe(callGetter("tempTop"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  topUnit: pipe(
    mPipe(callGetter("topSuffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  ),
  tempTopUnit: pipe(
    mPipe(callGetter("tempTopSuffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  ),
  right: pipe(
    mPipe(callGetter("right"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  tempRight: pipe(
    mPipe(callGetter("tempRight"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  rightUnit: pipe(
    mPipe(callGetter("rightSuffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  ),
  tempRightUnit: pipe(
    mPipe(callGetter("tempRightSuffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  ),
  bottom: pipe(
    mPipe(callGetter("bottom"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  tempBottom: pipe(
    mPipe(callGetter("tempBottom"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  bottomUnit: pipe(
    mPipe(callGetter("bottomSuffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  ),
  tempBottomUnit: pipe(
    mPipe(callGetter("tempBottomSuffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  ),
  left: pipe(
    mPipe(callGetter("left"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  tempLeft: pipe(
    mPipe(callGetter("tempLeft"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  leftUnit: pipe(
    mPipe(callGetter("leftSuffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  ),
  tempLeftUnit: pipe(
    mPipe(callGetter("tempLeftSuffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  )
});

export const toElementModel: ToElementModel<"padding-dev"> = v => {
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
