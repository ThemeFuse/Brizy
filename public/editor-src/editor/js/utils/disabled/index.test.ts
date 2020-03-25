import { testReader } from "visual/utils/types/Type.test";
import { Disabled, DisabledType, read } from "./index";
import { testMonoid } from "visual/utils/types/Monoid.test";

describe("Testing 'read' function", function() {
  testReader(read, [true, false], [undefined, null, {}, [], 1, "test"]);
});

describe("Testing monoid behaviour function", function() {
  testMonoid<Disabled>(DisabledType, [true, false]);
});
