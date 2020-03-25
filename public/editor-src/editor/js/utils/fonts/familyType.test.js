import {
  GOOGLE,
  toType,
  types,
  UPLOAD
} from "visual/utils/fonts/familyType";
import { testToValue } from "visual/utils/value/utilites.test";

describe("Testing 'GOOGLE' constant", function() {
  test("Should be 'google'", () => {
    expect(GOOGLE).toBe("google");
  });
});

describe("Testing 'UPLOAD' const", function() {
  test("Should be 'upload'", () => {
    expect(UPLOAD).toBe("upload");
  });
});

describe("Testing 'types' constant", function() {
  test("Should be [GOOGLE, UPLOAD]", () => {
    expect(types).toEqual([GOOGLE, UPLOAD]);
  });
});

describe("Testing 'toType' function", function() {
  testToValue(toType, types, [undefined, null, 1, "test", {}]);
});
