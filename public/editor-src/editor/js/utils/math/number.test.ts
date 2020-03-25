import { testReader } from "visual/utils/types/Type.test";
import { read } from "visual/utils/math/number";

describe("Testing NumberSpec Type implementation", function() {
  testReader(
    read,
    [-1, 0, 1, -1.1, 0.1, 1.1, "-1", "0", "1", "-1.1", "0.1", "1.1"],
    [undefined, null, "", "a", "1a", "a1", {}, []]
  );
});
