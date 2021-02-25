import { fromValue } from "./utils";
import { Value } from "./types/Value";

describe("Testing 'fromValue' function", function() {
  const values: Value[] = [
    { value: 0, unit: "px" },
    { value: 1, unit: "vh" },
    { value: 100, unit: "" }
  ];
  test("Value should be be converted to Element by renaming `number` key to `value` and `unit` to `suffix`", () => {
    values.forEach(v =>
      expect(fromValue(v)).toEqual({ value: v.value, suffix: v.unit })
    );
  });
});
