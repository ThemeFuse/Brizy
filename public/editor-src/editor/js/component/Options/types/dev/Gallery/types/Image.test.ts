import { eq } from "visual/component/Options/types/dev/Gallery/types/Image";
import { testEq } from "visual/utils/types/Eq.test";

const image = { uid: "img-1", width: 100, height: 50 };

describe("Testing 'Image.eq' function", function () {
  testEq(eq, image, { ...image }, { uid: "img-2", width: 200, height: 80 });

  // Regression guards. `eq` used to read `a.width === a.width` and
  // `a.height === a.height`, so it only ever compared `uid` and every
  // dimension change was swallowed by the Gallery onChange filter.
  // Each case below differs from `image` in exactly one field, so it pins
  // one of the two sites on its own.
  test("images differing only by width are not equal", () => {
    expect(eq(image, { ...image, width: 200 })).toBe(false);
  });

  test("images differing only by height are not equal", () => {
    expect(eq(image, { ...image, height: 80 })).toBe(false);
  });

  test("fileName is not part of the comparison", () => {
    expect(eq({ ...image, fileName: "a.png" }, { ...image })).toBe(true);
  });
});
