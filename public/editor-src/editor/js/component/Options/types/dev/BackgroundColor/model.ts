import { Getter, setter, Setter } from "visual/utils/model";
import { Value } from "./entities/Value";
import { mCompose } from "visual/utils/value";
import * as Color from "visual/component/Options/types/dev/ColorPicker/model";
import { colorToGradient, gradientToColor, readPercent } from "./utils";
import * as Type from "./entities/Type";
import { GradientType } from "visual/component/Options/types/dev/BackgroundColor/entities/GradientType";
import { GradientActivePointer } from "visual/component/Options/types/dev/BackgroundColor/entities/GradientActivePointer";
import * as Palette from "visual/component/Options/types/dev/ColorPicker/entities/palette";
import { toggleColor } from "visual/component/Options/types/dev/ColorPicker/utils";

export const toggleType = (enable: boolean, m: Value): Value => {
  const type = enable ? Type.append(m.type, m.tempType) : Type.empty;
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return setType(type, m);
};

export {
  getHex,
  getOpacity,
  getPalette
} from "visual/component/Options/types/dev/ColorPicker/model";

export const setHex: Setter<string, Value> = (v, m) =>
  toggleType(true, { ...m, ...Color.setHex(v, m) });

export const setOpacity: Setter<number, Value> = (v, m) =>
  toggleType(v > 0, { ...m, ...Color.setOpacity(v, m) });

export const setPalette: Setter<Palette.Palette, Value> = (v, m) =>
  toggleType(v !== Palette.empty, { ...m, ...Color.setPalette(v, m) });

export const getHex2: Getter<string, Value> = mCompose(
  Color.getHex,
  gradientToColor
);

export const setHex2: Setter<string, Value> = (v, m) =>
  toggleType(true, {
    ...m,
    ...colorToGradient(Color.setHex(v, gradientToColor(m)))
  });

export const getOpacity2: Getter<number, Value> = mCompose(
  Color.getOpacity,
  gradientToColor
);

export const setOpacity2: Setter<number, Value> = (v, m) =>
  toggleType(v > 0, {
    ...m,
    ...colorToGradient(Color.setOpacity(v, gradientToColor(m)))
  });

export const getPalette2: Getter<Value["palette2"], Value> = mCompose(
  Color.getPalette,
  gradientToColor
);

export const setPalette2: Setter<Value["palette2"], Value> = (v, m) =>
  toggleType(v !== Palette.empty, {
    ...m,
    ...colorToGradient(Color.setPalette(v, gradientToColor(m)))
  });

export const getType: Getter<Type.Type, Value> = m => m.type;

export const setType: Setter<Type.Type, Value> = (type, m) => ({
  ...m,
  ...toggleColor(type !== Type.empty, m),
  type,
  tempType: Type.append(type, m.tempType)
});

export const getGradientType: Getter<GradientType, Value> = m => m.gradientType;

export const setGradientType: Setter<GradientType, Value> = (v, m) => ({
  ...m,
  gradientType: v
});

export const getStart: Getter<number, Value> = m => m.start;

export const setStart = setter(readPercent, getStart, (v, m) => ({
  ...m,
  start: v
}));

export const getEnd: Getter<number, Value> = m => m.end;

export const setEnd = setter(readPercent, getStart, (end, m) => ({
  ...m,
  end
}));

export const getActive: Getter<GradientActivePointer, Value> = m => m.active;

export const setActive: Setter<GradientActivePointer, Value> = (v, m) => ({
  ...m,
  active: v
});

export const getLinearDegree: Getter<number, Value> = m => m.linearDegree;

export const setLinearDegree: Setter<number, Value> = (linearDegree, m) => ({
  ...m,
  linearDegree
});

export const getRadialDegree: Getter<number, Value> = m => m.radialDegree;

export const setRadialDegree: Setter<number, Value> = (radialDegree, m) => ({
  ...m,
  radialDegree
});
