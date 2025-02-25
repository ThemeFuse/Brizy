import { identity as id } from "es-toolkit";
import { times } from "es-toolkit/compat";
import { testMonoid } from "visual/utils/types/Monoid.test";
import * as Width from "./width";

const widths = times(100, id).map(Width.unsafe);

describe("Testing 'empty' value", function () {
  test("Should be 0", () => {
    expect(Width.empty).toBe(0);
  });
});

describe("Testing Border Width monoidal behavior", function () {
  testMonoid(Width, widths);
});
