import { OptionValue } from "visual/component/Options/types";
import {
  Black as blackHex,
  fromString as readHex
} from "visual/utils/color/Hex";
import {
  empty as emptyOpacity,
  fromNumber as readOpacity
} from "visual/utils/cssProps/opacity";
import { config } from "../../../../../../jest-utils/mocks";
import { css as cssStyleBackgroundColor } from "../css";

describe("Testing cssStyleBackgroundColor that should return CSS for background color or gradient", () => {
  const opacity = readOpacity(1) ?? emptyOpacity;

  const value: OptionValue<"backgroundColor"> = {
    hex: readHex("#FF0000") ?? blackHex,
    opacity,
    palette: "",
    gradientHex: "#000000",
    gradientOpacity: opacity,
    gradientPalette: "",
    start: 0,
    end: 100,
    linearDegree: 90,
    radialDegree: 90,
    type: "solid",
    gradientType: "linear",
    active: "start",
    tempType: "solid",
    tempOpacity: opacity,
    tempPalette: "",
    tempGradientOpacity: opacity,
    tempGradientPalette: ""
  };

  test("Background transparent", () => {
    expect(
      cssStyleBackgroundColor({ meta: { isDisabled: true }, value, config })
    ).toBe("background-color: transparent;");
  });

  test("Solid color", () => {
    expect(
      cssStyleBackgroundColor({ meta: { isSolid: true }, value, config })
    ).toBe("background-color:rgba(255, 0, 0, 1); background-image:none;");
  });

  test("Gradient color", () => {
    expect(
      cssStyleBackgroundColor({
        meta: { isGradient: true, isLinearGradient: true },
        value,
        config
      })
    ).toBe(
      "background-image: linear-gradient(90deg, rgba(255, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 100%);"
    );

    expect(
      cssStyleBackgroundColor({
        meta: { isGradient: true, isRadialGradient: true },
        value,
        config
      })
    ).toBe(
      "background-image: radial-gradient(circle 90px, rgba(255, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 100%);"
    );
  });

  test("Is gradient, but not specified linear or radial", () => {
    expect(
      cssStyleBackgroundColor({
        meta: { isGradient: true },
        value,
        config
      })
    ).toBe("");
  });

  test("Without meta", () => {
    expect(
      cssStyleBackgroundColor({
        meta: {},
        value,
        config
      })
    ).toBe("");
  });

  test("Solid and gradient, should return solid", () => {
    expect(
      cssStyleBackgroundColor({
        meta: { isSolid: true, isGradient: true, isRadialGradient: true },
        value,
        config
      })
    ).toBe("background-color:rgba(255, 0, 0, 1); background-image:none;");
  });
});
