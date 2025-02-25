import { OptionValue } from "visual/component/Options/types";
import {
  Zero as emptyPositive,
  fromNumber as readPositive
} from "visual/utils/math/Positive";
import { config } from "../../../../../../jest-utils/mocks";
import { css as cssStylePadding } from "../css";

describe("Testing cssStylePadding that should return CSS for padding", () => {
  const v = readPositive(1) ?? emptyPositive;

  const value: OptionValue<"padding"> = {
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
    expect(cssStylePadding({ value, config })).toBe("padding:1px 1px 1px 1px;");
  });

  test("Grouped, should return grouped padding", () => {
    expect(
      cssStylePadding({ meta: { isNoEmptyGrouped: true }, value, config })
    ).toBe("padding:1px;");
  });

  test("Grouped, should return grouped padding", () => {
    expect(
      cssStylePadding({
        meta: { isNoEmptyGrouped: true },
        value,
        config
      })
    ).toBe("padding:1px;");
  });
});
