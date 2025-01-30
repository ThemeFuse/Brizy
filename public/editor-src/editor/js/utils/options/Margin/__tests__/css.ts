import { OptionValue } from "visual/component/Options/types";
import {
  Zero as emptyPositive,
  fromNumber as readPositive
} from "visual/utils/math/Positive";
import { config } from "../../../../../../jest-utils/mocks";
import { css as cssStyleMargin } from "../css";

describe("Testing cssStyleMargin that should return CSS for margin", () => {
  const v = readPositive(1) ?? emptyPositive;

  const value: OptionValue<"margin"> = {
    type: "grouped",
    value: v,
    unit: "px",
    top: v,
    topUnit: "px",
    right: v,
    rightUnit: "px",
    bottom: v,
    bottomUnit: "px",
    left: v,
    leftUnit: "px",
    tempTop: v,
    tempTopUnit: "px",
    tempRight: v,
    tempRightUnit: "px",
    tempBottom: v,
    tempBottomUnit: "px",
    tempLeft: v,
    tempLeftUnit: "px",
    tempValue: v,
    tempUnit: "px"
  };

  test("Without meta, should return empty string", () => {
    expect(cssStyleMargin({ value, config })).toBe("margin:0;");
  });

  test("Grouped, should return grouped margin", () => {
    expect(
      cssStyleMargin({ meta: { isNoEmptyGrouped: true }, value, config })
    ).toBe("margin:1px;");
  });

  test("Ungrouped, should return ungrouped margin", () => {
    expect(
      cssStyleMargin({ meta: { isNoEmptyUngrouped: true }, value, config })
    ).toBe("margin:1px 1px 1px 1px;");
  });

  test("Grouped and ungrouped, should return grouped margin", () => {
    expect(
      cssStyleMargin({
        meta: { isNoEmptyGrouped: true, isNoEmptyUngrouped: true },
        value,
        config
      })
    ).toBe("margin:1px;");
  });
});
