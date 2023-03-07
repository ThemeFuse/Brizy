import {
  callGetter,
  FromElementModel,
  FromElementModelGetter,
  ToElementModel
} from "visual/component/Options/Type";
import { Value } from "visual/component/Options/types/dev/Corners/types/Value";
import { parseStrict } from "visual/utils/reader/readWithParser";
import { mPipe, pipe } from "visual/utils/fp";
import * as Str from "visual/utils/string/specs";
import * as Type from "visual/component/Options/utils/Type";
import { onNullish } from "visual/utils/value";
import * as Num from "visual/utils/math/number";
import * as Positive from "visual/utils/math/Positive";
import * as Unit from "visual/component/Options/types/dev/Corners/types/Unit";

export const fromElementModel: FromElementModel<"corners-dev"> = parseStrict<
  FromElementModelGetter,
  Value
>({
  type: pipe(
    mPipe(callGetter("radiusType"), Str.read, Type.fromString),
    onNullish<Type.Type>("grouped")
  ),
  value: pipe(
    mPipe(callGetter("radius"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  unit: pipe(
    mPipe(callGetter("radiusSuffix"), Str.read, Unit.fromString),
    onNullish<Unit.Unit>("px")
  ),
  topLeft: pipe(
    mPipe(callGetter("topLeftRadius"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  tempTopLeft: pipe(
    mPipe(callGetter("tempTopLeft"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  topLeftUnit: pipe(
    mPipe(callGetter("topLeftRadiusSuffix"), Str.read, Unit.fromString),
    onNullish<Unit.Unit>("px")
  ),
  tempTopLeftUnit: pipe(
    mPipe(callGetter("tempTopLeftRadiusSuffix"), Str.read, Unit.fromString),
    onNullish<Unit.Unit>("px")
  ),
  topRight: pipe(
    mPipe(callGetter("topRightRadius"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  tempTopRight: pipe(
    mPipe(callGetter("tempTopRightRadius"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  topRightUnit: pipe(
    mPipe(callGetter("topRightRadiusSuffix"), Str.read, Unit.fromString),
    onNullish<Unit.Unit>("px")
  ),
  tempTopRightUnit: pipe(
    mPipe(callGetter("tempTopRightRadiusSuffix"), Str.read, Unit.fromString),
    onNullish<Unit.Unit>("px")
  ),
  bottomRight: pipe(
    mPipe(callGetter("bottomRightRadius"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  tempBottomRight: pipe(
    mPipe(callGetter("tempBottomRight"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  bottomRightUnit: pipe(
    mPipe(callGetter("bottomRightRadiusSuffix"), Str.read, Unit.fromString),
    onNullish<Unit.Unit>("px")
  ),
  tempBottomRightUnit: pipe(
    mPipe(callGetter("tempBottomRightRadiusSuffix"), Str.read, Unit.fromString),
    onNullish<Unit.Unit>("px")
  ),
  bottomLeft: pipe(
    mPipe(callGetter("bottomLeftRadius"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  tempBottomLeft: pipe(
    mPipe(callGetter("tempBottomLeftRadius"), Num.read, Positive.fromNumber),
    onNullish(Positive.Zero)
  ),
  bottomLeftUnit: pipe(
    mPipe(callGetter("bottomLeftRadiusSuffix"), Str.read, Unit.fromString),
    onNullish<Unit.Unit>("px")
  ),
  tempBottomLeftUnit: pipe(
    mPipe(callGetter("tempBottomLeftRadiusSuffix"), Str.read, Unit.fromString),
    onNullish<Unit.Unit>("px")
  )
});

export const toElementModel: ToElementModel<"corners-dev"> = v => {
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
