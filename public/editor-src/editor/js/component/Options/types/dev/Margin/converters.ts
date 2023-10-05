import { mPipe, parseStrict } from "fp-utilities";
import {
  FromElementModel,
  FromElementModelGetter,
  ToElementModel,
  callGetter
} from "visual/component/Options/Type";
import { Value } from "visual/component/Options/types/dev/Margin/types/Value";
import * as Unit from "visual/component/Options/utils/SpacingUnit";
import * as Type from "visual/component/Options/utils/Type";
import { pipe } from "visual/utils/fp";
import * as Num from "visual/utils/math/number";
import * as Str from "visual/utils/string/specs";
import { onNullish } from "visual/utils/value";

export const fromElementModel: FromElementModel<"margin-dev"> = parseStrict<
  FromElementModelGetter,
  Value
>({
  type: pipe(
    mPipe(callGetter("type"), Str.read, Type.fromString),
    onNullish("grouped" as Type.Type)
  ),
  value: pipe(mPipe(callGetter("value"), Num.read), onNullish(0)),
  tempValue: pipe(mPipe(callGetter("tempValue"), Num.read), onNullish(0)),
  unit: pipe(
    mPipe(callGetter("suffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  ),
  tempUnit: pipe(
    mPipe(callGetter("tempSuffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  ),
  top: pipe(mPipe(callGetter("top"), Num.read), onNullish(0)),
  tempTop: pipe(mPipe(callGetter("tempTop"), Num.read), onNullish(0)),
  topUnit: pipe(
    mPipe(callGetter("topSuffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  ),
  tempTopUnit: pipe(
    mPipe(callGetter("tempTopSuffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  ),
  right: pipe(mPipe(callGetter("right"), Num.read), onNullish(0)),
  tempRight: pipe(mPipe(callGetter("tempRight"), Num.read), onNullish(0)),
  rightUnit: pipe(
    mPipe(callGetter("rightSuffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  ),
  tempRightUnit: pipe(
    mPipe(callGetter("tempRightSuffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  ),
  bottom: pipe(mPipe(callGetter("bottom"), Num.read), onNullish(0)),
  tempBottom: pipe(mPipe(callGetter("tempBottom"), Num.read), onNullish(0)),
  bottomUnit: pipe(
    mPipe(callGetter("bottomSuffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  ),
  tempBottomUnit: pipe(
    mPipe(callGetter("tempBottomSuffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  ),
  left: pipe(mPipe(callGetter("left"), Num.read), onNullish(0)),
  tempLeft: pipe(mPipe(callGetter("tempLeft"), Num.read), onNullish(0)),
  leftUnit: pipe(
    mPipe(callGetter("leftSuffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  ),
  tempLeftUnit: pipe(
    mPipe(callGetter("tempLeftSuffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  )
});

export const toElementModel: ToElementModel<"margin-dev"> = (v) => {
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
  value: 0,
  tempValue: 0,
  unit: "px",
  tempUnit: "px",
  top: 0,
  tempTop: 0,
  topUnit: "px",
  tempTopUnit: "px",
  right: 0,
  tempRight: 0,
  rightUnit: "px",
  tempRightUnit: "px",
  bottom: 0,
  tempBottom: 0,
  bottomUnit: "px",
  tempBottomUnit: "px",
  left: 0,
  tempLeft: 0,
  leftUnit: "px",
  tempLeftUnit: "px"
};
