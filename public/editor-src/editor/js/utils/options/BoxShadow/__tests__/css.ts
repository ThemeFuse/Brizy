import { OptionValue } from "visual/component/Options/types";
import {
  Black as blackHex,
  fromString as readHex
} from "visual/utils/color/Hex";
import {
  empty as emptyBlur,
  fromNumber as readBlur
} from "visual/utils/cssProps/Blur";
import {
  empty as emptyOpacity,
  fromNumber as readOpacity
} from "visual/utils/cssProps/opacity";
import { config } from "../../../../../../jest-utils/mocks";
import { css as cssStyleBoxShadow } from "../css";

describe("Testing cssStyleBoxShadow that should return CSS for box-shadow", () => {
  const hex = readHex("#FF0000") ?? blackHex;
  const opacity = readOpacity(1) ?? emptyOpacity;
  const blur = readBlur(2) ?? emptyBlur;

  const value: OptionValue<"boxShadow"> = {
    palette: "",
    hex,
    opacity,
    blur,
    spread: 3,
    horizontal: 4,
    vertical: 5,
    type: "outset",
    tempType: "outset",
    tempOpacity: opacity,
    tempPalette: "",
    tempBlur: blur,
    tempSpread: 3,
    tempHorizontal: 4,
    tempVertical: 5
  };

  test("Empty, should return box-shadow: none;", () => {
    expect(cssStyleBoxShadow({ meta: { isEmpty: true }, value, config })).toBe(
      "box-shadow: none;"
    );
  });

  test("Disabled, should return box-shadow: none;", () => {
    expect(
      cssStyleBoxShadow({ meta: { isDisabled: true }, value, config })
    ).toBe("box-shadow: none;");
  });

  test("Inset, should return inset box-shadow", () => {
    expect(cssStyleBoxShadow({ meta: { isInset: true }, value, config })).toBe(
      "box-shadow:inset 4px 5px 2px 3px rgba(255, 0, 0, 1);"
    );
  });

  test("Without meta, should return Outset box-shadow", () => {
    expect(cssStyleBoxShadow({ value, config })).toBe(
      "box-shadow: 4px 5px 2px 3px rgba(255, 0, 0, 1);"
    );
  });
});
