import { AnchorPoint } from "visual/component/Controls/Transform/types/AnchorPoint";
import { Flip } from "visual/component/Controls/Transform/types/Flip";
import { Offset } from "visual/component/Controls/Transform/types/Offset";
import { Rotate } from "visual/component/Controls/Transform/types/Rotate";
import { Scale } from "visual/component/Controls/Transform/types/Scale";
import { Skew } from "visual/component/Controls/Transform/types/Skew";
import { Value } from "visual/component/Controls/Transform/types/Value";
import { FromElementModelGetter } from "visual/component/Options/Type";
import { capByPrefix } from "visual/utils/string";
import { MValue } from "visual/utils/value";

export const wrap =
  (prefix: string) =>
  (f: FromElementModelGetter): FromElementModelGetter =>
  (s): ReturnType<FromElementModelGetter> =>
    f(capByPrefix(prefix, s));

export const isEnabled = (get: FromElementModelGetter): boolean =>
  !!get("enabled");

export const makeCSSVar = ({
  prop,
  deps,
  value,
  suffix
}: {
  prop: string;
  value: MValue<unknown>;
  suffix?: string;
  deps?: unknown[];
}): string => {
  if (!value) {
    return "";
  }

  if (deps) {
    if (!Array.isArray(deps) || !deps?.every(Boolean)) {
      return "";
    }
  }

  return `${prop}:${value}${suffix ?? ""};`;
};

export const getRotateVars = ({
  rotate,
  rotateX,
  rotate3D,
  rotateY,
  rotatePerspective
}: Rotate): string => {
  const rZ = makeCSSVar({
    prop: "--transform-rotateZ",
    value: rotate,
    suffix: "deg"
  });
  const rX = makeCSSVar({
    prop: "--transform-rotateX",
    value: rotateX,
    suffix: "deg",
    deps: [rotate3D]
  });
  const rY = makeCSSVar({
    prop: "--transform-rotateY",
    value: rotateY,
    suffix: "deg",
    deps: [rotate3D]
  });
  const perspective = makeCSSVar({
    prop: "--transform-rotatePerspective",
    value: rotatePerspective,
    suffix: "px",
    deps: [rotate3D]
  });

  return rZ.concat(rX, rY, perspective);
};

export const getOffsetVars = ({ offsetX, offsetY }: Offset): string => {
  const oX = makeCSSVar({
    prop: "--transform-offsetX",
    value: offsetX,
    suffix: "px"
  });
  const oY = makeCSSVar({
    prop: "--transform-offsetY",
    value: offsetY,
    suffix: "px"
  });

  return oX.concat(oY);
};

export const getSkewVars = ({ skewX, skewY }: Skew): string => {
  const sX = makeCSSVar({
    prop: "--transform-skewX",
    value: skewX,
    suffix: "deg"
  });
  const sY = makeCSSVar({
    prop: "--transform-skewY",
    value: skewY,
    suffix: "deg"
  });

  return sX.concat(sY);
};

export const getScaleVars = ({
  scaleX,
  scaleY,
  scaleXY,
  scalePreserveSize
}: Scale): string => {
  const sX = makeCSSVar({ prop: "--transform-scaleX", value: scaleX * 10 });
  const sY = makeCSSVar({ prop: "--transform-scaleY", value: scaleY * 10 });
  const sXY = scalePreserveSize
    ? makeCSSVar({ prop: "--transform-scaleXY", value: scaleXY * 10 })
    : "";

  return sX.concat(sY, sXY);
};

export const getFlipVars = (data: MValue<Flip>): string => {
  const { flipHorizontal, flipVertical } = data ?? {};
  const flipX = flipHorizontal ? -1 : 1;
  const flipY = flipVertical ? -1 : 1;

  const fX = makeCSSVar({ prop: "--transform-flipHorizontal", value: flipX });
  const fY = makeCSSVar({ prop: "--transform-flipVertical", value: flipY });

  return fX.concat(fY);
};

export const getAnchorVars = (anchorPoint: AnchorPoint): string => {
  const aX = makeCSSVar({
    prop: "--transform-anchor-pointX",
    value: anchorPoint?.x
  });
  const aY = makeCSSVar({
    prop: "--transform-anchor-pointY",
    value: anchorPoint?.y
  });

  return aX.concat(aY);
};

export const getTransformCSSVars = (model: Partial<Value>): string => {
  const { rotate, offset, skew, scale, flip, anchorPoint } = model ?? {};

  const rotateVars = rotate ? getRotateVars(rotate) : "";
  const offsetVars = offset ? getOffsetVars(offset) : "";
  const skewVars = skew ? getSkewVars(skew) : "";
  const scaleVars = scale ? getScaleVars(scale) : "";
  const flipVars = getFlipVars(flip);
  const anchorVars =
    (rotate || scale || flip) && anchorPoint ? getAnchorVars(anchorPoint) : "";

  return rotateVars.concat(
    offsetVars,
    skewVars,
    scaleVars,
    flipVars,
    anchorVars
  );
};
