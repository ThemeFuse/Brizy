import { eq, read, String } from "visual/utils/string/specs";
import { testReader } from "visual/utils/types/Type.test";
import { testMonoid } from "visual/utils/types/Monoid.test";
import { testEq } from "visual/utils/types/Eq.test";

describe("Testing String reader behavior", function() {
  testReader(
    read,
    ["", "0", "test", 0, 1, 2, 3],
    [{}, () => ({}), [], undefined, null]
  );
});

describe("Testing String Monoid implementation", function() {
  testMonoid(String, ["", "0", "a", "test", "1234"]);
});

describe("Testing String Eq implementation", function() {
  testEq(eq, "test", "test", "test2");
});
