import { fromValue } from "./utils";
import { Value } from "./types/Value";

describe("Testing 'fromValue' function", function() {
  const values: Value[] = [
    { number: 0, unit: "px" },
    { number: 1, unit: "vh" },
    { number: 100, unit: "" }
  ];
  test("Value should be be converted to Element by renaming `number` key to `value` and `unit` to `suffix`", () => {
    values.forEach(v =>
      expect(fromValue(v)).toEqual({ value: v.number, suffix: v.unit })
    );
  });
});
