import { parseStrict } from "fp-utilities";
import {
  FromElementModel,
  FromElementModelGetter,
  ToElementModel
} from "visual/component/Options/Type";
import { mPipe, pipe } from "visual/utils/fp";
import * as Positive from "visual/utils/math/Positive";
import * as Num from "visual/utils/math/number";
import * as Str from "visual/utils/string/specs";
import { onNullish } from "visual/utils/value";
import * as Type from "../utils/Type";
import { callGetter } from "../utils/wrap";
import * as Unit from "./types/Unit";
import { Value } from "./types/Value";

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

export const fromElementModel: FromElementModel<"corners"> = parseStrict<
  FromElementModelGetter,
  Value
>({
  type: pipe(
    mPipe(callGetter("radiusType"), Str.read, Type.fromString),
    onNullish<Type.Type>(defaultValue.type)
  ),
  value: pipe(
    mPipe(callGetter("radius"), Num.read, Positive.fromNumber),
    onNullish(defaultValue.value)
  ),
  unit: pipe(
    mPipe(callGetter("radiusSuffix"), Str.read, Unit.fromString),
    onNullish<Unit.Unit>(defaultValue.unit)
  ),
  topLeft: pipe(
    mPipe(callGetter("topLeftRadius"), Num.read, Positive.fromNumber),
    onNullish(defaultValue.topLeft)
  ),
  tempTopLeft: pipe(
    mPipe(callGetter("tempTopLeft"), Num.read, Positive.fromNumber),
    onNullish(defaultValue.tempTopLeft)
  ),
  topLeftUnit: pipe(
    mPipe(callGetter("topLeftRadiusSuffix"), Str.read, Unit.fromString),
    onNullish<Unit.Unit>(defaultValue.topLeftUnit)
  ),
  tempTopLeftUnit: pipe(
    mPipe(callGetter("tempTopLeftRadiusSuffix"), Str.read, Unit.fromString),
    onNullish<Unit.Unit>(defaultValue.tempTopLeftUnit)
  ),
  topRight: pipe(
    mPipe(callGetter("topRightRadius"), Num.read, Positive.fromNumber),
    onNullish(defaultValue.topRight)
  ),
  tempTopRight: pipe(
    mPipe(callGetter("tempTopRightRadius"), Num.read, Positive.fromNumber),
    onNullish(defaultValue.tempTopRight)
  ),
  topRightUnit: pipe(
    mPipe(callGetter("topRightRadiusSuffix"), Str.read, Unit.fromString),
    onNullish<Unit.Unit>(defaultValue.topRightUnit)
  ),
  tempTopRightUnit: pipe(
    mPipe(callGetter("tempTopRightRadiusSuffix"), Str.read, Unit.fromString),
    onNullish<Unit.Unit>(defaultValue.tempTopRightUnit)
  ),
  bottomRight: pipe(
    mPipe(callGetter("bottomRightRadius"), Num.read, Positive.fromNumber),
    onNullish(defaultValue.bottomRight)
  ),
  tempBottomRight: pipe(
    mPipe(callGetter("tempBottomRight"), Num.read, Positive.fromNumber),
    onNullish(defaultValue.tempBottomRight)
  ),
  bottomRightUnit: pipe(
    mPipe(callGetter("bottomRightRadiusSuffix"), Str.read, Unit.fromString),
    onNullish<Unit.Unit>(defaultValue.bottomRightUnit)
  ),
  tempBottomRightUnit: pipe(
    mPipe(callGetter("tempBottomRightRadiusSuffix"), Str.read, Unit.fromString),
    onNullish<Unit.Unit>(defaultValue.tempBottomRightUnit)
  ),
  bottomLeft: pipe(
    mPipe(callGetter("bottomLeftRadius"), Num.read, Positive.fromNumber),
    onNullish(defaultValue.bottomLeft)
  ),
  tempBottomLeft: pipe(
    mPipe(callGetter("tempBottomLeftRadius"), Num.read, Positive.fromNumber),
    onNullish(defaultValue.tempBottomLeft)
  ),
  bottomLeftUnit: pipe(
    mPipe(callGetter("bottomLeftRadiusSuffix"), Str.read, Unit.fromString),
    onNullish<Unit.Unit>(defaultValue.bottomLeftUnit)
  ),
  tempBottomLeftUnit: pipe(
    mPipe(callGetter("tempBottomLeftRadiusSuffix"), Str.read, Unit.fromString),
    onNullish<Unit.Unit>(defaultValue.tempBottomLeftUnit)
  )
});

export const toElementModel: ToElementModel<"corners"> = (v) => {
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
