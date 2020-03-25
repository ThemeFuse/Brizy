import { times, identity as id } from "underscore";
import * as Width from "./width";
import { testReader } from "visual/utils/types/Type.test";
import { testMonoid } from "visual/utils/types/Monoid.test";

const widths = times(100, id);
const invalidWidths = [undefined, null, "test", -1];

describe("Testing 'empty' value", function() {
  test("Should be 0", () => {
    expect(Width.empty).toBe(0);
  });
});

describe("Testing 'read' function", function() {
  testReader(Width.read, widths, invalidWidths);
});

describe("Testing Border Width monoidal behavior", function() {
  testMonoid(Width, widths);
});
