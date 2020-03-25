import { testEq } from "visual/utils/types/Eq.test";
import { eq } from "visual/component/Options/types/dev/Slider/types/Value";

describe("Testing 'Value.eq' function", function() {
  testEq(
    eq,
    { number: 1, unit: "px" },
    { number: 1, unit: "px" },
    { number: 10, unit: "vh" }
  );
});
