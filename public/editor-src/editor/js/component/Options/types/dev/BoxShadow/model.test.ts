import { times, identity } from "underscore";
import {
  getBlur,
  getHex,
  getHorizontal,
  getOpacity,
  getPalette,
  getSpread,
  getVertical
} from "./model";
import { palettes } from "visual/utils/color/Palette";
import * as Opacity from "visual/utils/cssProps/opacity";
import * as Blur from "visual/utils/cssProps/Blur";
import * as Spread from "visual/utils/cssProps/Spread";
import { Value } from "./entities/Value";
import * as Hex from "visual/utils/color/Hex";

const model: Value = {
  type: "inset",
  tempType: "outset",
  hex: Hex.Black,
  opacity: Opacity.unsafe(1),
  tempOpacity: Opacity.unsafe(1),
  blur: Blur.unsafe(0.3),
  tempBlur: Blur.unsafe(0.3),
  spread: Spread.unsafe(0.3),
  tempSpread: Spread.unsafe(0.3),
  palette: "color1",
  tempPalette: "color2",
  vertical: 1,
  tempVertical: 2,
  horizontal: 3,
  tempHorizontal: 4
};

describe("Testing 'getOpacity' function", () => {
  const seed = times(11, i => i * 0.1).map(Opacity.unsafe);

  seed.forEach(opacity => {
    test(`Expect value to be ${opacity}`, () => {
      expect(getOpacity({ ...model, opacity })).toBe(opacity);
    });
  });
});

describe("Testing 'getPalette' function", () => {
  palettes.forEach(palette => {
    test(`Expect value to be ${palette}`, () => {
      expect(getPalette({ ...model, palette })).toBe(palette);
    });
  });
});

describe("Testing 'getHex' function", () => {
  const seed = ["#111", "#222", "#333"].map(Hex.unsafe);

  seed.forEach(hex => {
    test(`Expect value to be ${hex}`, () => {
      expect(getHex({ ...model, hex })).toBe(hex);
    });
  });
});

describe("Testing 'getBlur' function", () => {
  const seed = times(11, identity).map(Blur.unsafe);

  seed.forEach(blur => {
    test(`Expect value to be ${blur}`, () => {
      expect(getBlur({ ...model, blur })).toBe(blur);
    });
  });
});

describe("Testing 'getSpread' function", () => {
  const seed = times(11, identity).map(Spread.unsafe);

  seed.forEach(spread => {
    test(`Expect value to be ${spread}`, () => {
      expect(getSpread({ ...model, spread })).toBe(spread);
    });
  });
});

describe("Testing 'getVertical' function", () => {
  const seed = times(11, identity);

  seed.forEach(vertical => {
    test(`Expect value to be ${vertical}`, () => {
      expect(getVertical({ ...model, vertical })).toBe(vertical);
    });
  });
});

describe("Testing 'getHorizontal' function", () => {
  const seed = times(11, identity);

  seed.forEach(horizontal => {
    test(`Expect value to be ${horizontal}`, () => {
      expect(getHorizontal({ ...model, horizontal })).toBe(horizontal);
    });
  });
});
