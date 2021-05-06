import * as Type from "./Type";
import { testReader } from "visual/utils/types/Type.test";
import { testMonoid } from "visual/utils/types/Monoid.test";

describe("Testing 'read' function", function() {
  testReader(Type.read, Type.types, [undefined, null, "test", 1, [], {}]);
});

describe("Testing BoxShadow Type monoidal behavior", function() {
  testMonoid(Type, Type.types);
});
