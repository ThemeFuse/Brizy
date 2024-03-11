import { times, identity as id } from "underscore";
import * as Width from "./width";
import { testMonoid } from "visual/utils/types/Monoid.test";

const widths = times(100, id).map(Width.unsafe);

describe("Testing 'empty' value", function() {
  test("Should be 0", () => {
    expect(Width.empty).toBe(0);
  });
});

describe("Testing Border Width monoidal behavior", function() {
  testMonoid(Width, widths);
});
