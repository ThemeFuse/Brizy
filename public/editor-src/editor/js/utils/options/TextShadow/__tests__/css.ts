import { OptionValue } from "visual/component/Options/types";
import { PaletteType } from "visual/types/Style";
import {
  Black as blackHex,
  fromString as readHex
} from "visual/utils/color/Hex";
import {
  COLOR3 as color3Palette,
  fromString as readPalette
} from "visual/utils/color/Palette";
import { config } from "../../../../../../jest-utils/mocks";
import { css as cssStyleTextShadow } from "../css";
import { NoEmptyBlur } from "../types/NoEmptyBlur";
import { NoEmptyOpacity } from "../types/NoEmptyOpacity";

describe("Testing cssStyleTextShadow that should return CSS for text-shadow", () => {
  const hex = readHex("#FF0000") ?? blackHex;
  const opacity = 1 as NoEmptyOpacity;
  const blur = 2 as NoEmptyBlur;
  const palette = readPalette("") ?? color3Palette;

  const value: OptionValue<"textShadow"> = {
    palette,
    hex,
    opacity,
    blur,
    horizontal: 4,
    vertical: 5
  };

  test("Empty, should return text-shadow: none;", () => {
    expect(cssStyleTextShadow({ meta: { isEmpty: true }, value, config })).toBe(
      "text-shadow: none;"
    );
  });

  test("Populated with palette, should return text-shadow based on palette", () => {
    expect(
      cssStyleTextShadow({ meta: { isEmpty: false }, value, config })
    ).toBe("text-shadow:4px 5px 2px  rgba(var(--brz-global-color3),1);");
  });

  test("Populated with hex, should return text-shadow as rgba based on hex", () => {
    expect(
      cssStyleTextShadow({
        meta: { isEmpty: false },
        value: { ...value, palette: "" as PaletteType },
        config
      })
    ).toBe("text-shadow:4px 5px 2px  rgba(255, 0, 0, 1);");
  });

  test("Without meta, should return text-shadow based on palette", () => {
    expect(
      cssStyleTextShadow({
        meta: { isEmpty: false },
        value,
        config
      })
    ).toBe("text-shadow:4px 5px 2px  rgba(var(--brz-global-color3),1);");
  });

  test("Without palette(undefined)", () => {
    expect(
      cssStyleTextShadow({
        meta: { isEmpty: false },
        value: {
          ...value,
          palette: undefined
        },
        config
      })
    ).toBe("text-shadow:4px 5px 2px  rgba(255, 0, 0, 1);");
  });
});
