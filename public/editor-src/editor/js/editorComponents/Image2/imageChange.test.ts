import { ElementModel } from "visual/component/Elements/Types";
import { Value, elementModelToValue } from "./imageChange";

describe("Testing 'elementModelToValue' function", () => {
  test("Match properties", () => {
    const input: ElementModel = {
      widthSuffix: "px",
      heightSuffix: "%",
      showOriginalImage: "on",
      width: 45,
      height: 50
    };

    const output: Value = {
      widthSuffix: "px",
      heightSuffix: "%",
      showOriginalImage: "on",
      width: 45,
      height: 50
    };

    expect(elementModelToValue(input)).toStrictEqual(output);
  });
});
