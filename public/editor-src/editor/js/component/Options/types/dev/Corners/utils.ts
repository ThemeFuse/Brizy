import * as Str from "visual/utils/string/specs";
import * as Num from "visual/utils/math/number";
import * as Positive from "visual/utils/math/Positive";
import * as Unit from "./types/Unit";
import * as Type from "visual/component/Options/utils/Type";
import {
  setBottomRight,
  setBottomRightUnit,
  setBottomLeft,
  setBottomLeftUnit,
  setValue,
  setTopRight,
  setTopRightUnit,
  setTopLeft,
  setTopLeftUnit,
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
  type: optional(mPipe(call("radiusType"), Str.read, Type.fromString)),
  value: optional(mPipe(call("radius"), Num.read, Positive.fromNumber)),
  unit: optional(mPipe(call("radiusSuffix"), Str.read, Unit.fromString)),
  topLeft: optional(
    mPipe(call("topLeftRadius"), Num.read, Positive.fromNumber)
  ),
  tempTopLeft: optional(
    mPipe(call("tempTopLeftRadius"), Num.read, Positive.fromNumber)
  ),
  topLeftUnit: optional(
    mPipe(call("topLeftRadiusSuffix"), Str.read, Unit.fromString)
  ),
  tempTopLeftUnit: optional(
    mPipe(call("tempTopLeftRadiusSuffix"), Str.read, Unit.fromString)
  ),
  topRight: optional(
    mPipe(call("topRightRadius"), Num.read, Positive.fromNumber)
  ),
  tempTopRight: optional(
    mPipe(call("tempTopRightRadius"), Num.read, Positive.fromNumber)
  ),
  topRightUnit: optional(
    mPipe(call("topRightRadiusSuffix"), Str.read, Unit.fromString)
  ),
  tempTopRightUnit: optional(
    mPipe(call("tempTopRightRadiusSuffix"), Str.read, Unit.fromString)
  ),
  bottomRight: optional(
    mPipe(call("bottomRightRadius"), Num.read, Positive.fromNumber)
  ),
  tempBottomRight: optional(
    mPipe(call("tempBottomRightRadius"), Num.read, Positive.fromNumber)
  ),
  bottomRightUnit: optional(
    mPipe(call("bottomRightRadiusSuffix"), Str.read, Unit.fromString)
  ),
  tempBottomRightUnit: optional(
    mPipe(call("tempBottomRightRadiusSuffix"), Str.read, Unit.fromString)
  ),
  bottomLeft: optional(
    mPipe(call("bottomLeftRadius"), Num.read, Positive.fromNumber)
  ),
  tempBottomLeft: optional(
    mPipe(call("tempBottomLeftRadius"), Num.read, Positive.fromNumber)
  ),
  bottomLeftUnit: optional(
    mPipe(call("bottomLeftRadiusSuffix"), Str.read, Unit.fromString)
  ),
  tempBottomLeftUnit: optional(
    mPipe(call("tempBottomLeftRadiusSuffix"), Str.read, Unit.fromString)
  )
});

export const toElementModel: GetElementModel<Value> = (v, get) => {
  return {
    [get("radiusType")]: v.type,
    [get("radius")]: v.value,
    [get("radiusSuffix")]: v.unit,
    [get("topLeftRadius")]: v.topLeft,
    [get("tempTopLeftRadius")]: v.tempTopLeft,
    [get("topLeftRadiusSuffix")]: v.topLeftUnit,
    [get("tempTopLeftRadiusSuffix")]: v.tempTopLeftUnit,
    [get("topRightRadius")]: v.topRight,
    [get("tempTopRightRadius")]: v.tempTopRight,
    [get("topRightRadiusSuffix")]: v.topRightUnit,
    [get("tempTopRightRadiusSuffix")]: v.tempTopRightUnit,
    [get("bottomRightRadius")]: v.bottomRight,
    [get("tempBottomRightRadius")]: v.tempBottomRight,
    [get("bottomRightRadiusSuffix")]: v.bottomRightUnit,
    [get("tempBottomRightRadiusSuffix")]: v.tempBottomRightUnit,
    [get("bottomLeftRadius")]: v.bottomLeft,
    [get("tempBottomLeftRadius")]: v.tempBottomLeft,
    [get("bottomLeftRadiusSuffix")]: v.bottomLeftUnit,
    [get("tempBottomLeftRadiusSuffix")]: v.tempBottomLeftUnit
  };
};

export const defaultValue: Value = {
  type: "grouped",
  value: Positive.Zero,
  unit: "px",
  topLeft: Positive.Zero,
  tempTopLeft: Positive.Zero,
  topLeftUnit: "px",
  tempTopLeftUnit: "px",
  topRight: Positive.Zero,
  tempTopRight: Positive.Zero,
  topRightUnit: "px",
  tempTopRightUnit: "px",
  bottomRight: Positive.Zero,
  tempBottomRight: Positive.Zero,
  bottomRightUnit: "px",
  tempBottomRightUnit: "px",
  bottomLeft: Positive.Zero,
  tempBottomLeft: Positive.Zero,
  bottomLeftUnit: "px",
  tempBottomLeftUnit: "px"
};

export const fromNumberSlider = readWithParser<
  NV<Unit.Unit>,
  { number: number; unit: Unit.Unit }
>({
  number: v => v.number,
  unit: v => v.unit
});

export const getIcon: SP<Unit.Unit>["getIcon"] = e => {
  switch (e) {
    case "grouped":
      return "nc-corners-all";
    case "ungrouped":
      return "nc-corners-individual";
    case "top":
      return "nc-corners-top-left";
    case "right":
      return "nc-corners-top-right";
    case "bottom":
      return "nc-corners-bottom-right";
    case "left":
      return "nc-corners-bottom-left";
  }
};

export const valueSetter = (e: Edge): Setter<Positive.Positive, Value> => {
  switch (e) {
    case "all":
      return setValue;
    case "top":
      return setTopLeft;
    case "right":
      return setTopRight;
    case "bottom":
      return setBottomRight;
    case "left":
      return setBottomLeft;
  }
};

export const unitSetter = (e: Edge): Setter<"px", Value> => {
  switch (e) {
    case "all":
      return setUnit;
    case "top":
      return setTopLeftUnit;
    case "right":
      return setTopRightUnit;
    case "bottom":
      return setBottomRightUnit;
    case "left":
      return setBottomLeftUnit;
  }
};
