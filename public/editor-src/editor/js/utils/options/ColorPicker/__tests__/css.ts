import { OptionValue } from "visual/component/Options/types";
import {
  Hex,
  Black as blackHex,
  fromString as readHex
} from "visual/utils/color/Hex";
import {
  empty as emptyOpacity,
  fromNumber as readOpacity
} from "visual/utils/cssProps/opacity";
import { config } from "../../../../../../jest-utils/mocks";
import { css as cssStyleColor } from "../css";

describe("Testing cssStyleColor that should return CSS for box-shadow", () => {
  const hex = readHex("#FF0000") ?? blackHex;
  const opacity = readOpacity(1) ?? emptyOpacity;

  const value: OptionValue<"colorPicker"> = {
    hex,
    opacity,
    palette: "",
    tempOpacity: opacity,
    tempPalette: ""
  };

  test("Without meta", () => {
    expect(cssStyleColor({ value, config })).toBe("color: rgba(255, 0, 0, 1);");
  });

  test("Opacity 0", () => {
    expect(
      cssStyleColor({
        value: {
          ...value,
          opacity: emptyOpacity
        },
        config
      })
    ).toBe("color: rgba(255, 0, 0, 0);");
  });

  test("Invalid HEX", () => {
    expect(
      cssStyleColor({
        value: {
          ...value,
          hex: "#123123``95943213" as Hex
        },
        config
      })
    ).toBe("");
  });

  test("With palette", () => {
    expect(
      cssStyleColor({
        value: {
          ...value,
          palette: "color3"
        },
        config
      })
    ).toBe("color: rgba(var(--brz-global-color3),1);");
  });
});
