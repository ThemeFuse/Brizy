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
import { css as cssStyleBorder } from "../css";
import {
  empty as emptyWidth,
  fromNumber as readWidth
} from "../entities/width";

describe("Testing cssStyleBorder that should return CSS for border", () => {
  const width = readWidth(5) ?? emptyWidth;
  const opacity = readOpacity(1) ?? emptyOpacity;

  const value: OptionValue<"border"> = {
    width,
    topWidth: width,
    rightWidth: width,
    bottomWidth: width,
    leftWidth: width,
    style: "solid",
    hex: readHex("#FF0000") ?? blackHex,
    opacity,
    palette: "",
    widthType: "grouped",
    tempWidth: width,
    tempTopWidth: width,
    tempRightWidth: width,
    tempBottomWidth: width,
    tempLeftWidth: width,
    tempStyle: "solid",
    tempOpacity: opacity,
    tempPalette: ""
  };

  test("Empty, should be empty string", () => {
    expect(cssStyleBorder({ meta: { isEmpty: true }, value, config })).toBe(
      "border: none;"
    );
  });

  test("Grouped width", () => {
    expect(
      cssStyleBorder({ meta: { isNoEmptyGrouped: true }, value, config })
    ).toBe("border:5px solid rgba(255, 0, 0, 1);");
  });

  test("Ungrouped width", () => {
    expect(
      cssStyleBorder({ meta: { isNoEmptyUngrouped: true }, value, config })
    ).toBe(
      "border-width:5px 5px 5px 5px;border-style:solid;border-color:rgba(255, 0, 0, 1);"
    );
  });

  test("Without neta", () => {
    expect(cssStyleBorder({ meta: {}, value, config })).toBe("");
  });
});
