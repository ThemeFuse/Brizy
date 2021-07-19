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
  optional,
  parseStrict,
  readWithParser
} from "visual/utils/reader/readWithParser";
import { mPipe } from "visual/utils/fp";
import { MValue } from "visual/utils/value";
import { Literal } from "visual/utils/types/Literal";
import { GetElementModel, GetModel } from "visual/component/Options/Type";
import { Value as NV } from "visual/component/Controls/NumberUnit/types";
import { Props as SP } from "visual/component/Controls/Spacing";
import { prop } from "visual/utils/object/get";
import { Edge } from "visual/component/Controls/Spacing/types";
import { Setter } from "visual/utils/model";
import * as Margin from "visual/component/Options/types/dev/Margin/utils";

type Get = (k: string) => MValue<Literal>;
const call = (k: string) => (get: Get): MValue<Literal> => get(k);

export const fromElementModel: GetModel<Value> = parseStrict<
  Get,
  Partial<Value>
>({
  type: optional(mPipe(call("type"), Str.read, Type.fromString)),
  value: optional(mPipe(call("value"), Num.read, Positive.fromNumber)),
  tempValue: optional(mPipe(call("tempValue"), Num.read, Positive.fromNumber)),
  unit: optional(mPipe(call("suffix"), Str.read, Unit.fromString)),
  tempUnit: optional(mPipe(call("tempSuffix"), Str.read, Unit.fromString)),
  top: optional(mPipe(call("top"), Num.read, Positive.fromNumber)),
  tempTop: optional(mPipe(call("tempTop"), Num.read, Positive.fromNumber)),
  topUnit: optional(mPipe(call("topSuffix"), Str.read, Unit.fromString)),
  tempTopUnit: optional(
    mPipe(call("tempTopSuffix"), Str.read, Unit.fromString)
  ),
  right: optional(mPipe(call("right"), Num.read, Positive.fromNumber)),
  tempRight: optional(mPipe(call("tempRight"), Num.read, Positive.fromNumber)),
  rightUnit: optional(mPipe(call("rightSuffix"), Str.read, Unit.fromString)),
  tempRightUnit: optional(
    mPipe(call("tempRightSuffix"), Str.read, Unit.fromString)
  ),
  bottom: optional(mPipe(call("bottom"), Num.read, Positive.fromNumber)),
  tempBottom: optional(
    mPipe(call("tempBottom"), Num.read, Positive.fromNumber)
  ),
  bottomUnit: optional(mPipe(call("bottomSuffix"), Str.read, Unit.fromString)),
  tempBottomUnit: optional(
    mPipe(call("tempBottomSuffix"), Str.read, Unit.fromString)
  ),
  left: optional(mPipe(call("left"), Num.read, Positive.fromNumber)),
  tempLeft: optional(mPipe(call("tempLeft"), Num.read, Positive.fromNumber)),
  leftUnit: optional(mPipe(call("leftSuffix"), Str.read, Unit.fromString)),
  tempLeftUnit: optional(
    mPipe(call("tempLeftSuffix"), Str.read, Unit.fromString)
  )
});

export const toElementModel: GetElementModel<Value> = (v, get) => {
  return {
    [get("type")]: v.type,
    [get("value")]: v.value,
    [get("tempValue")]: v.tempValue,
    [get("suffix")]: v.unit,
    [get("tempSuffix")]: v.tempUnit,
    [get("top")]: v.top,
    [get("tempTop")]: v.tempTop,
    [get("topSuffix")]: v.topUnit,
    [get("tempTopSuffix")]: v.tempTopUnit,
    [get("right")]: v.right,
    [get("tempRight")]: v.tempRight,
    [get("rightSuffix")]: v.rightUnit,
    [get("tempRightSuffix")]: v.tempRightUnit,
    [get("bottom")]: v.bottom,
    [get("tempBottom")]: v.tempBottom,
    [get("bottomSuffix")]: v.bottomUnit,
    [get("tempBottomSuffix")]: v.tempBottomUnit,
    [get("left")]: v.left,
    [get("tempLeft")]: v.tempLeft,
    [get("leftSuffix")]: v.leftUnit,
    [get("tempLeftSuffix")]: v.tempLeftUnit
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

export const units: SP<Unit.SpacingUnit>["units"] = [
  {
    value: "px",
    title: "px"
  },
  {
    value: "%",
    title: "%"
  }
];

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
