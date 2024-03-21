import { ToMeta } from "visual/component/Options/Type";
import type { Value } from "visual/component/Options/types/dev/Filters/types/Value";
import { MAX as sliderMaxValue } from "./utils";

export interface Meta {
  isHalfBrightness: boolean;
  isEmptyHue: boolean;
  isHalfSaturation: boolean;
  isHalfContrast: boolean;
}

const halfSliderValue = sliderMaxValue / 2;

const isEmptyHue = (m: Value): boolean => m.hue === 0;

const isHalfBrightness = (m: Value): boolean =>
  m.brightness === halfSliderValue;

const isHalfSaturation = (m: Value): boolean =>
  m.saturation === halfSliderValue;

const isHalfContrast = (m: Value): boolean => m.contrast === halfSliderValue;

export const toMeta: ToMeta<"filters"> = (m) => ({
  isHalfBrightness: isHalfBrightness(m),
  isEmptyHue: isEmptyHue(m),
  isHalfSaturation: isHalfSaturation(m),
  isHalfContrast: isHalfContrast(m)
});
