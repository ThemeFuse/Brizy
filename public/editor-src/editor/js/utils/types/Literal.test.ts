import { testReader } from "visual/utils/types/Type.test";
import { read } from "visual/component/Controls/MultiSelect/types/Value";

describe("Testing Value Type integration", function() {
  test("If value type is number, return number", () => {
    expect(read(2)).toBe(2);
  });

  test("If value type is string number, return string", () => {
    expect(read("2")).toBe("2");
  });

  testReader(read, [1, "1", "abc", -22, 0, ""], [undefined, null, [], {}]);
});
