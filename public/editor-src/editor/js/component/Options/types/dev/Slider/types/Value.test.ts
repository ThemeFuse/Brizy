import { eq } from "visual/component/Options/types/dev/Slider/types/Value";
import { testEq } from "visual/utils/types/Eq.test";

describe("Testing 'Value.eq' function", function () {
  testEq(
    eq,
    { value: 1, unit: "px" },
    { value: 1, unit: "px" },
    { value: 10, unit: "vh" }
  );
});
