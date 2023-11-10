import { GradientActivePointer } from "visual/component/Options/types/dev/BackgroundColor/entities/GradientActivePointer";
import { GradientType } from "visual/component/Options/types/dev/BackgroundColor/entities/GradientType";
import * as Palette from "visual/component/Options/types/dev/ColorPicker/entities/palette";
import * as Color from "visual/component/Options/types/dev/ColorPicker/model";
import { toggleColor } from "visual/component/Options/types/dev/ColorPicker/utils";
import { Hex } from "visual/utils/color/Hex";
import { Opacity } from "visual/utils/cssProps/opacity";
import { Getter, Setter, setter } from "visual/utils/model";
import { mCompose } from "visual/utils/value";
import * as Type from "./entities/Type";
import { Value } from "./entities/Value";
import { colorToGradient, gradientToColor, readPercent } from "./utils";

export const getType: Getter<Type.Type, Value> = (m) => m.type;

export const setType: Setter<Type.Type, Value> = (type, m) => ({
  ...m,
  ...toggleColor(type !== Type.empty, m),
  type,
  tempType: Type.append(type, m.tempType)
});

export const toggleType = (enable: boolean, m: Value): Value => {
  const { type: _currentType, opacity, gradientOpacity, tempType } = m;

  const type = enable ? Type.append(_currentType, tempType) : Type.empty;
  const gradientType = _currentType === "gradient";

  if (
    (enable || (!enable && gradientType)) &&
    opacity === 0 &&
    gradientOpacity === 0
  ) {
    return { ...m, type: "none", tempType: "none" };
  }

  if (
    gradientType &&
    ((opacity === 0 && gradientOpacity > 0) ||
      (opacity > 0 && gradientOpacity === 0))
  ) {
    return { ...m, type: "gradient", tempType: "gradient" };
  }

  return setType(type, m);
};

export {
  getHex,
  getOpacity,
  getPalette
} from "visual/component/Options/types/dev/ColorPicker/model";

export const setHex: Setter<Hex, Value> = (v, m) =>
  toggleType(true, { ...m, ...Color.setHex(v, m) });

export const setOpacity: Setter<Opacity, Value> = (v, m) =>
  toggleType(v > 0, { ...m, ...Color.setOpacity(v, m) });

export const setPalette: Setter<Palette.Palette, Value> = (v, m) =>
  toggleType(v !== Palette.empty, { ...m, ...Color.setPalette(v, m) });

export const getGradientHex: Getter<string, Value> = mCompose(
  Color.getHex,
  gradientToColor
);

export const setGradientHex: Setter<Hex, Value> = (v, m) =>
  toggleType(true, {
    ...m,
    ...colorToGradient(Color.setHex(v, gradientToColor(m)))
  });

export const getGradientOpacity: Getter<number, Value> = mCompose(
  Color.getOpacity,
  gradientToColor
);

export const setGradientOpacity: Setter<Opacity, Value> = (v, m) =>
  toggleType(v > 0, {
    ...m,
    ...colorToGradient(Color.setOpacity(v, gradientToColor(m)))
  });

export const getGradientPalette: Getter<Value["gradientPalette"], Value> =
  mCompose(Color.getPalette, gradientToColor);

export const setGradientPalette: Setter<Value["gradientPalette"], Value> = (
  v,
  m
) =>
  toggleType(v !== Palette.empty, {
    ...m,
    ...colorToGradient(Color.setPalette(v, gradientToColor(m)))
  });

export const getGradientType: Getter<GradientType, Value> = (m) =>
  m.gradientType;

export const setGradientType: Setter<GradientType, Value> = (v, m) => ({
  ...m,
  gradientType: v
});

export const getStart: Getter<number, Value> = (m) => m.start;

export const setStart = setter(readPercent, getStart, (v, m) => ({
  ...m,
  start: v
}));

export const getEnd: Getter<number, Value> = (m) => m.end;

export const setEnd = setter(readPercent, getStart, (end, m) => ({
  ...m,
  end
}));

export const getActive: Getter<GradientActivePointer, Value> = (m) => m.active;

export const setActive: Setter<GradientActivePointer, Value> = (v, m) => ({
  ...m,
  active: v
});

export const getLinearDegree: Getter<number, Value> = (m) => m.linearDegree;

export const setLinearDegree: Setter<number, Value> = (linearDegree, m) => ({
  ...m,
  linearDegree
});

export const getRadialDegree: Getter<number, Value> = (m) => m.radialDegree;

export const setRadialDegree: Setter<number, Value> = (radialDegree, m) => ({
  ...m,
  radialDegree
});
