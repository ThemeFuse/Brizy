import * as Str from "visual/utils/string/specs";
import * as Num from "visual/utils/math/number";
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
import { Edge } from "visual/component/Controls/Spacing/types";
import { Setter } from "visual/utils/model";

type Get = (k: string) => MValue<Literal>;
const call = (k: string) => (get: Get): MValue<Literal> => get(k);

export const fromElementModel: GetModel<Value> = parseStrict<
  Get,
  Partial<Value>
>({
  type: optional(mPipe(call("type"), Str.read, Type.fromString)),
  value: optional(mPipe(call("value"), Num.read)),
  tempValue: optional(mPipe(call("tempValue"), Num.read)),
  unit: optional(mPipe(call("suffix"), Str.read, Unit.fromString)),
  tempUnit: optional(mPipe(call("tempSuffix"), Str.read, Unit.fromString)),
  top: optional(mPipe(call("top"), Num.read)),
  tempTop: optional(mPipe(call("tempTop"), Num.read)),
  topUnit: optional(mPipe(call("topSuffix"), Str.read, Unit.fromString)),
  tempTopUnit: optional(
    mPipe(call("tempTopSuffix"), Str.read, Unit.fromString)
  ),
  right: optional(mPipe(call("right"), Num.read)),
  tempRight: optional(mPipe(call("tempRight"), Num.read)),
  rightUnit: optional(mPipe(call("rightSuffix"), Str.read, Unit.fromString)),
  tempRightUnit: optional(
    mPipe(call("tempRightSuffix"), Str.read, Unit.fromString)
  ),
  bottom: optional(mPipe(call("bottom"), Num.read)),
  tempBottom: optional(mPipe(call("tempBottom"), Num.read)),
  bottomUnit: optional(mPipe(call("bottomSuffix"), Str.read, Unit.fromString)),
  tempBottomUnit: optional(
    mPipe(call("tempBottomSuffix"), Str.read, Unit.fromString)
  ),
  left: optional(mPipe(call("left"), Num.read)),
  tempLeft: optional(mPipe(call("tempLeft"), Num.read)),
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

export const fromNumberSlider = readWithParser<
  NV<Unit.SpacingUnit>,
  { number: number; unit: Unit.SpacingUnit }
>({
  number: v => v.number,
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

export const getIcon: SP<Unit.SpacingUnit>["getIcon"] = e => {
  switch (e) {
    case "grouped":
      return "nc-styling-all";
    case "ungrouped":
      return "nc-styling-individual";
    case "top":
      return "nc-styling-top";
    case "right":
      return "nc-styling-right";
    case "bottom":
      return "nc-styling-bottom";
    case "left":
      return "nc-styling-left";
  }
};

export const valueSetter = (e: Edge): Setter<number, Value> => {
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
