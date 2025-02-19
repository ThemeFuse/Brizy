import { OptionValue } from "visual/component/Options/types";
import {
  Zero as emptyPositive,
  fromNumber as readPositive
} from "visual/utils/math/Positive";
import { config } from "../../../../../../jest-utils/mocks";
import { css as cssStyleCorners } from "../css";

describe("Testing cssStyleCorners that should return CSS for border-radius", () => {
  const v = readPositive(5) ?? emptyPositive;

  const _value: OptionValue<"corners"> = {
    type: "grouped",
    value: v,
    unit: "px",
    topLeft: v,
    topLeftUnit: "px",
    topRight: v,
    topRightUnit: "px",
    bottomLeft: v,
    bottomLeftUnit: "px",
    bottomRight: v,
    bottomRightUnit: "px",
    tempTopLeft: v,
    tempTopLeftUnit: "px",
    tempTopRight: v,
    tempTopRightUnit: "px",
    tempBottomRight: v,
    tempBottomRightUnit: "px",
    tempBottomLeft: v,
    tempBottomLeftUnit: "px"
  };

  test("Without meta, should return empty string", () => {
    expect(cssStyleCorners({ value: _value, config })).toBe("");
  });

  test("Grouped, should return grouped border radius", () => {
    expect(
      cssStyleCorners({ meta: { isGrouped: true }, value: _value, config })
    ).toBe("border-radius:5px;");
  });

  test("Ungrouped, should return ungrouped border radius", () => {
    expect(
      cssStyleCorners({ meta: { isUngrouped: true }, value: _value, config })
    ).toBe("border-radius:5px 5px 5px 5px;");
  });
});
