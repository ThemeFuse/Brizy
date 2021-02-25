import { empty, SizeSuffix } from "visual/utils/fonts/SizeSuffix";

describe("Testing 'defaultSuffix' constant", function() {
  test("Should be 'px'", () => {
    expect(empty).toBe(SizeSuffix.px);
  });
});
