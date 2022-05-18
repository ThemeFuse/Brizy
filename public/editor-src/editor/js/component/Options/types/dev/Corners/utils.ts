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
import { Props as SP } from "visual/component/Controls/Spacing";
import { Edge } from "visual/component/Controls/Spacing/types";
import { Setter } from "visual/utils/model";

type Get = (k: string) => MValue<Literal>;
const call = (k: string) => (get: Get): MValue<Literal> => get(k);

export const fromElementModel: FromElementModel<Value> = parseStrict<
  Get,
  Value
>({
  type: pipe(
    mPipe(call("radiusType"), Str.read, Type.fromString),
    onNullish<Type.Type>("grouped")
  ),
  value: pipe(
    mPipe(call("radius"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  unit: pipe(
    mPipe(call("radiusSuffix"), Str.read, Unit.fromString),
    onNullish<Unit.Unit>("px")
  ),
  topLeft: pipe(
    mPipe(call("topLeftRadius"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  tempTopLeft: pipe(
    mPipe(call("tempTopLeft"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  topLeftUnit: pipe(
    mPipe(call("topLeftRadiusSuffix"), Str.read, Unit.fromString),
    onNullish<Unit.Unit>("px")
  ),
  tempTopLeftUnit: pipe(
    mPipe(call("tempTopLeftRadiusSuffix"), Str.read, Unit.fromString),
    onNullish<Unit.Unit>("px")
  ),
  topRight: pipe(
    mPipe(call("topRightRadius"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  tempTopRight: pipe(
    mPipe(call("tempTopRightRadius"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  topRightUnit: pipe(
    mPipe(call("topRightRadiusSuffix"), Str.read, Unit.fromString),
    onNullish<Unit.Unit>("px")
  ),
  tempTopRightUnit: pipe(
    mPipe(call("tempTopRightRadiusSuffix"), Str.read, Unit.fromString),
    onNullish<Unit.Unit>("px")
  ),
  bottomRight: pipe(
    mPipe(call("bottomRightRadius"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  tempBottomRight: pipe(
    mPipe(call("tempBottomRight"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  bottomRightUnit: pipe(
    mPipe(call("bottomRightRadiusSuffix"), Str.read, Unit.fromString),
    onNullish<Unit.Unit>("px")
  ),
  tempBottomRightUnit: pipe(
    mPipe(call("tempBottomRightRadiusSuffix"), Str.read, Unit.fromString),
    onNullish<Unit.Unit>("px")
  ),
  bottomLeft: pipe(
    mPipe(call("bottomLeftRadius"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  tempBottomLeft: pipe(
    mPipe(call("tempBottomLeftRadius"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  bottomLeftUnit: pipe(
    mPipe(call("bottomLeftRadiusSuffix"), Str.read, Unit.fromString),
    onNullish<Unit.Unit>("px")
  ),
  tempBottomLeftUnit: pipe(
    mPipe(call("tempBottomLeftRadiusSuffix"), Str.read, Unit.fromString),
    onNullish<Unit.Unit>("px")
  )
});

export const toElementModel: ToElementModel<Value> = v => {
  return {
    radiusType: v.type,
    radius: v.value,
    radiusSuffix: v.unit,
    topLeftRadius: v.topLeft,
    tempTopLeftRadius: v.tempTopLeft,
    topLeftRadiusSuffix: v.topLeftUnit,
    tempTopLeftRadiusSuffix: v.tempTopLeftUnit,
    topRightRadius: v.topRight,
    tempTopRightRadius: v.tempTopRight,
    topRightRadiusSuffix: v.topRightUnit,
    tempTopRightRadiusSuffix: v.tempTopRightUnit,
    bottomRightRadius: v.bottomRight,
    tempBottomRightRadius: v.tempBottomRight,
    bottomRightRadiusSuffix: v.bottomRightUnit,
    tempBottomRightRadiusSuffix: v.tempBottomRightUnit,
    bottomLeftRadius: v.bottomLeft,
    tempBottomLeftRadius: v.tempBottomLeft,
    bottomLeftRadiusSuffix: v.bottomLeftUnit,
    tempBottomLeftRadiusSuffix: v.tempBottomLeftUnit
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

export const getIcon: SP<Unit.Unit, Edge>["getIcon"] = e => {
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

export const unitSetter = (e: Edge): Setter<Unit.Unit, Value> => {
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

export const unitTitle = (unit: Unit.Unit): string => {
  switch (unit) {
    case "%":
    case "px":
      return unit;
  }
};
