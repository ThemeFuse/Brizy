import * as Str from "visual/utils/string/specs";
import * as Num from "visual/utils/math/number";
import * as Positive from "visual/utils/math/Positive";
import * as Unit from "visual/component/Options/utils/SpacingUnit";
import * as Type from "visual/component/Options/utils/Type";
import {
  setBottom,
  setBottomUnit,
  setLeft,
  setLeftUnit,
  setValue,
  setRight,
  setRightUnit,
  setTop,
  setTopUnit,
  setUnit,
  Value
} from "./types/Value";
import {
  parseStrict,
  readWithParser
} from "visual/utils/reader/readWithParser";
import { mPipe, pipe } from "visual/utils/fp";
import { MValue, onNullish } from "visual/utils/value";
import { Literal } from "visual/utils/types/Literal";
import {
  ToElementModel,
  FromElementModel
} from "visual/component/Options/Type";
import { Value as NV } from "visual/component/Controls/NumberUnit/types";
import { prop } from "visual/utils/object/get";
import { Edge } from "visual/component/Controls/Spacing/types";
import { Setter } from "visual/utils/model";
import * as Margin from "visual/component/Options/types/dev/Margin/utils";

type Get = (k: string) => MValue<Literal>;
const call = (k: string) => (get: Get): MValue<Literal> => get(k);

export const fromElementModel: FromElementModel<Value> = parseStrict<
  Get,
  Value
>({
  type: pipe(
    mPipe(call("type"), Str.read, Type.fromString),
    onNullish("grouped" as Type.Type)
  ),
  value: pipe(
    mPipe(call("value"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  tempValue: pipe(
    mPipe(call("tempValue"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  unit: pipe(
    mPipe(call("suffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  ),
  tempUnit: pipe(
    mPipe(call("tempSuffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  ),
  top: pipe(
    mPipe(call("top"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  tempTop: pipe(
    mPipe(call("tempTop"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  topUnit: pipe(
    mPipe(call("topSuffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  ),
  tempTopUnit: pipe(
    mPipe(call("tempTopSuffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  ),
  right: pipe(
    mPipe(call("right"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  tempRight: pipe(
    mPipe(call("tempRight"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  rightUnit: pipe(
    mPipe(call("rightSuffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  ),
  tempRightUnit: pipe(
    mPipe(call("tempRightSuffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  ),
  bottom: pipe(
    mPipe(call("bottom"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  tempBottom: pipe(
    mPipe(call("tempBottom"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  bottomUnit: pipe(
    mPipe(call("bottomSuffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  ),
  tempBottomUnit: pipe(
    mPipe(call("tempBottomSuffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  ),
  left: pipe(
    mPipe(call("left"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  tempLeft: pipe(
    mPipe(call("tempLeft"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  leftUnit: pipe(
    mPipe(call("leftSuffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  ),
  tempLeftUnit: pipe(
    mPipe(call("tempLeftSuffix"), Str.read, Unit.fromString),
    onNullish("px" as Unit.SpacingUnit)
  )
});

export const toElementModel: ToElementModel<Value> = v => {
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

export const fromNumberSlider = readWithParser<
  NV<Unit.SpacingUnit>,
  { number: Positive.Positive; unit: Unit.SpacingUnit }
>({
  number: mPipe(prop("number"), Positive.fromNumber),
  unit: v => v.unit
});

export const getIcon = Margin.getIcon;

export const valueSetter = (e: Edge): Setter<Positive.Positive, Value> => {
  switch (e) {
    case "all":
      return setValue;
    case "top":
      return setTop;
    case "right":
      return setRight;
    case "bottom":
      return setBottom;
    case "left":
      return setLeft;
  }
};

export const unitSetter = (e: Edge): Setter<Unit.SpacingUnit, Value> => {
  switch (e) {
    case "all":
      return setUnit;
    case "top":
      return setTopUnit;
    case "right":
      return setRightUnit;
    case "bottom":
      return setBottomUnit;
    case "left":
      return setLeftUnit;
  }
};
