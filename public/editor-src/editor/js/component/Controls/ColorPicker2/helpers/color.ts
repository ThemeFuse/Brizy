import tinycolor from "tinycolor2";
import {
  HSLAChange,
  HSVAChange,
  isHSLAChange,
  isHSVAChange
} from "visual/component/Controls/ColorPicker2/types";

import HSVA = tinycolor.ColorFormats.HSVA;
import HSLA = tinycolor.ColorFormats.HSLA;
import RGBA = tinycolor.ColorFormats.RGBA;

type ToStateType = {
  hsl: HSLA;
  hsv: HSVA;
  hex: string;
  rgb: RGBA;
  oldHue: number;
  source: string;
};

export default {
  simpleCheckForValidColor<T>(data: T): T | false {
    const keysToCheck = ["r", "g", "b", "a", "h", "s", "l", "v"];
    let checked = 0;
    let passed = 0;
    for (const letter of keysToCheck) {
      if (data[letter as keyof T]) {
        checked += 1;

        if (!isNaN(data[letter as keyof T] as number)) {
          passed += 1;
        }
        if (letter === "s" || letter === "l") {
          const percentPatt = /^\d+%$/;

          if (percentPatt.test(data[letter as keyof T] as string) as boolean) {
            passed += 1;
          }
        }
      }
    }

    return checked === passed ? data : false;
  },

  toState(
    data: HSVAChange | HSLAChange | string,
    oldHue?: number,
    oldHsv?: HSVA
  ): ToStateType {
    const isHSVAorHSLA = isHSLAChange(data) || isHSVAChange(data);
    const color =
      isHSVAorHSLA && data.hex ? tinycolor(data.hex) : tinycolor(data);
    const hsl = color.toHsl();
    const hsv = color.toHsv();
    const rgb = color.toRgb();
    const hex = color.toHex();
    if (hsl.s === 0) {
      hsl.h = oldHue || 0;
      hsv.h = oldHue || 0;
    }

    // @ts-expect-error init hsv
    let newHsv: { hsv: HSVA } = {};
    if (isHSVAorHSLA && !data.hex && hsv.v !== 0) {
      newHsv = { hsv };
    }

    if (!oldHsv) {
      newHsv = { hsv };
    }

    if (isHSVAorHSLA && data.wasChanged === "saturation") {
      newHsv = {
        hsv: {
          h: hsv.h,
          s: hsv.s === 0 ? data.s / 100 : hsv.s,
          v: hsv.v,
          a: hsv.a
        }
      };
    }

    if (
      isHSVAorHSLA &&
      (data.wasChanged === "hue" || data.wasChanged === "opacity")
    ) {
      // @ts-expect-error if hue or opacity then empty
      newHsv = {};
    }

    return {
      hsl,
      hex: `#${hex}`,
      rgb,
      oldHue: isHSVAorHSLA ? data.h || oldHue || hsl.h : NaN,
      source: isHSVAorHSLA ? data.source : "",
      ...newHsv
    };
  },

  isValidHex(hex: string) {
    return tinycolor(hex).isValid();
  }
};

export const red = {
  hsl: { a: 1, h: 0, l: 0.5, s: 1 },
  hex: "#ff0000",
  rgb: { r: 255, g: 0, b: 0, a: 1 },
  hsv: { h: 0, s: 1, v: 1, a: 1 }
};
