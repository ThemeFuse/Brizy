import { isT } from "fp-utilities";
import { Value as TransformValue } from "visual/component/Controls/Transform/types/Value";
import { createOptionId } from "visual/editorComponents/EditorComponent/utils";
import { Transform } from "visual/utils/cssProps/transform";
import { read } from "visual/utils/cssProps/transform/Rotate";
import { defaultValueValue } from "visual/utils/onChange";
import { fromElementModel as transformFromElementModel } from "visual/utils/options/Transform/converters";
import { getTransformCSSVars } from "visual/utils/options/Transform/utils";
import { Literal } from "visual/utils/types/Literal";
import { mApply, MValue } from "visual/utils/value";
import { CSSValue } from "../style2/types";

export const buildTransform = (v: Transform): string => {
  return (
    Object.entries(v).reduce(
      (acc, [k, v]) => acc + `${k}(${v})`,
      "transform: "
    ) + ";"
  );
};

export const getTransformOrigin = (model: Partial<TransformValue>): string => {
  const { rotate, scale, flip, anchorPoint } = model;

  return (rotate || scale || flip) && anchorPoint
    ? "transform-origin: var(--transform-anchor-pointY) var(--transform-anchor-pointX);"
    : "";
};

export const getTransformProperties = (
  model: Partial<TransformValue>
): string[] => {
  const { rotate, offset, flip, scale, skew } = model;

  const _scaleX =
    scale?.scalePreserveSize && scale.scaleXY
      ? "var(--transform-scaleXY)"
      : scale?.scaleX
      ? "var(--transform-scaleX)"
      : "1";
  const _scaleY =
    scale?.scalePreserveSize && scale.scaleXY
      ? "var(--transform-scaleXY)"
      : scale?.scaleY
      ? "var(--transform-scaleY)"
      : "1";

  return [
    rotate?.rotate ? " rotateZ(var(--transform-rotateZ))" : undefined,
    rotate?.rotate3D && rotate.rotatePerspective
      ? " perspective(var(--transform-rotatePerspective))"
      : undefined,
    rotate?.rotate3D && rotate.rotateX
      ? " rotateX(var(--transform-rotateX))"
      : undefined,
    rotate?.rotate3D && rotate.rotateY
      ? " rotateY(var(--transform-rotateY))"
      : undefined,

    offset?.offsetX ? " translateX(var(--transform-offsetX))" : undefined,
    offset?.offsetY ? " translateY(var(--transform-offsetY))" : undefined,

    skew?.skewX ? " skewX(var(--transform-skewX))" : undefined,
    skew?.skewY ? " skewY(var(--transform-skewY))" : undefined,

    (flip || scale) &&
      ` scaleX(calc(var(--transform-flipHorizontal) * ${_scaleX}))`,
    (flip || scale) &&
      ` scaleY(calc(var(--transform-flipVertical) * ${_scaleY}))`
  ].filter(isT);
};

const getTransformCSS = (model: Partial<TransformValue>): string => {
  const cssProperties = getTransformProperties(model);

  if (!cssProperties.length) {
    return "transform: none;";
  }

  const transformCSSVars = getTransformCSSVars(model);
  const transform = `transform: ${cssProperties.join("")};`;
  const transformOrigin = getTransformOrigin(model);

  return `
  ${transformCSSVars}
  ${transform}
  ${transformOrigin}
  `;
};

export const cssStyleRotate = (d: CSSValue): string => {
  const value = read(defaultValueValue({ key: "rotate", ...d }));
  return mApply((v) => buildTransform({ rotate: `${v}deg` }), value) ?? "";
};

export function cssStyleTransform({ v, device, state }: CSSValue): string {
  const get = (k: string): MValue<Literal> =>
    defaultValueValue({
      v,
      key: createOptionId("transform", k),
      device: device,
      state: state
    });

  return getTransformCSS(transformFromElementModel(get));
}
